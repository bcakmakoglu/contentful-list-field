import { Entity, Item, Tag } from './types';
import { v4 as uuid } from 'uuid';

export function createItem(type: 'string' | 'entity' = 'string', taggable = false) {
  let value: Item['value'];
  switch (type) {
    case 'entity':
      value = [createEntity()];
      break;
    case 'string':
    default:
      value = taggable ? [] : '';
      break;
  }
  const item: Item<typeof type> = {
    id: uuid(),
    type,
    key: '',
    value: value,
  };
  return item;
}

export function createEntity(entity?: Partial<Entity>): Entity {
  return {
    id: '0',
    title: 'Placeholder title',
    data: [{ id: '0', key: '', value: '' }],
    ...entity,
  };
}

export function createTag(tag?: Partial<Tag>): Tag {
  return {
    id: '0',
    key: '',
    value: '',
    ...tag,
  };
}
