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
              cursor: isDragging ? 'grabbing' : 'grab',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            })}
          >
            <Icon color="muted" icon="Drag">
              Foobar
            </Icon>
          </div>
        }
        title={`${id} - Entity ${title}`}
        dropdownListElements={dropdownListElements}
      />
    </div>
  );
};

export default Item;
