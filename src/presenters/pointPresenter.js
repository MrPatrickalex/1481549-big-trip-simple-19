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
  #offersByType = null;
  #destinations = null;

  #pointComponent = null;
  #pointEditComponent = null;

  #onDataChange = null;

  #mode = Mode.DEFAULT;
  #onModeChange = null;

  isSuccess = true;

  constructor({point, offersByType, destinations, pointsView, onDataChange, onModeChange}) {
    this.#point = point;
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
      offersByType: this.#offersByType,
      allDestinations: this.#destinations,
      onEditClick: () => this.#showEditMode.call(this)
    });
    this.#pointEditComponent = new EditEventView({
      point: this.#point,
      offersByType: this.#offersByType,
      allDestinations: this.#destinations,
      isNewEvent: false,
      onCloseClick: () => {
        this.#closeEditMode.call(this);
      },
      onSubmitClick: async (point) => {
        await this.#handleFormSubmit(point);
        if(this.isSuccess) {
          this.#closeEditMode.call(this);
        }
      },
      onDeleteClick: async (point) => {
        await this.#handlePointDelete(point);
        if(this.isSuccess) {
          this.#closeEditMode.call(this);
        }
      }
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

  setSaving() {
    this.#pointEditComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setDeleting() {
    this.#pointEditComponent.updateElement({
      isDisabled: true,
      isDeleting: true,
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

  #handleFormSubmit = async (point) => {
    await this.#onDataChange(
      UserAction.UPDATE_TASK,
      UpdateType.PATCH,
      point,
    );
  };

  #handlePointDelete = async (point) => {
    await this.#onDataChange(
      UserAction.DELETE_TASK,
      UpdateType.MINOR,
      point,
    );
  };
}
