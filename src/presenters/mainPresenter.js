import {render} from '../framework/render.js';
import EditEventView from '../views/editEventView.js';
import ContentView from '../views/contentView.js';
import HeaderView from '../views/headerView.js';
import PointsView from '../views/pointsView.js';
import SortView from '../views/sortView.js';
import EmptyListView from '../views/emptyListBoilerplate.js';
import dayjs from 'dayjs';
import PointPresenter from './pointPresenter.js';
import { BLANK_POINT, SortType } from '../const.js';

export default class MainPresenter {
  #headerView = null;
  #sortView = null;
  #contentView = new ContentView();
  #pointsView = new PointsView();
  #emptyView = new EmptyListView();

  #bodyContainer = null;
  #pointsModel = null;

  #points = null;
  #offers = null;
  #destinations = null;
  #sortings = null;

  #isNewEventOpened = true;
  #pointPresentersMap = new Map();

  #currentSortType = SortType.DEFAULT;

  constructor({bodyContainer, pointsModel}) {
    this.#bodyContainer = bodyContainer;
    this.#pointsModel = pointsModel;
    this.#points = this.#pointsModel.getPoints();
    this.#offers = this.#pointsModel.getOffers();
    this.#destinations = this.#pointsModel.getDestinations();
    this.#sortings = this.#pointsModel.getSortingsFilters();
  }

  init() {
    this.#renderHeader();
    this.#renderContentContainer();
    this.#renderSort();
    this.#renderPointsContainer();
    this.#renderPoints();
  }

  #renderHeader() {
    this.#headerView = new HeaderView({
      onAllClick: () => {
        this.#points = this.#pointsModel
          .getPoints();
        this.#renderPoints();
      },
      onFutureClick: () => {
        this.#points = this.#pointsModel
          .getPoints()
          .filter((p) => dayjs().isBefore(p.date_from));
        this.#renderPoints();
      }
    });

    render(this.#headerView, this.#bodyContainer);
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
        this.#sortTasks(sortType);
        this.#renderPoints();
      }
    });
    render(this.#sortView, contentContainer);
  }

  #sortTasks(sortType) {
    switch(sortType) {
      case SortType.DAY:
        this.#points.sort((p1, p2) => {
          if(dayjs(p1.date_from).isBefore(dayjs(p2.date_from))) {
            return -1;
          } else {
            return 1;
          }
        });
        break;
      case SortType.EVENT:
        break;
      case SortType.TIME:
        this.#points.sort((p1, p2) => {
          const timeFirst = dayjs(p1.date_from).hour() * 60 + dayjs(p1.date_from).minute();
          const timeSecond = dayjs(p2.date_from).hour() * 60 + dayjs(p2.date_from).minute();

          if(timeFirst < timeSecond) {
            return -1;
          } else {
            return 1;
          }
        });
        break;
      case SortType.PRICE:
        this.#points.sort((p1, p2) => {
          if(p1.base_price < p2.base_price) {
            return -1;
          } else {
            return 1;
          }
        });
        break;
      case SortType.OFFER:
        break;
    }
    this.#currentSortType = sortType;
  }

  #renderPointsContainer() {
    const contentElement = this.#contentView.element;
    const contentContainer = contentElement.querySelector('.trip-events');
    render(this.#pointsView, contentContainer);
  }

  #renderPoints() {
    const contentElement = this.#contentView.element;
    const contentContainer = contentElement.querySelector('.trip-events');

    this.#clearPointList();

    if(this.#isNewEventOpened) {
      render(new EditEventView({
        point: BLANK_POINT,
        pointOffers: BLANK_POINT.offers,
        pointDestination: BLANK_POINT.destination,
        allOffers: this.#offers,
        allDestinations: this.#destinations}), this.#pointsView.element);
    }

    if(this.#points.length > 0) {
      this.#points.forEach((p) => this.createPoint(p));
    } else {
      render(this.#emptyView, contentContainer);
    }
  }

  createPoint(point) {
    const pointPresenter = new PointPresenter({
      point,
      offers: this.#offers,
      destinations: this.#destinations,
      pointsView: this.#pointsView,
      onDataChange: (e) => this.#handlePointChange(e),
      onModeChange: () => this.#handleModeChange()
    });

    this.#pointPresentersMap.set(point.id, pointPresenter);
    pointPresenter.renderPoint();
  }

  #clearPointList() {
    this.#pointPresentersMap.forEach((presenter) => presenter.destroy());
    this.#pointPresentersMap.clear();
  }

  #handlePointChange(updatedPoint) {
    this.#points = this.#points.map(
      (point) => point.id === updatedPoint.id ? updatedPoint : point);

    const presenter = this.#pointPresentersMap.get(updatedPoint.id);
    presenter.point = updatedPoint;

    // console.log(updatedPoint);
    presenter.renderPoint();
  }

  #handleModeChange = () => {
    this.#pointPresentersMap.forEach((presenter) => presenter.resetView());
  };
}
