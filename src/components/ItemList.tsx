import React, { ReactElement, useState } from 'react';
import { DropdownList, DropdownListItem, EntityList, EntityListItem } from '@contentful/forma-36-react-components';
import { Entity } from '../types';
import EntityEditor from './EntityEditor';

interface ItemListProps {
  items: Entity[];
  children?: ReactElement;
  onRemove?: (item: Entity, i: number) => void;
}

const ItemList = ({ items, children, onRemove }: ItemListProps) => {
  const [showEditor, setShown] = useState(false);
  const [current, setCurrent] = useState<Entity>();

  return (
    <div>
      <EntityList>
        {items.map((item, i) => (
          <>
            <EntityListItem
              key={`item-${i}`}
              title="Entry title"
              description="Description"
              contentType="My content type"
              entityType="entry"
              dropdownListElements={
                <DropdownList>
                  <DropdownListItem isTitle>Actions</DropdownListItem>
                  <DropdownListItem
                    onClick={(e) => {
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
          </>
        ))}
      </EntityList>
      {current ? <EntityEditor show={showEditor} entity={current} onClose={() => { setShown(false)}} /> : null}
      {children}
    </div>
  );
};

export default ItemList;
