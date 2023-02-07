import {render, replace, remove} from '../framework/render.js';
import {isEscapeKey} from '../utils.js';
import EditEventView from '../views/editEventView.js';
import EventView from '../views/eventView.js';
import {UserAction, UpdateType} from '../const.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #pointsView = null;
  #point = null;
  #allOffers = null;
  #offersByType = null;
  #destinations = null;

  #pointComponent = null;
  #pointEditComponent = null;

  #onDataChange = null;

  #mode = Mode.DEFAULT;
  #onModeChange = null;

  constructor({point, allOffers, offersByType, destinations, pointsView, onDataChange, onModeChange}) {
    this.#point = point;
    this.#allOffers = allOffers;
    this.#offersByType = offersByType;
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

    this.#pointComponent = new EventView({
      point: this.#point,
      allOffers: this.#allOffers,
      allDestinations: this.#destinations,
      onEditClick: () => this.#showEditMode.call(this)
    });
    this.#pointEditComponent = new EditEventView({
      point: this.#point,
      allOffers: this.#allOffers,
      allDestinations: this.#destinations,
      offersByType: this.#offersByType,
      onCloseClick: () => {
        // this.resetView();
        this.#closeEditMode.call(this);
      },
      onSubmitClick: (point) => {
        // console.log(point);
        this.#handleFormSubmit(point);
        this.#closeEditMode.call(this);
      },
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

  #handleFormSubmit = (point) => {
    this.#onDataChange(
      UserAction.UPDATE_TASK,
      UpdateType.PATCH,
      point,
    );
  };
}
