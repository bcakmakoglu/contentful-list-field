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
import { FieldAPI, FieldExtensionSDK, WindowAPI } from '@contentful/app-sdk';
import { css } from 'emotion';
import List from './List';
import { Entity, InstanceParameters, Item, Tag } from '../types';
import DropDown from './DropDown';
import EntityList from './EntityList';
import { createEntity, createItem, createTag } from '../utils';

interface FieldProps {
  sdk: FieldExtensionSDK;
}

/**
 * The Field component is the List App which shows up
 * in the Contentful field.
 *
 * The Field expects and uses a `Contentful JSON field`.
 */
const Field = ({ sdk }: FieldProps) => {
  const [items, setItems] = useState<Item[]>([]);
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const window: WindowAPI | null = sdk.window ?? null;
  const field: FieldAPI | null = sdk.field ?? null;
  const {
    valueName = 'Value',
    keyName = 'Key',
    valueOptions = undefined,
    keyOptions = undefined,
    uniqueKeys = false,
    checkbox = false,
    taggable = false,
  }: InstanceParameters = sdk.parameters?.instance ?? {};
  const itemTaggable = (item: Item) => Array.isArray(item.value) && taggable;

  useEffect(() => {
    resize();
  });

  const resize = () => {
    // This ensures our app has enough space to render
    window?.startAutoResizer();

    // Every time we change the value on the field, we update internal state
    field?.onValueChanged((value: Item[]) => {
      if (Array.isArray(value)) {
        setItems(value);
      }
    });
  };

  /** Adds another item to the list */
  const addNewItem = (type: 'string' | 'entity' = 'string') => {
    const item = createItem(type, taggable);
    field?.setValue([...items, item]);
  };

  /** Handle change */
  const onChange = (item: Item, val: string, property = 'value') => {
    const itemList = items.concat();
    const index = itemList.findIndex((i) => i.id === item.id);
    let value: Item['value'] = val;
    if (itemTaggable(item) && property === 'value') {
      // clear whitespace and split possible multiple tags
      const tags = val.split(',');
      const newTags: Tag[] = [];
      let id = -1;
      tags.forEach((tag) => {
        // split into key value (i.e. key:value => { key: string, value: string })
        const [k, v] = tag.split(':');
        if (item.value.length > 0 && id === -1) {
          id = parseInt((item.value as Tag[]).reduce((prev, curr) => (prev.id > curr.id ? prev : curr)).id, 10);
        }
        id++;
        newTags.push(
          createTag({
            id: `${id}`,
            key: k ?? '',
            value: v ?? '',
          })
        );
      });
      value = [...(item.value as Tag[]), ...newTags];
    }
    itemList.splice(index, 1, { ...item, [property]: value });

    field?.setValue(itemList);
  };

  /** Deletes an item from the list */
  const deleteItem = (item: Item) => {
    field?.setValue(items.filter((i) => i.id !== item.id));
  };

  /** Sets checked property of an item, unsets all others */
  const setActiveOption = (item: Item) => {
    field?.setValue(
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
      field?.setValue(itemList);
    }
  };

  const saveValue = (item: Item, entity: Entity, index: number) => {
    const itemList = items.concat();
    if (Array.isArray(item.value)) {
      item.value.splice(index, 1, entity);
      field?.setValue(itemList);
    }
  };

  const Value = (item: Item) => {
    let component;
    switch (item.type) {
      case 'entity':
        component = (
          <>
            <div
              id="entity-list-label"
              className={css({
                display: 'inline-block',
                color: '#111b2b',
                fontWeight: 500,
                marginBottom: '.5rem',
              })}
            >
              {valueName}
            </div>
            <EntityList
              items={(item as Item<'entity'>).value}
              onRemove={(_, i) => {
                removeValue(item, i);
              }}
              onSave={(entity) => {
                saveValue(item, entity, (item.value as Entity[]).indexOf(entity));
              }}
              onSort={(entities) => {
                const itemList = items.concat();
                itemList[itemList.indexOf(item)].value = entities;
                field?.setValue(itemList);
              }}
            >
              <Button
                size="small"
                buttonType="naked"
                icon="PlusCircle"
                onClick={() => {
                  const itemList = items.concat();
                  let id = -1;
                  if (item.value.length > 0 && id === -1) {
                    id = parseInt((item.value as Entity[]).reduce((prev, curr) => (prev.id > curr.id ? prev : curr)).id, 10);
                  }
                  id++
                  item.value = [...(item.value as Entity[]), createEntity({ id: String(id) })];
                  field?.setValue(itemList);
                }}
                style={{ marginTop: tokens.spacingS }}
              >
                Add Entity
              </Button>
            </EntityList>
          </>
        );
        break;
      case 'string':
      default:
        component = valueOptions ? (
          <SelectField
            onChange={(e) => onChange(item, e.target.value)}
            labelText="Options"
            name="optionSelect"
            id="optionSelect"
          >
            <Option value="" disabled>
              {valueName ? valueName : 'Select a value'}
            </Option>
            {valueOptions
              .split('|')
              .map((option) => (
                <Option key={option} value={option} selected={item.value === option}>
                  {option}
                </Option>
              ))}
          </SelectField>
        ) : (
          <>
            <TextField
              id="value"
              name="value"
              value={itemTaggable(item) ? '' : (item.value as string)}
              labelText={valueName}
              onChange={(e) => {
                if (!itemTaggable(item)) {
                  onChange(item, e.target.value);
                }
              }}
              textInputProps={{
                onKeyDown: (e: { key: string; target: Record<string, any> }) => {
                  if (itemTaggable(item)) {
                    if (e.key === 'Enter') {
                      onChange(item, e.target.value);
                    }
                  }
                },
              }}
            />
            {Array.isArray(item.value) && itemTaggable(item) ? (
              <List
                items={item.value}
                onSort={(tags) => {
                  const itemList = items.concat();
                  item.value = tags;
                  field?.setValue(itemList);
                }}
              >
                {(item.value as Tag[]).map((tag, i) => (
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
              </List>
            ) : null}
          </>
        );
        break;
    }
    return component;
  };

  const Key = (item: Item, index: number) => {
    return keyOptions ? (
      <SelectField
        onChange={(e) => onChange(item, e.target.value, 'key')}
        labelText={keyName}
        name="optionSelect"
        id="optionSelect"
      >
        <Option value="" disabled>
          {keyName ? keyName : 'Select a key'}
        </Option>
        {keyOptions
          .split('|')
          .map((option) => (
            <Option
              key={option}
              disabled={uniqueKeys && items.some((i, y) => index !== y && i.key === option)}
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
        key={item.id}
        labelText={keyName}
        value={item.key}
        onChange={(e) => {
          onChange(item, e.target.value, 'key')
        }}
        textInputProps={{
          type: 'text',
          error: uniqueKeys && items.some((i, y) => index !== y && i.key === item.key),
        }}
      />
    );
  };

  return (
    <div className={css({ minHeight: dropDownOpen ? 140 : undefined })}>
      <Table data-testid="list-field">
        <TableBody>
          <List
            items={items}
            onSort={(items) => {
              field?.setValue(items);
            }}
          >
            {items.map((item, index) => (
              <TableRow key={`row-${item.id}`}>
                {checkbox ? (
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
                <TableCell>{Key(item, index)}</TableCell>
                <TableCell className={css({ maxWidth: 320 })}>{Value(item)}</TableCell>
                <TableCell align="right">
                  <EditorToolbarButton label="delete" icon="Delete" onClick={() => deleteItem(item)} />
                </TableCell>
              </TableRow>
            ))}
          </List>
        </TableBody>
      </Table>
      <DropDown onToggle={(open) => setDropDownOpen(open)} onSelect={addNewItem} />
    </div>
  );
};

export default Field;
