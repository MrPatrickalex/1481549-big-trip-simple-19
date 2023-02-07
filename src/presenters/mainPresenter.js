import {render, remove, RenderPosition} from '../framework/render.js';
// import EditEventView from '../views/editEventView.js';
import ContentView from '../views/contentView.js';
import HeaderView from '../views/headerView.js';
import PointsView from '../views/pointsView.js';
import SortView from '../views/sortView.js';
import EmptyListView from '../views/emptyListBoilerplate.js';
import dayjs from 'dayjs';
import PointPresenter from './pointPresenter.js';
import NewPointPresenter from './newPointPresenter.js';
import Observable from '../framework/observable.js';
import { BLANK_POINT, SortType } from '../const.js';
import {UserAction, UpdateType} from '../const.js';

export default class MainPresenter extends Observable {
  #headerView = null;
  #sortView = null;
  #contentView = new ContentView();
  #pointsView = new PointsView();
  #emptyView = new EmptyListView();

  #bodyContainer = null;
  #pointsModel = null;

  #offers = null;
  #destinations = null;
  #sortings = null;
  #offersByType = null;

  #isNewEventOpened = false;
  #newEventPresenter = null;
  #pointPresentersMap = new Map();

  #currentSortType = SortType.DEFAULT;

  constructor({bodyContainer, pointsModel}) {
    super();
    this.#bodyContainer = bodyContainer;
    this.#pointsModel = pointsModel;
    //this.#points = this.#pointsModel.points;
    this.#offers = this.#pointsModel.offers;
    this.#offersByType = this.#pointsModel.offersByType;
    this.#destinations = this.#pointsModel.destinations;
    this.#sortings = this.#pointsModel.sortingsFilters;

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    switch(this.#currentSortType) {
      case SortType.DAY:
        return [...this.#pointsModel.points.sort((p1, p2) => {
          if(dayjs(p1.date_from).isBefore(dayjs(p2.date_from))) {
            return -1;
          } else {
            return 1;
          }
        })];
      case SortType.EVENT:
        return [...this.#pointsModel.points];
      case SortType.TIME:
        return [...this.#pointsModel.points.sort((p1, p2) => {
          const timeFirst = dayjs(p1.date_from).hour() * 60 + dayjs(p1.date_from).minute();
          const timeSecond = dayjs(p2.date_from).hour() * 60 + dayjs(p2.date_from).minute();

          if(timeFirst < timeSecond) {
            return -1;
          } else {
            return 1;
          }
        })];
      case SortType.PRICE:
        return [...this.#pointsModel.points.sort((p1, p2) => {
          if(p1.base_price < p2.base_price) {
            return -1;
          } else {
            return 1;
          }
        })];
      case SortType.OFFER:
        break;
    }
    return this.#pointsModel.points;
  }

  init() {
    this.#renderHeader();
    this.#renderContentContainer();
    this.#renderSort();
    this.#renderPointsContainer();
    this.#renderPointsList();
  }

  #resetFiter() {
    // this.#points = this.#pointsModel
    //   .getPoints();
    // this.#renderPoints();
  }

  #resetSort() {
    // this.#sortTasks(SortType.DAY);
    // this.#renderPoints();
  }

  #renderHeader() {
    this.#headerView = new HeaderView({
      onAllClick: () => {
        this.#resetFiter();
      },
      onFutureClick: () => {
        // this.#points = this.#pointsModel
        //   .getPoints()
        //   .filter((p) => dayjs().isBefore(p.date_from));
        // this.#renderPoints();
      },
      onNewEventClick: () => {
        if(!this.#isNewEventOpened) {
          console.log('render newEvent');
          this.#resetFiter();
          this.#resetSort();
          this.#renderNewEvent();
          this.#isNewEventOpened = true;
        }
      }
    });

    render(this.#headerView, this.#bodyContainer, RenderPosition.AFTERBEGIN);
  }

  #renderContentContainer() {
    render(this.#contentView, this.#bodyContainer);
  }

  #renderSort() {
    const contentElement = this.#contentView.element;
    const contentContainer = contentElement.querySelector('.trip-events');

    this.#sortView = new SortView({
      sortings: this.#sortings,
      onSortCLick: (sortType) => {
        if(this.#currentSortType === sortType) {
          return;
        }
        this.#currentSortType = sortType;
        this.#clearPointsList();
        this.#renderPointsList();
      }
    });
    render(this.#sortView, contentContainer);
  }

  #renderPointsContainer() {
    const contentElement = this.#contentView.element;
    const contentContainer = contentElement.querySelector('.trip-events');
    render(this.#pointsView, contentContainer);
  }

  #renderNewEvent() {
    if(this.#newEventPresenter === null) {
      this.#newEventPresenter = new NewPointPresenter({
        point: BLANK_POINT,
        offersByType: this.#offersByType,
        offers: this.#offers,
        destinations: this.#destinations,
        pointsView: this.#pointsView,
        onClose: () => {
          this.#isNewEventOpened = false;
          remove(this.#headerView);
          this.#renderHeader();
        },
        onSubmit: (actionType, updateType, update) => {
          this.#isNewEventOpened = false;
          remove(this.#headerView);
          this.#renderHeader();
          this.#handleViewAction(actionType, updateType, update);
        }
      });
    }

    this.#newEventPresenter.renderPoint();
  }

  #renderPointsList() {
    const contentElement = this.#contentView.element;
    const contentContainer = contentElement.querySelector('.trip-events');

    if(this.points.length > 0) {
      this.points.forEach((p) => this.createPoint(p));
    } else {
      render(this.#emptyView, contentContainer);
    }
  }

  createPoint(point) {
    const pointPresenter = new PointPresenter({
      point,
      allOffers: this.#offers,
      offersByType: this.#offersByType,
      destinations: this.#destinations,
      pointsView: this.#pointsView,
      onDataChange: this.#handleViewAction,
      onModeChange: () => this.#handleModeChange()
    });

    this.#pointPresentersMap.set(point.id, pointPresenter);
    pointPresenter.renderPoint();
  }

  #clearPointsList() {
    this.#pointPresentersMap.forEach((presenter) => presenter.destroy());
    this.#pointPresentersMap.clear();
  }

  #handleViewAction = (actionType, updateType, update) => {
    console.log('ViewAction', actionType, updateType, update);

    switch(actionType) {
      case UserAction.UPDATE_TASK:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_TASK:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_TASK:
        this.#pointsModel.removePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    //console.log('ModelAction', updateType, data);
    const pointPresenter = this.#pointPresentersMap.get(data.id);

    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
        pointPresenter.point = data;
        pointPresenter.renderPoint();
        break;
      case UpdateType.MINOR:
        this.#clearPointsList();
        this.#renderPointsList();
        // - обновить список (например, когда задача ушла в архив)
        break;
      case UpdateType.MAJOR:
        // - обновить всю доску (например, при переключении фильтра)
        break;
    }
  };

  #handleModeChange = () => {
    this.#pointPresentersMap.forEach((presenter) => presenter.resetView());
  };
}
