import AbstractView from '../framework/view/abstract-view.js';

const createFiltersTemplate = () => `
    <form class="trip-filters" action="#" method="get">
      <div class="trip-filters__filter">
          <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything">
          <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
      </div>

      <div class="trip-filters__filter">
        <input id="filter-future" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="future">
        <label class="trip-filters__filter-label" for="filter-future">Future</label>
      </div>

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
`;

const createHeaderTemplate = () =>
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
              ${createFiltersTemplate()}
            </div>
          </div>

          <button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>
        </div>
      </div>
    </header>
  `;

export default class HeaderView extends AbstractView {
  get template() {
    return createHeaderTemplate();
  }
}
