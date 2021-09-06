import React, { ReactElement } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { EntityListItem, Icon } from '@contentful/forma-36-react-components';
import { css } from 'emotion';

interface ItemProps {
  id: string;
  title: string;
  dropdownListElements: ReactElement;
}

const Item = ({ id, title, dropdownListElements }: ItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition ?? '',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={css({
        boxShadow: isDragging ? '1px 1px 15px 0px rgba(0,0,0,0.5)' : undefined,
        position: 'relative',
        zIndex: isDragging ? 99999 : 0,
      })}
    >
      <EntityListItem
        withThumbnail={false}
        withDragHandle={true}
        cardDragHandleComponent={
          <div
            {...attributes}
            {...listeners}
            className={css({
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              borderRight: '1px solid #cfd9e0',
              width: '1.25rem',
              backgroundColor: '#f7f9fa',
              cursor: isDragging ? 'grabbing' : 'grab',
              transition: 'all 250ms ease',
              '&:hover': {
                backgroundColor: '#cfd9e0',
                scale: '1.1',
              },
            })}
          >
            <Icon color={isDragging ? 'positive' : 'muted'} icon="Drag" />
          </div>
        }
        title={title}
        dropdownListElements={dropdownListElements}
      />
    </div>
  );
};

export default Item;
