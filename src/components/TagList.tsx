import React, { ReactElement, useEffect, useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Tag as TTag } from '../types';
import Tag from './Tag';

interface TagListProps {
  tags: TTag[];
  onSort: (tags: TTag[]) => void;
  children?: ReactElement[];
}

const TagList = ({ tags, onSort = () => {}, children }: TagListProps) => {
  const [items, setItems] = useState(tags);
  useEffect(() => setItems(() => tags), [tags]);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {items.map((item, i) =>
          children && children[i] ? (
            <Tag key={item.id} id={`${items[i].id}`}>
              {children[i]}
            </Tag>
          ) : null
        )}
      </SortableContext>
    </DndContext>
  );

  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (active.id !== over.id) {
      const activeTag = items.find((item) => item.id === active.id) as TTag;
      const oldIndex = items.indexOf(activeTag);
      const overTag = items.find((item) => item.id === over.id) as TTag;
      const newIndex = items.indexOf(overTag);
      setItems((items) => {
        return arrayMove(items, oldIndex, newIndex);
      });
      onSort(arrayMove(items, oldIndex, newIndex));
    }
  }
};

export default TagList;
