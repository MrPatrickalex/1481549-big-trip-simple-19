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

const createEventTypeElementTemplate = (point, type, isDisabled) => `
      <div class="event__type-item">
        <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${point.type === type ? 'checked' : null} ${isDisabled ? 'disabled = true' : null}">
        <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${capitalizeFirstLetter(type)}</label>
      </div>`;

const createEventTypeSection = (point, isDisabled) =>
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
            ${EVENT_TYPES.map((et) => createEventTypeElementTemplate(point, et, isDisabled)).join('')}
          </fieldset>
        </div>
      </div>`;

const createDestinationsTemplate = (point, pointDestination, allDestinations, isDisabled) => `
    <div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-1">
        ${capitalizeFirstLetter(point.type)}
      </label>
      <input ${isDisabled ? 'disabled = true' : null} class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" list="destination-list-1" value=${pointDestination.name ? pointDestination.name : ''}>
      <datalist id="destination-list-1">
        ${allDestinations.map((d) => `<option value="${d.name}" selected="${d === pointDestination}"></option>`)}
      </datalist>
    </div>
`;

const createEventDateTemplate = (point, isDisabled) => `
  <div class="event__field-group  event__field-group--time">
    <label class="visually-hidden" for="event-start-time-1">From</label>
    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${point !== null && point.dateFrom ? dayjs(point.dateFrom).format(DATE_FORMAT) : dayjs().format(DATE_FORMAT)}" ${isDisabled ? 'disabled = true' : null}>
    &mdash;
    <label class="visually-hidden" for="event-end-time-1">To</label>
    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${point !== null && point.dateTo ? dayjs(point.dateTo).format(DATE_FORMAT) : dayjs().format(DATE_FORMAT)}" ${isDisabled ? 'disabled = true' : null}>
  </div>
`;


const createEventPriceTemplate = (point, isDisabled) => `
  <div class="event__field-group  event__field-group--price">
    <label class="event__label" for="event-price-1">
    <span class="visually-hidden">Price</span>
    &euro;
    </label>
    <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${point ? point.basePrice : ''}" ${isDisabled ? 'disabled = true' : null}>
  </div>
`;

const createOfferTemplate = ({id, title, price, checked, isDisabled}) => `
  <div class="event__offer-selector">
    <input class="event__offer-checkbox visually-hidden" data-id=${id} id=${createCheckboxId(id, title)} type="checkbox" name="event-offer-luggage" ${checked ? 'checked' : ''} ${isDisabled ? 'disabled = true' : null}>
    <label class="event__offer-label" for=${createCheckboxId(id, title)}>
    <span class="event__offer-title">${title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${price}</span>
    </label>
  </div>
`;

const createOfferSectionTemplate = (selectedOffer, pointOffers, offersByType, isDisabled) => {
  const [offersForCurrentType] = offersByType.filter((o) => o.type === selectedOffer);
  const offers = offersForCurrentType.offers;
  return `
  <section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
      ${offers.map((o) => createOfferTemplate({...o, checked: pointOffers && pointOffers.some((o2) => o2.id === o.id), isDisabled})).join('')}
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

const createTemplate = (point, pointOffers, pointDestination, allDestinations, offersByType, isNewEvent, isDisabled, isSaving, isDeleting) => {
  let deleteOrCancelBtnText = '';
  if(!isNewEvent) {
    deleteOrCancelBtnText = isDeleting ? 'Deleting...' : 'Delete';
  } else {
    deleteOrCancelBtnText = 'Cancel';
  }

  return `
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          ${createEventTypeSection(point, isDisabled)}
          ${createDestinationsTemplate(point, pointDestination, allDestinations, isDisabled)}
          ${createEventDateTemplate(point, isDisabled)}
          ${createEventPriceTemplate(point, isDisabled)}
          <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : 'null'}>${isSaving ? 'Saving...' : 'Save'}</button>
          <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : 'null'}>${deleteOrCancelBtnText}</button>
        </header>
        <section class="event__details">
          ${createOfferSectionTemplate(point.type, pointOffers, offersByType, isDisabled)}
          ${createDestinationImages(pointDestination)}
        </section>
      </form>
  `;
};

export default class EditEventView extends AbstractStatefulView {
  #offersByType = null;
  #allDestinations = null;
  #fromDatepicker = null;
  #toDatepicker = null;
  #handleClose = null;
  #handleDelete = null;
  #handleSubmit = null;
  #isNewEvent = false;

  constructor({point, offersByType, allDestinations, isNewEvent, onCloseClick, onSubmitClick, onDeleteClick}) {
    super();

    const [offersForPoint] = offersByType.filter((o) => o.type === point.type);
    const pointOffers = offersForPoint.offers.filter((o) => point.offers.some((o2) => o2 === o.id));
    let [pointDestination] = allDestinations.filter((d) => d.id === point.destination);

    if(!pointDestination) {
      pointDestination = createCustomDescription('');
    }

    this._setState(this.#parsePointToState(point, pointOffers, pointDestination));

    this.#offersByType = offersByType;
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
      this.#isNewEvent,
      this._state.isDisabled,
      this._state.isSaving,
      this._state.isDeleting);
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
      pointDestination,
      isDisabled: false,
      isSaving: false,
      isDeleting: false
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
    if(this._state.isDisabled) {
      this.#fromDatepicker = null;
      this.#toDatepicker = null;
      return;
    }
    this.#fromDatepicker = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.point.dateFrom,
        onChange: this.#fromDateChangeHandler,
      },
    );
    this.#toDatepicker = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        enableTime: true,
        minDate: this._state.point.dateFrom,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.point.dateTo,
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
    const offerId = +checkbox.dataset.id;

    const oldPoint = this._state.point;
    const oldOffers = oldPoint.offers;

    const newOffers = oldOffers.includes(offerId)
      ? [...oldOffers.filter((o) => o !== offerId)]
      : [...oldOffers, offerId];

    // console.log('oldOffers', oldOffers);
    // console.log('newOffers', newOffers);

    const [offersForPoint] = this.#offersByType.filter((o) => o.type === this._state.point.type);
    const pointOffers = offersForPoint.offers.filter((o) => newOffers.some((o2) => o2 === o.id));

    // const pointOffers = this.#allOffers.filter((o) => newOffers.some((o2) => o2 === o.id));

    this.updateElement({
      point: {...this._state.point, offers: newOffers},
      pointOffers: pointOffers
    });
  };

  #destinationChangeHandler = (event) => {
    event.preventDefault();

    const destinationInput = event.target;
    const destinationInputValue = destinationInput.value;

    const findedDestinations = this.#allDestinations.find((d) => d.name === destinationInputValue);

    this.updateElement({
      ...this._state,
      point: {...this._state.point, destination: findedDestinations ? findedDestinations.id : -1},
      pointDestination: findedDestinations ? findedDestinations : createCustomDescription(destinationInputValue)
    });
  };

  #eventTypeClickHandler = (event) => {
    event.preventDefault();
    const type = event.target.value;
    this.updateElement({point: {...this._state.point, type: type, offers: []}, pointOffers: []});
  };

  #priceChangeHandler = (event) => {
    event.preventDefault();
    const price = +event.target.value;
    this.updateElement({point: {...this._state.point, basePrice: price}});
  };

  #fromDateChangeHandler = ([userDate]) => {
    this.updateElement({
      point: {
        ...this._state.point,
        dateFrom: userDate
      }
    });
  };

  #toDateChangeHandler = ([userDate]) => {
    this.updateElement({
      point: {
        ...this._state.point,
        dateTo: userDate
      }
    });
  };
}
