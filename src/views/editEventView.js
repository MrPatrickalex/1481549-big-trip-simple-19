import { capitalizeFirstLetter, removeWhiteSpaces } from '../utils.js';
import dayjs from 'dayjs';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {EVENT_TYPES} from '../const.js';

const DATE_FORMAT = 'DD/MM/YY HH:mm';

const createCustomDescription = (name) => ({
  id: 0,
  description: '',
  name: name,
  pictures: []
});

const createCheckboxId = (id, title) => `event-offer-${removeWhiteSpaces(title)}${id}-1`;

const createEventTypeElementTemplate = (point, type) => `
      <div class="event__type-item">
        <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${point.type === type ? 'checked' : null}">
        <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${capitalizeFirstLetter(type)}</label>
      </div>`;

const createEventTypeSection = (point) =>
  `
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${point ? point.type : 'flight'}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${EVENT_TYPES.map((et) => createEventTypeElementTemplate(point, et)).join('')}
          </fieldset>
        </div>
      </div>`;

const createDestinationsTemplate = (point, pointDestination, allDestinations) => `
    <div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-1">
        ${capitalizeFirstLetter(point.type)}
      </label>
      <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" list="destination-list-1" value=${pointDestination.name ? pointDestination.name : ''}>
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
    <input class="event__offer-checkbox visually-hidden" data-id=${id} id=${createCheckboxId(id, title)} type="checkbox" name="event-offer-luggage" ${checked ? 'checked' : ''}>
    <label class="event__offer-label" for=${createCheckboxId(id, title)}>
    <span class="event__offer-title">${title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${price}</span>
    </label>
  </div>
`;

const createOfferSectionTemplate = (selectedOffer, pointOffers, offersByType) => {
  const [offersForCurrentType] = offersByType.filter((o) => o.type === selectedOffer);
  const offers = offersForCurrentType.offers;
  return `
  <section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
      ${offers.map((o) => createOfferTemplate({...o, checked: pointOffers && pointOffers.some((o2) => o2.id === o.id)})).join('')}
    </div>
  </section>`;
};

const createDestinationImages = ({description, pictures}) => `
  <section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${description ? description : ''}</p>
    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${pictures ? pictures.map((p) => `<img class="event__photo" src="${p.src}" alt="${p.description}">`) : ''}
      </div>
    </div>
  </section>
`;

const createTemplate = (point, pointOffers, pointDestination, allDestinations, offersByType) => `
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        ${createEventTypeSection(point)}
        ${createDestinationsTemplate(point, pointDestination, allDestinations)}
        ${createEventDateTemplate(point)}
        ${createEventPriceTemplate(point)}
        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Cancel</button>
      </header>
      <section class="event__details">
        ${createOfferSectionTemplate(point.type, pointOffers, offersByType)}
        ${createDestinationImages(pointDestination)}
      </section>
    </form>
`;

export default class EditEventView extends AbstractStatefulView {
  #offersByType = null;
  #allOffers = null;
  #allDestinations = null;
  #handleClose = null;
  #handleSubmit = null;
  #handleOfferChange = null;

  constructor({point, pointOffers, pointDestination, offersByType, allOffers, allDestinations, onCloseClick, onSubmitClick, onOfferChange}) {
    super();

    this._setState(this.#parsePointToState(point, pointOffers, pointDestination));

    // console.log(this._state);

    this.#offersByType = offersByType;
    this.#allOffers = allOffers;
    this.#allDestinations = allDestinations;
    this.#handleClose = onCloseClick;
    this.#handleSubmit = onSubmitClick;
    this.#handleOfferChange = onOfferChange;

    this._restoreHandlers();
  }

  get template() {
    return createTemplate(
      this._state.point,
      this._state.pointOffers,
      this._state.pointDestination,
      this.#allDestinations,
      this.#offersByType);
  }

  #parsePointToState(point, pointOffers, pointDestination) {
    return {
      point,
      pointOffers,
      pointDestination
    };
  }

  #parseStateToPoint(point, pointOffers, poinDestination) {
    return {
      point,
      pointOffers,
      poinDestination
    };
  }

  _restoreHandlers() {
    this.element.querySelector('.event__reset-btn')
      .addEventListener('click', this.#closeClickHandler);

    this.element.querySelector('.event__save-btn')
      .addEventListener('click', this.#submitClickHandler);

    this.element.querySelectorAll('.event__offer-checkbox')
      .forEach((checkbox) => checkbox.addEventListener('click', this.#offerClickHandler));

    this.element.querySelectorAll('.event__type-input')
      .forEach((eventTypeEl) => eventTypeEl.addEventListener('click', this.#eventTypeClickHandler));

    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationChangeHandler);
  }

  #closeClickHandler = (event) => {
    event.preventDefault();
    this.#handleClose();
  };

  #submitClickHandler = (event) => {
    event.preventDefault();
    this.#handleSubmit();
  };

  #offerClickHandler = (event) => {
    event.preventDefault();
    const checkbox = event.target;
    const offerId = +checkbox.dataset.id;

    const oldPoint = this._state.point;
    const oldOffers = oldPoint.offers;

    console.log(oldOffers);

    const newOffers = oldOffers.includes(offerId)
      ? [...oldOffers.filter((o) => o !== offerId)]
      : [...oldOffers, offerId];

    const pointOffers = this.#allOffers.filter((o) => newOffers.some((o2) => o2 === o.id));

    this.updateElement({
      point: {...this._state.point, offers: newOffers},
      pointOffers: pointOffers
    });
    // this.#handleOfferChange(offerId);
  };

  #destinationChangeHandler = (event) => {
    event.preventDefault();

    const destinationInput = event.target;
    const destinationInputValue = destinationInput.value;

    const findedDestinations = this.#allDestinations.find(d => d.name === destinationInputValue);

    this.updateElement({
      ...this._state,
      pointDestination: findedDestinations ? findedDestinations : createCustomDescription(destinationInputValue)
    });

    console.log(this._state);
  };

  #eventTypeClickHandler = (event) => {
    event.preventDefault();
    const type = event.target.value;
    this.updateElement({point: {...this._state, type: type}});
  };
}
