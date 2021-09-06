import React, { ReactElement, useEffect, useState } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

interface ListProps {
  items: any[];
  onSort?: (items: any[]) => void;
  children?: ReactElement[];
}

const List = ({ items: propitems, onSort = () => {}, children }: ListProps) => {
  const [items, setItems] = useState(propitems);
  useEffect(() => setItems(() => propitems), [propitems]);
  const sensors = useSensors(
    useSensor(PointerSensor)
  );

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {children}
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
