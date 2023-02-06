import {render, replace, remove, RenderPosition} from '../framework/render.js';
import {isEscapeKey} from '../utils.js';
import EditEventView from '../views/editEventView.js';

export default class NewPointPresenter {
  #pointsView = null;
  #point = null;
  offersByType = null;
  #offers = null;
  #destinations = null;

  #pointEditComponent = null;

  #onDataChange = null;
  #onClose = null;
  #onSubmit = null;

  constructor({point, offersByType, offers, destinations, pointsView, onDataChange, onClose, onSubmit}) {
    this.#point = point;
    this.#offers = offers;
    this.offersByType = offersByType;
    this.#destinations = destinations;
    this.#pointsView = pointsView;
    this.#onDataChange = onDataChange;
    this.#onClose = onClose;
    this.#onSubmit = onSubmit;
  }

  get point() {
    return this.#point;
  }

  set point(point) {
    this.#point = point;
  }

  renderPoint() {
    const prevPointEditComponent = this.#pointEditComponent;

    // const pointOffers = this.offersByType.filter((o) => this.#point.offers.some((o2) => o2 === o.id));
    // const [pointDestination] = this.#destinations.filter((d) => d.id === this.#point.destination);

    this.#pointEditComponent = new EditEventView({
      point: this.#point,
      pointOffers: [],
      pointDestination: [],
      offersByType: this.offersByType,
      allOffers: this.#offers,
      allDestinations: this.#destinations,
      onCloseClick: () => this.#closeHandler(),
      onSubmitClick: () => this.#submitHandler(),
      onOfferChange: (offerId) => this.#handleOfferChange(offerId)
    });

    document.addEventListener('keydown', this.#escapeHander);
    if(prevPointEditComponent === null) {
      render(this.#pointEditComponent, this.#pointsView.element, RenderPosition.AFTERBEGIN);
      return;
    }
    replace(this.#pointEditComponent, prevPointEditComponent);
    remove(prevPointEditComponent);
  }

  #closeHandler = () => {
    this.#onClose();
    this.#closeEditMode.call(this);
  };

  #submitHandler = () => {
    this.#onSubmit();
    this.#closeEditMode.call(this);
  };

  destroy() {
    remove(this.#pointEditComponent);
  }

  #escapeHander = (event) => {
    if(isEscapeKey(event)) {
      this.#onClose();
      this.#closeEditMode.call(this);
    }
  };

  // #showEditMode() {
  //   if(this.#mode === Mode.EDITING) {
  //     return;
  //   }
  //   this.#changeViewToForm.call(this);
  //   document.addEventListener('keydown', this.#escapeHander);
  // }

  #closeEditMode() {
    // this.#changeFormToView.call(this);
    this.destroy();
    document.removeEventListener('keydown', this.#escapeHander);
  }

  resetView() {
    // this.#changeFormToView();
  }

  #handleOfferChange = (offerId) => {
    const newOffers = this.#point.offers.includes(offerId)
      ? [...this.#point.offers.filter((o) => o.id !== offerId)]
      : [...this.#point.offers, offerId];

    this.#onDataChange({...this.#point, offers: newOffers});
  };
}
