import { getRandomArrayElement, getRandomInteger } from '../utils.js';
import { SortType, TYPES } from '../const.js';

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

const SORTINGS = [
  {
    classList: 'trip-sort__item--day',
    value: 'sort-day',
    id: 'sort-day',
    label: 'Day',
    disabled: false,
    sortType: SortType.DAY,
  },
  {
    classList: 'trip-sort__item--event',
    value: 'sort-event',
    id: 'sort-event',
    label: 'Event',
    disabled: true,
    sortType: SortType.EVENT,
  },
  {
    classList: 'trip-sort__item--time',
    value: 'sort-time',
    id: 'sort-time',
    label: 'Time',
    disabled: false,
    sortType: SortType.TIME,
  },
  {
    classList: 'trip-sort__item--price',
    value: 'sort-price',
    id: 'sort-price',
    label: 'Price',
    disabled: false,
    sortType: SortType.PRICE,
  },
  {
    classList: 'trip-sort__item--offer',
    value: 'sort-offer',
    id: 'sort-offer',
    label: 'Offers',
    disabled: false,
    sortType: SortType.OFFER,
  },
];

const createIdGenerator = (min, max) => {
  let usedIds = [];
  let ids = [];
  for (let i = min; i <= max; i++) {
    ids = [...ids, i];
  }
  return () => {
    const notUsedIds = ids.filter((id) => !usedIds.includes(id));
    const randomId = notUsedIds[getRandomInteger(0, notUsedIds.length - 1)];
    usedIds = [...usedIds, randomId];
    return randomId;
  };
};

const offerIdGenerator = createIdGenerator(1, 100);
const destinationIdGenerator = createIdGenerator(1, 100);
const pointsIdGenerator = createIdGenerator(1, 100);

const createDestination = () => (
  {
    'id': destinationIdGenerator(),
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
  'id': offerIdGenerator(),
  'title': 'Upgrade to a business class',
  'price': getRandomInteger(100, 200)
});

const offers = Array.from({length: 10}, createOffer);
const destinations = Array.from({length: 10}, createDestination);

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
    'id': pointsIdGenerator(),
    'offers': [getRandomArrayElement(offers).id],
    'type': getRandomArrayElement(TYPES)
  }
);

const points = Array.from({length: 15}, createPoint);

export const getPoints = () => points;
export const getOffers = () => offers;
export const getDestinations = () => destinations;
export const getSortings = () => SORTINGS;

