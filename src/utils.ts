import {Entity, Item} from './types';
import { v4 as uuid } from 'uuid';

export function createItem(type: 'string' | 'entity' = 'string', taggable = false) {
  let value: Item['value'] = '';
  switch (type) {
    case 'entity':
      value = [createEntity()];
      break;
    case 'string':
    default:
      value = taggable ? [] : ''
          break;

  }
  const item: Item<typeof type> = {
    id: uuid(),
    type,
    key: '',
    value: value
  };
  return item;
}

export function createEntity(): Entity {
  return { id: '0', title: 'Placeholder title', description: 'Placeholder description' };
}
