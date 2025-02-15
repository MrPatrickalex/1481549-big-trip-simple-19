import { FilterType } from '../const.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

const createFiltersTemplate = (currentFilter) => `
    <form class="trip-filters" action="#" method="get">
      <div class="trip-filters__filter">
          <input ${currentFilter === FilterType.EVERYTHING ? 'checked' : null}  id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything">
          <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
      </div>

      <div class="trip-filters__filter">
        <input ${currentFilter === FilterType.FUTURE ? 'checked' : null} id="filter-future" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="future">
        <label class="trip-filters__filter-label" for="filter-future">Future</label>
      </div>

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
`;

const createHeaderTemplate = (isLoading, isNewEventOpened, currentFilter) =>
  `
    <header class="page-header">
      <div class="page-body__container  page-header__container">
        <img class="page-header__logo" src="img/logo.png" width="42" height="42" alt="Trip logo">

        <div class="trip-main">
          <section class="trip-main__trip-info  trip-info">
            <div class="trip-info__main">
              <h1 class="trip-info__title">My BigTrip</h1>

              <p class="trip-info__dates">Sometimes…</p>
            </div>
          </section>
          <div class="trip-main__trip-controls  trip-controls">
            <div class="trip-controls__filters">
              <h2 class="visually-hidden">Filter events</h2>
              ${createFiltersTemplate(currentFilter)}
            </div>
          </div>

          <button ${isNewEventOpened || isLoading ? 'disabled' : null} class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>
        </div>
      </div>
    </header>
  `;

export default class HeaderView extends AbstractStatefulView {
  #handleAllClick = null;
  #handleFutureClick = null;
  #handleNewEventClick = null;
  #currentFilter = null;
  #isLoading = false;
  #isNewEventOpened = false;

  constructor({currentFilter, isLoading, isNewEventOpened, onAllClick, onFutureClick, onNewEventClick}) {
    super();

    this._setState({
      isLoading,
      isNewEventOpened
    });

    this.#handleAllClick = onAllClick;
    this.#handleFutureClick = onFutureClick;
    this.#handleNewEventClick = onNewEventClick;
    this.#currentFilter = currentFilter;

    this._restoreHandlers();
  }

  get template() {
    return createHeaderTemplate(this._state.isLoading, this._state.isNewEventOpened, this.#currentFilter);
  }

  #allClickHandler = (event) => {
    event.preventDefault();
    this.#handleAllClick();
  };

  #futureClickHandler = (event) => {
    event.preventDefault();
    this.#handleFutureClick();
  };

  #newEventClickHandler = (event) => {
    event.preventDefault();
    // this.updateElement({newEventClicked: !this._state.newEventClicked});
    this.#handleNewEventClick();
  };

  _restoreHandlers() {
    this.element.querySelector('#filter-everything')
      .addEventListener('click', this.#allClickHandler);
    this.element.querySelector('#filter-future')
      .addEventListener('click', this.#futureClickHandler);
    this.element.querySelector('.trip-main__event-add-btn')
      .addEventListener('click', this.#newEventClickHandler);
  }
}
