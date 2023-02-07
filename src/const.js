import { nanoid } from 'nanoid';

export const EVENT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

export const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFER: 'offer'
};

export const BLANK_POINT = {
  'base_price': 0,
  'date_from': new Date(),
  'date_to': new Date(),
  'destination': -1,
  'id': nanoid(),
  'offers': [],
  'type': EVENT_TYPES[0]
};
