import {render} from '../framework/render.js';
import EditEventView from '../views/editEventView.js';
import ContentView from '../views/contentView.js';
import HeaderView from '../views/headerView.js';
import PointsView from '../views/pointsView.js';
import SortView from '../views/sortView.js';
import EmptyListView from '../views/emptyListBoilerplate.js';
import dayjs from 'dayjs';
import PointPresenter from './pointPresenter.js';

export default class MainPresenter {
  #headerView = null;
  #contentView = new ContentView();
  #sortView = null;
  #pointsView = new PointsView();
  #emptyView = new EmptyListView();

  #bodyContainer = null;
  #pointsModel = null;

  #points = null;
  #offers = null;
  #destinations = null;
  #sortings = null;

  #isNewEventOpened = false;
  #pointPresentersMap = new Map();

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
      onSortCLick: (sortingFunction) => {
        this.#points.sort(sortingFunction);
        this.#renderPoints();
      }
    });
    render(this.#sortView, contentContainer);
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
        point: null,
        pointOffers: null,
        pointDestination: null,
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
      onDataChange: (e) => this.#handlePointChange(e)
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

    console.log(updatedPoint);
    presenter.renderPoint();
  }
}
