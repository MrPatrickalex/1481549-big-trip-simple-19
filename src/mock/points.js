import { getRandomArrayElement, getRandomInteger } from '../utils.js';

const TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
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
      }
    ]
  }
);

const createPoint = () => (
  {
    'base_price': getRandomInteger(0, 2000),
    'date_from': new Date(getRandomInteger(2010, 2022), getRandomInteger(1, 12), getRandomInteger(1,28)),
    'date_to': new Date(getRandomInteger(2010, 2022), getRandomInteger(1, 12), getRandomInteger(1,28)),
    'destination': getRandomInteger(1, 100),
    'id': `${getRandomInteger(1, 100)}`,
    'offers': getRandomInteger(1, 100),
    'type': getRandomArrayElement(TYPES)
  }
);


const getRandomPoints = (count) => Array.from({length: count}, createPoint);

