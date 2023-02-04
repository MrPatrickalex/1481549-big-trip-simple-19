import {render, replace, remove} from '../framework/render.js';
import {isEscapeKey} from '../utils.js';
import EditEventView from '../views/editEventView.js';
import EventView from '../views/eventView.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #pointsView = null;
  #point = null;
  #offers = null;
  #destinations = null;

  #pointComponent = null;
  #pointEditComponent = null;

  #onDataChange = null;

  #mode = Mode.DEFAULT;
  #onModeChange = null;

  constructor({point, offers, destinations, pointsView, onDataChange, onModeChange}) {
    this.#point = point;
    this.#offers = offers;
    this.#destinations = destinations;
    this.#pointsView = pointsView;
    this.#onDataChange = onDataChange;
    this.#onModeChange = onModeChange;
  }

  get point() {
    return this.#point;
  }

  set point(point) {
    this.#point = point;
  }

  renderPoint() {
    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    const pointOffers = this.#offers.filter((o) => this.#point.offers.some((o2) => o2 === o.id));
    const [pointDestination] = this.#destinations.filter((d) => d.id === this.#point.destination);

    this.#pointComponent = new EventView({
      point: this.#point,
      pointOffers,
      pointDestination,
      onEditClick: () => this.#showEditMode.call(this)
    });
    this.#pointEditComponent = new EditEventView({
      point: this.#point,
      pointOffers,
      pointDestination,
      allOffers: this.#offers,
      allDestinations: this.#destinations,
      onCloseClick: () => this.#closeEditMode.call(this),
      onSubmitClick: () => this.#closeEditMode.call(this),
      onOfferChange: (offerId) => this.#handleOfferChange(offerId)
    });

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#pointComponent, this.#pointsView.element);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  #escapeHander = (event) => {
    if(isEscapeKey(event)) {
      this.#closeEditMode.call(this);
    }
  };

  #changeViewToForm() {
    replace(this.#pointEditComponent, this.#pointComponent);
    this.#onModeChange();
    this.#mode = Mode.EDITING;
  }

  #changeFormToView() {
    replace(this.#pointComponent, this.#pointEditComponent);
    this.#mode = Mode.DEFAULT;
  }

  #showEditMode() {
    if(this.#mode === Mode.EDITING) {
      return;
    }
    this.#changeViewToForm.call(this);
    document.addEventListener('keydown', this.#escapeHander);
  }

  #closeEditMode() {
    if(this.#mode === Mode.DEFAULT) {
      return;
    }
    this.#changeFormToView.call(this);
    document.removeEventListener('keydown', this.#escapeHander);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#changeFormToView();
    }
  }

  #handleOfferChange = (offerId) => {
    const newOffers = this.#point.offers.includes(offerId)
      ? [...this.#point.offers.filter((o) => o.id !== offerId)]
      : [...this.#point.offers, offerId];

    this.#onDataChange({...this.#point, offers: newOffers});
  };
}
