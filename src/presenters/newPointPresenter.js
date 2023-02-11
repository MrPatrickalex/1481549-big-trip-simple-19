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

  isSuccess = true;

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
    this.#pointEditComponent = new EditEventView({
      point: this.#point,
      offersByType: this.offersByType,
      allDestinations: this.#destinations,
      isNewEvent: true,
      onCloseClick: () => this.#closeHandler(),
      onSubmitClick: async (point) => {
        await this.#handleFormSubmit(point);
        if(this.isSuccess) {
          this.#closeEditMode.call(this);
          this.#onSubmit();
        }
      },
    });

    document.addEventListener('keydown', this.#escapeHander);
    render(this.#pointEditComponent, this.#pointsView.element, RenderPosition.AFTERBEGIN);
  }

  setSaving() {
    this.#pointEditComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    this.#pointEditComponent.shake(() => {
      this.resetFormState();
      this.isSuccess = true;
    });
  }

  resetFormState() {
    this.#pointEditComponent.updateElement({
      isDisabled: false,
      isSaving: false,
      isDeleting: false
    });
  }

  #closeHandler = () => {
    this.#closeEditMode.call(this);
    this.#onClose();
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

  #handleFormSubmit = async (point) => {
    await this.#onDataChange(
      UserAction.ADD_TASK,
      UpdateType.MINOR,
      point,
    );
  };
}
