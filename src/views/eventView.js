import AbstractView from '../framework/view/abstract-view.js';
import { capitalizeFirstLetter } from '../utils.js';
import dayjs from 'dayjs';

const DATE_FORMAT = 'MMM D';
const DATE_TIME_FORMAT = 'HH:mm';

const createTemplate = (point, offers, destination) => {
  const { base_price, date_from, date_to, type } = point;

  const date = dayjs(date_from).format(DATE_FORMAT);
  const dateFrom = dayjs(date_from).format(DATE_TIME_FORMAT);
  const dateTo = dayjs(date_to).format(DATE_TIME_FORMAT);

  const destinationName = destination ? destination.name : '';
  const typeCap = capitalizeFirstLetter(type);

  // console.log(offers);

  return `
  <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${date_from}">${date}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${typeCap} ${destinationName}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${date_from}">${dateFrom}</time>
            &mdash;
            <time class="event__end-time" datetime="${date_to}">${dateTo}</time>
          </p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${base_price}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
        ${offers.map(({title, price}) => `
          <li class="event__offer">
            <span class="event__offer-title">${title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${price}</span>
          </li>`).join('')}
        </ul>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>
  `;
};

export default class EventView extends AbstractView {
  #point = null;
  #pointOffers = null;
  #pointDestination = null;
  #handleEditClick = null;

  constructor({point, allOffers, allDestinations, onEditClick}) {
    super();

    // console.log(point.offers);

    const pointOffers = allOffers.filter((o) => point.offers.some((o2) => o2 === o.id));
    const [pointDestination] = allDestinations.filter((d) => d.id === point.destination);

    this.#point = point;
    this.#handleEditClick = onEditClick;
    this.#pointOffers = pointOffers;
    this.#pointDestination = pointDestination;

    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#handleEditClick);
  }

  get template() {
    return createTemplate(this.#point, this.#pointOffers, this.#pointDestination);
  }

  #editClickHandler = (event) => {
    event.preventDefault();
    this.#handleEditClick();
  };
}
