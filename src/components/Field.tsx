import React, { useEffect, useState } from 'react';
import {
  Button,
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
} from '@contentful/forma-36-react-components';
import tokens from '@contentful/forma-36-tokens';
import { FieldExtensionSDK } from '@contentful/app-sdk';
import { v4 as uuid } from 'uuid';
import { css } from 'emotion';
import TagList from './TagList';
import { InstanceParameters, Item, Tag } from '../types';

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
  const { valueName = 'Value' } = params;

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
  const addNewItem = () => {
    const newItem = {
      id: uuid(),
      key: '',
      value: params.taggable ? [] : '',
    };
    props.sdk.field.setValue([...items, newItem]);
  };

  /** Handle change */
  const onChange = (item: Item, val: string, property = 'value') => {
    const itemList = items.concat();
    const index = itemList.findIndex((i) => i.id === item.id);
    let value: Item['value'] = val;
    if (taggable(item) && Array.isArray(item.value)) {
      const tag = val.split(':');
      const newTag: Tag = {
        id: `${item.value.length + 1}`,
        key: tag[0] ?? '',
        value: tag[1] ?? '',
      };
      value = [...item.value, newTag];
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
  const removeTag = (item: Item, index: number) => {
    const itemList = items.concat();
    if (Array.isArray(item.value)) {
      item.value.splice(index, 1);
      props.sdk.field.setValue(itemList);
    }
  };

  /** Checks if field values are taggable */
  const taggable = (item: Item) => Array.isArray(item.value) && params.taggable;

  return (
    <div>
      <Table>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
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
                <TextField
                  id="key"
                  name="key"
                  labelText="Key"
                  value={item.key}
                  onChange={(e) => onChange(item, e.target.value, 'key')}
                />
              </TableCell>
              <TableCell className={css({ maxWidth: 300 })}>
                {params.options ? (
                  <SelectField
                    onChange={(e) => onChange(item, e.target.value)}
                    labelText="Options"
                    name="optionSelect"
                    id="optionSelect"
                  >
                    <Option value="" disabled selected>
                      Select an option...
                    </Option>
                    {params.options.split('|').map((option) => (
                      <Option value={option}>{option}</Option>
                    ))}
                  </SelectField>
                ) : (
                  <>
                    <TextField
                      id="value"
                      name="value"
                      value={taggable(item) ? '' : (item.value as string)}
                      labelText={valueName}
                      textInputProps={{
                        onKeyDown: (e: { key: string; target: Record<string, any> }) => {
                          if (e.key === 'Enter') {
                            if (taggable(item)) {
                              onChange(item, e.target.value);
                            }
                          }
                        },
                      }}
                    />
                    {Array.isArray(item.value) && taggable(item) ? (
                      <TagList
                        tags={item.value}
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
                            onClose={() => removeTag(item, i)}
                            onDrag={() => {}}
                          />
                        ))}
                      </TagList>
                    ) : null}
                  </>
                )}
              </TableCell>
              <TableCell align="right">
                <EditorToolbarButton label="delete" icon="Delete" onClick={() => deleteItem(item)} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button buttonType="naked" onClick={addNewItem} icon="PlusCircle" style={{ marginTop: tokens.spacingS }}>
        Add Item
      </Button>
    </div>
  );
};

export default Field;
