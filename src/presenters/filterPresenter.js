import {render, remove, RenderPosition} from '../framework/render.js';
import {UserAction, UpdateType} from '../const.js';
import HeaderView from '../views/headerView.js';
import Observable from '../framework/observable.js';
import {FilterType} from '../const.js';

export default class RoutePresenter extends Observable {
  #headerView = null;
  #bodyContainer = null;
  #filterModel = null;
  #onAllClick = null;
  #onFutureClick = null;
  #onNewEventClick = null;
  #onModelChange = null;
  #isLoading = false;
  #isNewEventOpened = false;

  constructor({filterModel, onAllClick, onFutureClick, onNewEventClick, bodyContainer, isLoading, isNewEventOpened}) {
    super();

    this.#onAllClick = onAllClick;
    this.#onFutureClick = onFutureClick;
    this.#onNewEventClick = onNewEventClick;
    this.#isLoading = isLoading;
    this.#isNewEventOpened = isNewEventOpened;

    this.#bodyContainer = bodyContainer;

    this.#filterModel = filterModel;
  }

  init() {
    this.#headerView = new HeaderView({
      currentFilter: this.#filterModel.filter,
      isLoading: this.#isLoading,
      isNewEventOpened: this.#isNewEventOpened,
      onAllClick: () => {
        this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      },
      onFutureClick: () => {
        this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.FUTURE);
      },
      onNewEventClick: () => {
        this.#onNewEventClick();
      },
    });

    render(this.#headerView, this.#bodyContainer, RenderPosition.AFTERBEGIN);
  }

  reset() {
    if(this.#headerView) {
      this.#isLoading = false;
      remove(this.#headerView);
    }
  }

  setIsNewEventOpening(value) {
    this.#headerView.updateElement({isNewEventOpened: value});
  }
}
