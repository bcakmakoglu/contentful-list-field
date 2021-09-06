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
    <div ref={setNodeRef} style={style}>
      <EntityListItem
        withThumbnail={false}
        withDragHandle={true}
        isDragActive={isDragging}
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
              '&:hover': {
                backgroundColor: '#cfd9e0',
              },
            })}
          >
            <Icon color="muted" icon="Drag" />
          </div>
        }
        title={title}
        dropdownListElements={dropdownListElements}
      />
    </div>
  );
};

export default Item;
