import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { SortType } from '../const.js';

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

const createSortTemplate = (currentSort) => `
  <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${SORTINGS.map((s) => `
      <div class="trip-sort__item  ${s.classList}">
        <input ${s.sortType === currentSort ? 'checked' : null} data-sort-type=${s.sortType} id="${s.id}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="${s.value}" ${s.disabled ? 'disabled' : ''}>
        <label class="trip-sort__btn" for="${s.id}">${s.label}</label>
      </div>`).join('')}
  </form>
`;


export default class SortView extends AbstractStatefulView {
  #handleSort = null;

  constructor({onSortCLick}) {
    super();

    this._setState({currentSort: SortType.DAY});

    this.#handleSort = onSortCLick;

    this._restoreHandlers();
  }

  get template() {
    return createSortTemplate(this._state.currentSort);
  }

  _restoreHandlers() {
    this.element.querySelectorAll('.trip-sort__input')
      .forEach((el) => el.addEventListener(
        'click', (event) => this.#sortClickHandler(event)));
  }

  #sortClickHandler = (event) => {
    event.preventDefault();
    const input = event.target;
    const sortType = input.dataset.sortType;
    this.#handleSort(sortType);
    this.updateElement({currentSort: sortType});
  };
}
