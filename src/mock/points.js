import { getRandomArrayElement, getRandomInteger } from '../utils.js';
import { SortType, EVENT_TYPES } from '../const.js';
import { nanoid } from 'nanoid';

const NAMES = ['Lorem', 'Cras', 'Aliquam', 'Nullam', 'Phasellus', 'Sed'];
const DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet',
  'Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.'
];
const OFFERS = [
  'Lorem ipsum ',
  'Cras aliquet varius',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex',
  'Phasellus eros mauris',
  'Sed blandit',
  'Sed sed nisi',
  'Aliquam erat volutpat.'
];

const createDestination = () => (
  {
    'id': nanoid(),
    'description': getRandomArrayElement(DESCRIPTIONS),
    'name': getRandomArrayElement(NAMES),
    'pictures': [
      {
        'src': `https://loremflickr.com/248/152?${getRandomInteger(1, 100)}`,
        'description': 'Chamonix parliament building'
      },
      {
        'src': `https://loremflickr.com/248/152?${getRandomInteger(1, 100)}`,
        'description': 'Chamonix parliament building'
      },
      {
        'src': `https://loremflickr.com/248/152?${getRandomInteger(1, 100)}`,
        'description': 'Chamonix parliament building'
      },
      {
        'src': `https://loremflickr.com/248/152?${getRandomInteger(1, 100)}`,
        'description': 'Chamonix parliament building'
      },
      {
        'src': `https://loremflickr.com/248/152?${getRandomInteger(1, 100)}`,
        'description': 'Chamonix parliament building'
      }
    ]
  }
);

const createOffer = () => ({
  'id': nanoid(),
  'title': getRandomArrayElement(OFFERS),
  'price': getRandomInteger(100, 200)
});

const offers = Array.from({length: 10}, createOffer);
const destinations = Array.from({length: 10}, createDestination);
const offersByType = EVENT_TYPES.map(
  (t) => ({
    type: t,
    offers: [getRandomArrayElement(offers),
      getRandomArrayElement(offers),
      getRandomArrayElement(offers)]}));

const createPoint = () => (
  {
    'base_price': getRandomInteger(0, 2000),
    'date_from': new Date(
      getRandomInteger(2021, 2026),
      getRandomInteger(1, 12),
      getRandomInteger(1,28),
      getRandomInteger(1, 12),
      getRandomInteger(0, 59)),
    'date_to': new Date(
      getRandomInteger(2021, 2026),
      getRandomInteger(1, 12),
      getRandomInteger(1,28),
      getRandomInteger(1, 12),
      getRandomInteger(0, 59)),
    'destination': getRandomArrayElement(destinations).id,
    'id': nanoid(),
    // 'offers': [offersByType[0].offers[0].id],
    // 'type': offersByType[0].type
    // 'offers': [getRandomArrayElement(offers).id],
    'offers': [],
    'type': getRandomArrayElement(EVENT_TYPES)
  }
);

const points = Array.from({length: 5}, createPoint);

export const getPoints = () => points;
export const getOffers = () => offers;
export const getDestinations = () => destinations;
export const getOffersByType = () => offersByType;

