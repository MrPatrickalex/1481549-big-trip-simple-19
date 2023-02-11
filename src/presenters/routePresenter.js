import {render, remove} from '../framework/render.js';
// import EditEventView from '../views/editEventView.js';
import ContentView from '../views/contentView.js';
import PointsView from '../views/pointsView.js';
import SortView from '../views/sortView.js';
import EmptyListView from '../views/emptyListBoilerplate.js';
import dayjs from 'dayjs';
import PointPresenter from './pointPresenter.js';
import NewPointPresenter from './newPointPresenter.js';
import FilterPresenter from './filterPresenter.js';
import Observable from '../framework/observable.js';
import { BLANK_POINT, FilterType, SortType } from '../const.js';
import {UserAction, UpdateType} from '../const.js';
import LoadingView from '../views/loadingView.js';

export default class RoutePresenter extends Observable {
  #sortView = null;
  #contentView = new ContentView();
  #pointsView = new PointsView();
  #emptyView = new EmptyListView();
  #loadingComponent = new LoadingView();

  #bodyContainer = null;
  #pointsModel = null;
  #filterModel = null;

  #isNewEventOpened = false;
  #filterPresenter = null;
  #newEventPresenter = null;
  #pointPresentersMap = new Map();

  #currentSortType = SortType.DEFAULT;
  #isLoading = true;

  constructor({bodyContainer, pointsModel, filterModel}) {
    super();
    this.#bodyContainer = bodyContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    let filtered = [];

    switch(this.#filterModel.filter) {
      case FilterType.EVERYTHING:
        filtered = [...this.#pointsModel.points];
        break;
      case FilterType.FUTURE:
        filtered = [...this.#pointsModel.points
          .filter((p) => dayjs(p.date_from).isAfter(dayjs()))];
        break;
    }

    console.log(this.#currentSortType);

    switch(this.#currentSortType) {
      case SortType.DAY:
        return [...filtered.sort((p1, p2) => {
          if(dayjs(p1.dateFrom).isBefore(dayjs(p2.dateFrom))) {
            return -1;
          } else {
            return 1;
          }
        })];
      case SortType.EVENT:
        return [...filtered];
      case SortType.TIME:
        return [...filtered.sort((p1, p2) => {
          const timeFirst = dayjs(p1.dateFrom).hour() * 60 + dayjs(p1.dateFrom).minute();
          const timeSecond = dayjs(p2.dateFrom).hour() * 60 + dayjs(p2.dateFrom).minute();

          if(timeFirst < timeSecond) {
            return -1;
          } else {
            return 1;
          }
        })];
      case SortType.PRICE:
        return [...filtered.sort((p1, p2) => {
          if(p1.basePrice < p2.basePrice) {
            return -1;
          } else {
            return 1;
          }
        })];
      case SortType.OFFER:
        break;
    }
    return filtered;
  }

  init() {
    this.#renderHeader();
    this.#renderContentContainer();
    this.#renderSort();
    this.#renderPointsContainer();
    this.#renderPointsList();
  }

  #renderLoading() {
    const contentElement = this.#contentView.element;
    const contentContainer = contentElement.querySelector('.trip-events');

    render(this.#loadingComponent, contentContainer);
  }

  #resetFiter() {
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
  }

  #resetSort() {
    this.#currentSortType = SortType.DAY;
  }

  #renderHeader() {
    if(!this.#filterPresenter) {
      this.#filterPresenter = new FilterPresenter({
        filterModel: this.#filterModel,
        onNewEventClick: () => {
          if(!this.#isNewEventOpened) {
            this.#resetFiter();
            this.#resetSort();
            this.#renderNewEvent();
            this.#filterPresenter.setIsNewEventOpening(true);
          }
        },
        bodyContainer: this.#bodyContainer,
        isLoading: this.#isLoading,
        isNewEventOpened: this.#isNewEventOpened
      });
    }
    this.#filterPresenter.reset();
    this.#filterPresenter.init();
  }

  #renderContentContainer() {
    render(this.#contentView, this.#bodyContainer);
  }

  #renderSort() {
    const contentElement = this.#contentView.element;
    const contentContainer = contentElement.querySelector('.trip-events');

    this.#sortView = new SortView({
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
        offersByType: this.#pointsModel.offersByType,
        offers: this.#pointsModel.offers,
        destinations: this.#pointsModel.destinations,
        pointsView: this.#pointsView,
        onDataChange: this.#handleViewAction,
        onClose: () => {
          this.#filterPresenter.setIsNewEventOpening(false);
        }
      });
    }

    this.#newEventPresenter.renderPoint();
  }

  #renderPointsList() {
    const contentElement = this.#contentView.element;
    const contentContainer = contentElement.querySelector('.trip-events');

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    const points = this.points;

    if(points.length > 0) {
      points.forEach((p) => this.createPoint(p));
    } else {
      render(this.#emptyView, contentContainer);
    }
  }

  createPoint(point) {
    const pointPresenter = new PointPresenter({
      point,
      offersByType: this.#pointsModel.offersByType,
      destinations: this.#pointsModel.destinations,
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

  #handleViewAction = async (actionType, updateType, update) => {
    //console.log('ViewAction', actionType, updateType, update);

    switch(actionType) {
      case UserAction.UPDATE_TASK:
        this.#pointPresentersMap.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch(err) {
          this.#pointPresentersMap.get(update.id).isSuccess = false;
          this.#pointPresentersMap.get(update.id).setAborting();
        }
        //this.#pointPresentersMap.get(update.id).resetFormState();
        break;
      case UserAction.ADD_TASK:
        this.#newEventPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch(err) {
          this.#newEventPresenter.isSuccess = false;
          this.#newEventPresenter.setAborting();
        }
        //this.#pointPresentersMap.get(update.id).resetFormState();
        break;
      case UserAction.DELETE_TASK:
        this.#pointPresentersMap.get(update.id).setDeleting();
        try {
          await this.#pointsModel.removePoint(updateType, update);
        } catch (error) {
          this.#pointPresentersMap.get(update.id).isSuccess = false;
          this.#pointPresentersMap.get(update.id).setAborting();
        }
        //this.#pointPresentersMap.get(update.id).resetFormState();
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    //console.log('ModelAction', updateType, data);

    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
        this.#pointPresentersMap.get(data.id).point = data;
        this.#pointPresentersMap.get(data.id).renderPoint();
        break;
      case UpdateType.MINOR:
        this.#clearPointsList();
        this.#renderPointsList();
        // - обновить список (например, когда задача ушла в архив)
        break;
      case UpdateType.MAJOR:
        // - обновить всю доску (например, при переключении фильтра)
        this.#renderHeader();
        this.#clearPointsList();
        this.#renderPointsList();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderHeader();
        this.#clearPointsList();
        this.#renderPointsList();
        break;
    }
  };

  #handleModeChange = () => {
    this.#pointPresentersMap.forEach((presenter) => presenter.resetView());
  };
}
