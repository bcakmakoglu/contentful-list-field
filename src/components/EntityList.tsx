import React, { ReactElement, useState } from 'react';
import { DropdownList, DropdownListItem, EntityList, EntityListItem } from '@contentful/forma-36-react-components';
import { Entity } from '../types';
import EntityEditor from './EntityEditor';
import List from './List';

interface ItemListProps {
  items: Entity[];
  children?: ReactElement;
  onRemove?: (item: Entity, i: number) => void;
  onSave?: (item: Entity) => void;
  onSort?: (items: Entity[]) => void;
}

const EList = ({ items, children, onRemove = () => {}, onSave = () => {}, onSort = () => {} }: ItemListProps) => {
  const [showEditor, setShown] = useState(false);
  const [current, setCurrent] = useState<Entity>();

  return (
    <div>
      <EntityList>
        <List items={items} onSort={onSort}>
          {items.map((item, i) => (
            <EntityListItem
              key={`item-${i}`}
              title={`${item.id} - Entity ${item.title}`}
              dropdownListElements={
                <DropdownList>
                  <DropdownListItem isTitle>Actions</DropdownListItem>
                  <DropdownListItem
                    onClick={() => {
                      setShown(!showEditor);
                      setCurrent(item);
                    }}
                  >
                    Edit
                  </DropdownListItem>
                  <DropdownListItem onClick={() => onRemove?.(item, i)}>Remove</DropdownListItem>
                </DropdownList>
              }
            />
          ))}
        </List>
      </EntityList>
      {current ? (
        <EntityEditor
          show={showEditor}
          entity={current}
          onClose={() => {
            setShown(false);
          }}
          onSave={onSave}
        />
      ) : null}
      {children}
    </div>
  );
};

export default EList;
