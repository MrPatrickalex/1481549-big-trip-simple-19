import AbstractView from '../framework/view/abstract-view.js';

const createSortTemplate = (sortings) => `
  <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${sortings.map((s) => `
      <div class="trip-sort__item  ${s.classList}">
        <input id="${s.id}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="${s.value}" ${s.disabled ? 'disabled' : ''}>
        <label class="trip-sort__btn" for="${s.id}">${s.label}</label>
      </div>`).join('')}
  </form>
`;


export default class SortView extends AbstractView {
  #sortings = null;
  #handleSort = null;

  constructor({sortings, onSortCLick}) {
    super();
    this.#sortings = sortings;
    this.#handleSort = onSortCLick;

    this.#sortings.forEach((s) => {
      const filter = this.element.querySelector(`#${s.id}`);
      filter.addEventListener(
        'click', (event) => this.#sortClickHandler(event, s.sort));
    });
  }

  get template() {
    return createSortTemplate(this.#sortings);
  }

  #sortClickHandler = (event, sortingFunction) => {
    event.preventDefault();
    this.#handleSort(sortingFunction);
  };
}
