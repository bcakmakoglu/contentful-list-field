import React, { ReactElement, useEffect, useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import Tag from './ListItem';

interface ListProps {
  items: any[];
  onSort?: (items: any[]) => void;
  children?: ReactElement[];
}

const List = ({ items: propitems, onSort = () => {}, children }: ListProps) => {
  const [items, setItems] = useState(propitems);
  useEffect(() => setItems(() => propitems), [propitems]);
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
      const activeTag = items.find((item) => item.id === active.id);
      const oldIndex = items.indexOf(activeTag);
      const overTag = items.find((item) => item.id === over.id);
      const newIndex = items.indexOf(overTag);
      setItems((items) => {
        return arrayMove(items, oldIndex, newIndex);
      });
      onSort(arrayMove(items, oldIndex, newIndex));
    }
  }
};

export default List;
