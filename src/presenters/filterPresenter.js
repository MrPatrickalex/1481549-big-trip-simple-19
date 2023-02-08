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

  constructor({filterModel, onAllClick, onFutureClick, onNewEventClick, bodyContainer}) {
    super();

    this.#onAllClick = onAllClick;
    this.#onFutureClick = onFutureClick;
    this.#onNewEventClick = onNewEventClick;

    this.#bodyContainer = bodyContainer;

    this.#filterModel = filterModel;
  }

  init() {
    this.#headerView = new HeaderView({
      currentFilter: this.#filterModel.filter,
      onAllClick: () => {
        this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      },
      onFutureClick: () => {
        this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.FUTURE);
      },
      onNewEventClick: () => {
        this.#onNewEventClick();
      }
    });

    render(this.#headerView, this.#bodyContainer, RenderPosition.AFTERBEGIN);
  }

  reset() {
    if(this.#headerView) {
      remove(this.#headerView);
    }
  }

  #handleAllFilterClick = () => {
    this.#filterModel.setFilter(UpdateType.MINOR, FilterType.EVERYTHING);
  };

  #handleFutureFilterClick = () => {
    this.#filterModel.setFilter(UpdateType.MINOR, FilterType.FUTURE);
  };

  // #handleModelEvent = (updateType, data) => {
  //   this.#onModelChange(updateType, data);
  // };
}
