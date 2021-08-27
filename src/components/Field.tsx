import React, { useEffect, useState } from 'react';
import {
  EditorToolbarButton,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  SelectField,
  RadioButtonField,
  Pill,
  Option,
  Button,
} from '@contentful/forma-36-react-components';
import tokens from '@contentful/forma-36-tokens';
import { FieldExtensionSDK } from '@contentful/app-sdk';
import { css } from 'emotion';
import TagList from './TagList';
import { Entity, InstanceParameters, Item, Tag } from '../types';
import DropDown from './DropDown';
import ItemList from './ItemList';
import { createEntity, createItem } from '../utils';

interface FieldProps {
  sdk: FieldExtensionSDK;
}

/** The Field component is the Repeater App which shows up
 * in the Contentful field.
 *
 * The Field expects and uses a `Contentful JSON field`
 */
const Field = (props: FieldProps) => {
  const [items, setItems] = useState<Item[]>([]);
  const params: InstanceParameters = props.sdk.parameters.instance;
  const { valueName = 'Value', keyName = 'Key' } = params;

  useEffect(() => {
    resize();
  });

  const resize = () => {
    // This ensures our app has enough space to render
    props.sdk.window.startAutoResizer();

    // Every time we change the value on the field, we update internal state
    props.sdk.field.onValueChanged((value: Item[]) => {
      if (Array.isArray(value)) {
        setItems(value);
      }
    });
  };

  /** Adds another item to the list */
  const addNewItem = (type: 'string' | 'entity' = 'string') => {
    const item = createItem(type, params.taggable);
    props.sdk.field.setValue([...items, item]);
  };

  /** Handle change */
  const onChange = (item: Item, val: string, property = 'value') => {
    const itemList = items.concat();
    const index = itemList.findIndex((i) => i.id === item.id);
    let value: Item['value'] = val;
    if (taggable(item) && property === 'value') {
      // clear whitespace and split possible multiple tags
      const tags = strip(val).split(',');
      const newTags: Tag[] = [];
      let id = -1;
      tags.forEach((tag) => {
        // split into key value (i.e. key:value => { key: string, value: string })
        const [k, v] = tag.split(':');
        if (item.value.length > 0 && id === -1) {
          id = parseInt((item.value as Tag[]).reduce((prev, curr) => (prev.id > curr.id ? prev : curr)).id, 10);
        }
        id++;
        const newTag: Tag = {
          id: `${id}`,
          key: k ?? '',
          value: v ?? '',
        };
        newTags.push(newTag);
      });
      value = [...(item.value as Tag[]), ...newTags];
    }
    itemList.splice(index, 1, { ...item, [property]: value });

    props.sdk.field.setValue(itemList);
  };

  /** Deletes an item from the list */
  const deleteItem = (item: Item) => {
    props.sdk.field.setValue(items.filter((i) => i.id !== item.id));
  };

  /** Sets checked property of an item, unsets all others */
  const setActiveOption = (item: Item) => {
    props.sdk.field.setValue(
      items.map((i) => {
        i.checked = item.id === i.id;
        return i;
      })
    );
  };

  /** Removes a tag from item */
  const removeValue = (item: Item, index: number) => {
    const itemList = items.concat();
    if (Array.isArray(item.value)) {
      item.value.splice(index, 1);
      props.sdk.field.setValue(itemList);
    }
  };

  /** Checks if field values are taggable */
  const taggable = (item: Item) => Array.isArray(item.value) && params.taggable;

  const Value = (item: Item) => {
    let component;
    switch (item.type) {
      case 'entity':
        component = (
          <ItemList items={(item as Item<'entity'>).value} onRemove={(_, i) => {
            removeValue(item, i)
          }}>
            <Button
              size="small"
              buttonType="naked"
              icon="PlusCircle"
              onClick={() => {
                const itemList = items.concat();
                item.value = [...(item.value as Entity[]), createEntity()];
                props.sdk.field.setValue(itemList);
              }}
              style={{ marginTop: tokens.spacingS }}
            >
              Add entity
            </Button>
          </ItemList>
        );
        break;
      case 'string':
      default:
        component = params.valueOptions ? (
          <SelectField
            onChange={(e) => onChange(item, e.target.value)}
            labelText="Options"
            name="optionSelect"
            id="optionSelect"
          >
            <Option value="" disabled selected>
              {valueName ? valueName : 'Select a value'}
            </Option>
            {strip(params.valueOptions)
              .split('|')
              .map((option) => (
                <Option key={option} value={option}>
                  {option}
                </Option>
              ))}
          </SelectField>
        ) : (
          <>
            <TextField
              id="value"
              name="value"
              value={taggable(item) ? '' : (item.value as string)}
              labelText={valueName}
              onChange={(e) => {
                if (!taggable(item)) {
                  onChange(item, e.target.value);
                }
              }}
              textInputProps={{
                onKeyDown: (e: { key: string; target: Record<string, any> }) => {
                  if (taggable(item)) {
                    if (e.key === 'Enter') {
                      onChange(item, e.target.value);
                    }
                  }
                },
              }}
            />
            {Array.isArray(item.value) && taggable(item) ? (
              <TagList
                tags={item.value as Tag[]}
                onSort={(tags) => {
                  const itemList = items.concat();
                  item.value = tags;
                  props.sdk.field.setValue(itemList);
                }}
              >
                {item.value.map((tag, i) => (
                  <Pill
                    key={`tag-${i}`}
                    className={css({
                      marginRight: tokens.spacingS,
                      marginTop: tokens.spacingS,
                    })}
                    tabIndex={0}
                    testId="pill-item"
                    label={`${tag.key}${tag.value ? ` ➡️ ${tag.value}` : ''}`}
                    onClose={() => removeValue(item, i)}
                    onDrag={() => {}}
                  />
                ))}
              </TagList>
            ) : null}
          </>
        );
        break;
    }
    return component;
  };

  return (
    <div>
      <Table>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={`row-${item.id}`}>
              {params.checkbox ? (
                <TableCell align="center">
                  <RadioButtonField
                    checked={item.checked}
                    value="true"
                    id="checkbox"
                    name="checkbox"
                    labelText=""
                    onChange={() => {
                      setActiveOption(item);
                    }}
                  />
                </TableCell>
              ) : null}
              <TableCell>
                {params.keyOptions ? (
                  <SelectField
                    onChange={(e) => onChange(item, e.target.value, 'key')}
                    labelText={keyName}
                    name="optionSelect"
                    id="optionSelect"
                  >
                    <Option value="" disabled>
                      {keyName ? keyName : 'Select a key'}
                    </Option>
                    {strip(params.keyOptions)
                      .split('|')
                      .map((option) => (
                        <Option
                          key={option}
                          disabled={params.uniqueKeys && items.some((i) => i.key === option)}
                          selected={option === item.key}
                          value={option}
                        >
                          {option}
                        </Option>
                      ))}
                  </SelectField>
                ) : (
                  <TextField
                    id="key"
                    name="key"
                    labelText={keyName}
                    value={item.key}
                    onChange={(e) => onChange(item, e.target.value, 'key')}
                    textInputProps={{
                      error: params.uniqueKeys && items.some((i, y) => index !== y && i.key === item.key),
                    }}
                  />
                )}
              </TableCell>
              <TableCell className={css({ maxWidth: 320 })}>{Value(item)}</TableCell>
              <TableCell align="right">
                <EditorToolbarButton label="delete" icon="Delete" onClick={() => deleteItem(item)} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <DropDown onSelect={addNewItem} />
    </div>
  );

  function strip(str: string): string {
    return str.replace(/\s+/g, '');
  }
};

export default Field;
