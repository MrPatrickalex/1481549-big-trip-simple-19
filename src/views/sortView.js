import {createElement} from '../render.js';

const SORTINGS = [
  {
    classList: 'trip-sort__item--day',
    value: 'sort-day',
    id: 'sort-day',
    label: 'Day',
    disabled: false
  },
  {
    classList: 'trip-sort__item--event',
    value: 'sort-event',
    id: 'sort-event',
    label: 'Event',
    disabled: true
  },
  {
    classList: 'trip-sort__item--time',
    value: 'sort-time',
    id: 'sort-time',
    label: 'Time',
    disabled: true
  },
  {
    classList: 'trip-sort__item--price',
    value: 'sort-price',
    id: 'sort-price',
    label: 'Price',
    disabled: false
  },
  {
    classList: 'trip-sort__item--offer',
    value: 'sort-offer',
    id: 'sort-offer',
    label: 'Offers',
    disabled: false
  },
];

const createSortTemplate = () => `
  <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${SORTINGS.map((s) => `
      <div class="trip-sort__item  ${s.classList}">
        <input id="${s.id}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="${s.value}" ${s.disabled ? 'disabled' : ''}>
        <label class="trip-sort__btn" for="${s.id}">${s.label}</label>
      </div>`).join('')}
  </form>
`;


export default class SortView {
  element = null;

  getElement() {
    if(!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }

  getTemplate() {
    return createSortTemplate();
  }
}
