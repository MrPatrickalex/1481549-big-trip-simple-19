import { capitalizeFirstLetter, removeWhiteSpaces } from '../utils.js';
import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
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

const createTemplate = (point, pointOffers, pointDestination, allDestinations, offersByType, isNewEvent) => `
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        ${createEventTypeSection(point)}
        ${createDestinationsTemplate(point, pointDestination, allDestinations)}
        ${createEventDateTemplate(point)}
        ${createEventPriceTemplate(point)}
        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">${isNewEvent ? 'Cancel' : 'Delete'}</button>
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
  #fromDatepicker = null;
  #toDatepicker = null;
  #handleClose = null;
  #handleDelete = null;
  #handleSubmit = null;
  #isNewEvent = false;

  constructor({point, allOffers, allDestinations, offersByType, onCloseClick, onSubmitClick, onDeleteClick, isNewEvent}) {
    super();

    const pointOffers = allOffers.filter((o) => point.offers.some((o2) => o2 === o.id));
    let [pointDestination] = allDestinations.filter((d) => d.id === point.destination);

    if(!pointDestination) {
      pointDestination = createCustomDescription('');
    }

    this._setState(this.#parsePointToState(point, pointOffers, pointDestination));

    this.#offersByType = offersByType;
    this.#allOffers = allOffers;
    this.#allDestinations = allDestinations;
    this.#handleClose = onCloseClick;
    this.#handleSubmit = onSubmitClick;
    this.#handleDelete = onDeleteClick;
    this.#isNewEvent = isNewEvent;

    this.#setDatepicker();

    this._restoreHandlers();
  }

  get template() {
    return createTemplate(
      this._state.point,
      this._state.pointOffers,
      this._state.pointDestination,
      this.#allDestinations,
      this.#offersByType,
      this.#isNewEvent);
  }

  removeElement() {
    super.removeElement();

    if (this.#fromDatepicker) {
      this.#fromDatepicker.destroy();
      this.#fromDatepicker = null;
    }

    if (this.#toDatepicker) {
      this.#toDatepicker.destroy();
      this.#toDatepicker = null;
    }
  }

  #parsePointToState(point, pointOffers, pointDestination) {
    return {
      point,
      pointOffers,
      pointDestination
    };
  }

  #parseStateToPoint() {
    return {
      ...this._state.point
    };
  }

  _restoreHandlers() {
    if(this.#isNewEvent) {
      this.element.querySelector('.event__reset-btn')
        .addEventListener('click', this.#closeClickHandler);
    } else {
      this.element.querySelector('.event__reset-btn')
        .addEventListener('click', this.#deleteClickHandler);
    }

    this.element.querySelector('.event__save-btn')
      .addEventListener('click', this.#submitClickHandler);

    this.element.querySelectorAll('.event__offer-checkbox')
      .forEach((checkbox) => checkbox.addEventListener('click', this.#offerClickHandler));

    this.element.querySelectorAll('.event__type-input')
      .forEach((eventTypeEl) => eventTypeEl.addEventListener('click', this.#eventTypeClickHandler));

    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationChangeHandler);

    this.element.querySelector('.event__input--price')
      .addEventListener('change', this.#priceChangeHandler);

    this.#setDatepicker();
  }

  #setDatepicker() {
    this.#fromDatepicker = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.point.date_from,
        onChange: this.#fromDateChangeHandler
      },
    );
    this.#toDatepicker = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        enableTime: true,
        minDate: this._state.point.date_from,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.point.date_to,
        onChange: this.#toDateChangeHandler
      },
    );
  }

  #closeClickHandler = (event) => {
    event.preventDefault();
    this.#handleClose();
  };

  #deleteClickHandler = (event) => {
    event.preventDefault();
    this.#handleDelete(this.#parseStateToPoint());
  };

  #submitClickHandler = (event) => {
    event.preventDefault();
    this.#handleSubmit(this.#parseStateToPoint());
  };

  #offerClickHandler = (event) => {
    event.preventDefault();
    const checkbox = event.target;
    const offerId = checkbox.dataset.id;

    const oldPoint = this._state.point;
    const oldOffers = oldPoint.offers;

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
      point: {...this._state.point, destination: findedDestinations.id},
      pointDestination: findedDestinations ? findedDestinations : createCustomDescription(destinationInputValue)
    });
  };

  #eventTypeClickHandler = (event) => {
    event.preventDefault();
    const type = event.target.value;
    this.updateElement({point: {...this._state.point, type: type, offers: []}});
  };

  #priceChangeHandler = (event) => {
    event.preventDefault();
    const price = event.target.value;
    this.updateElement({point: {...this._state.point, base_price: price}});
  };

  #fromDateChangeHandler = ([userDate]) => {
    this.updateElement({
      point: {
        ...this._state.point,
        date_from: userDate
      }
    });
  };

  #toDateChangeHandler = ([userDate]) => {
    this.updateElement({
      point: {
        ...this._state.point,
        date_to: userDate
      }
    });
  };
}
