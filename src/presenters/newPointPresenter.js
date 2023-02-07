import {render, remove, RenderPosition} from '../framework/render.js';
import {isEscapeKey} from '../utils.js';
import EditEventView from '../views/editEventView.js';
import {UserAction, UpdateType} from '../const.js';

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

  constructor({point, offersByType, offers, destinations, pointsView, onClose, onSubmit}) {
    this.#point = point;
    this.#offers = offers;
    this.offersByType = offersByType;
    this.#destinations = destinations;
    this.#pointsView = pointsView;
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
    this.#pointEditComponent = new EditEventView({
      point: this.#point,
      allOffers: this.#offers,
      allDestinations: this.#destinations,
      offersByType: this.offersByType,
      onCloseClick: () => this.#closeHandler(),
      onSubmitClick: (point) => {
        this.#handleFormSubmit(point);
        this.#closeEditMode.call(this);
      },
      onOfferChange: (offerId) => this.#handleOfferChange(offerId)
    });

    document.addEventListener('keydown', this.#escapeHander);
    render(this.#pointEditComponent, this.#pointsView.element, RenderPosition.AFTERBEGIN);
  }

  #closeHandler = () => {
    this.#closeEditMode.call(this);
    this.#onClose();
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


  #closeEditMode() {
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

  #handleFormSubmit = (point) => {
    this.#onSubmit(
      UserAction.ADD_TASK,
      UpdateType.MINOR,
      point,
    );
  };
}
