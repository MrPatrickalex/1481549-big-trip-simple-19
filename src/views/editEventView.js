import { capitalizeFirstLetter, removeWhiteSpaces } from '../utils.js';
import dayjs from 'dayjs';
import AbstractView from '../framework/view/abstract-view.js';

const DATE_FORMAT = 'DD/MM/YY HH:mm';

const EVENT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const createEventTypeElementTemplate = (type) => `
      <div class="event__type-item">
        <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}">
        <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${capitalizeFirstLetter(type)}</label>
      </div>`;

const createEventTypeSection = () => `
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/flight.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${EVENT_TYPES.map((et) => createEventTypeElementTemplate(et)).join('')}
          </fieldset>
        </div>
      </div>`;

const createDestinationsTemplate = (pointDestination, allDestinations) => `
    <div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-1">
        Flight
      </label>
      <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" list="destination-list-1">
      <datalist id="destination-list-1">
        ${allDestinations.map((d) => `<option value="${d.name}" selected="${d === pointDestination}"></option>`)}
      </datalist>
    </div>
`;

const createEventDateTemplate = (point) => `
  <div class="event__field-group  event__field-group--time">
    <label class="visually-hidden" for="event-start-time-1">From</label>
    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${point !== null && point.date_from ? dayjs(point.date_from).format(DATE_FORMAT) : dayjs().format(DATE_FORMAT)}">
    &mdash;
    <label class="visually-hidden" for="event-end-time-1">To</label>
    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${point !== null && point.date_to ? dayjs(point.date_to).format(DATE_FORMAT) : dayjs().format(DATE_FORMAT)}">
  </div>
`;


const createEventPriceTemplate = (point) => `
  <div class="event__field-group  event__field-group--price">
    <label class="event__label" for="event-price-1">
    <span class="visually-hidden">Price</span>
    &euro;
    </label>
    <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${point ? point.base_price : ''}">
  </div>
`;

const createOfferTemplate = ({id, title, price, checked}) => `
  <div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${removeWhiteSpaces(title)}${id}-1" type="checkbox" name="event-offer-luggage" ${checked ? 'checked' : ''}>
    <label class="event__offer-label" for="event-offer-${removeWhiteSpaces(title)}${id}-1">
    <span class="event__offer-title">${title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${price}</span>
    </label>
  </div>
`;

const createOfferSectionTemplate = (pointOffers, allOffers) => `
  <section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
      ${allOffers.map((o) => createOfferTemplate({...o, checked: pointOffers && pointOffers.some((o2) => o2.id === o.id)})).join('')}
    </div>
  </section>
`;

const createDestinationImages = ({description, pictures}) => `
  <section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${description}</p>
    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${pictures.map((p) => `<img class="event__photo" src="${p.src}" alt="${p.description}">`)}
      </div>
    </div>
  </section>
`;

const createTemplate = (point, pointOffers, pointDestination, allDestinations, allOffers) => `
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        ${createEventTypeSection()}
        ${createDestinationsTemplate(pointDestination, allDestinations)}
        ${createEventDateTemplate(point)}
        ${createEventPriceTemplate(point)}
        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Cancel</button>
      </header>
      <section class="event__details">
        ${createOfferSectionTemplate(pointOffers, allOffers)}
        ${createDestinationImages(allDestinations[0])}
      </section>
    </form>
`;

export default class EditEventView extends AbstractView {
  #point = null;
  #pointOffers = null;
  #pointDestination = null;
  #allOffers = null;
  #allDestinations = null;

  constructor({point, pointOffers, pointDestination, allOffers, allDestinations}) {
    super();
    this.#point = point;
    this.#pointOffers = pointOffers;
    this.#pointDestination = pointDestination;
    this.#allOffers = allOffers;
    this.#allDestinations = allDestinations;
  }

  get template() {
    return createTemplate(
      this.#point,
      this.#pointOffers,
      this.#pointDestination,
      this.#allDestinations,
      this.#allOffers);
  }
}
