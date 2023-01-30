import {render} from '../render.js';
import {isEscapeKey} from "../utils";
import EditEventView from '../views/editEventView.js';
import ContentView from '../views/contentView.js';
import EventView from '../views/eventView.js';
import HeaderView from '../views/headerView.js';
import PointsView from '../views/pointsView.js';
import SortView from '../views/sortView.js';

export default class MainPresenter {
  #headerView = new HeaderView();
  #contentView = new ContentView();
  #sortView = new SortView();
  #pointsView = new PointsView();

  #bodyContainer = null;
  #pointsModel = null;

  #points = null;
  #offers = null;
  #destinations = null;

  constructor({bodyContainer, pointsModel}) {
    this.#bodyContainer = bodyContainer;
    this.#pointsModel = pointsModel;
    this.#points = this.#pointsModel.getPoints();
    this.#offers = this.#pointsModel.getOffers();
    this.#destinations = this.#pointsModel.getDestinations();
  }

  init() {
    render(this.#headerView, this.#bodyContainer);
    render(this.#contentView, this.#bodyContainer);

    const contentElement = this.#contentView.element;
    const contentContainer = contentElement.querySelector('.trip-events');

    render(this.#sortView, contentContainer);
    render(this.#pointsView, contentContainer);
    render(new EditEventView({
      point: null,
      pointOffers: null,
      pointDestination: null,
      allOffers: this.#offers,
      allDestinations: this.#destinations}), this.#pointsView.element);

    this.#points.forEach((p) => this.createPoint(p));
  }

  createPoint(point) {
    const pointOffers = this.#offers.filter((o) => point.offers.some((o2) => o2 === o.id));
    const [pointDestination] = this.#destinations.filter(d => d.id === point.destination);

    const pointView = new EventView({point, pointOffers, pointDestination});
    const pointEdit = new EditEventView({
      point,
      pointOffers,
      pointDestination,
      allOffers: this.#offers,
      allDestinations: this.#destinations});

    render(pointView, this.#pointsView.element);

    const showEditMode = () => {
      this.#pointsView.element.replaceChild(pointEdit.element, pointView.element)
      document.addEventListener('keydown', escapeHander);
    };
    const closeEditMode = () => {
      this.#pointsView.element.replaceChild(pointView.element, pointEdit.element);
      document.removeEventListener('keydown', escapeHander);
    };

    function escapeHander(event) {
      if(isEscapeKey(event)) {
        closeEditMode();
      }
    }

    const openEventButton = pointView.element.querySelector('.event__rollup-btn');
    const submitEventButton = pointEdit.element.querySelector('.event__save-btn');
    const cancelEventButton = pointEdit.element.querySelector('.event__reset-btn');

    openEventButton.addEventListener('click', () => {
      showEditMode();
    });

    submitEventButton.addEventListener('click', (event) => {
      event.preventDefault();
      closeEditMode();
    });

    cancelEventButton.addEventListener('click', (event) => {
      event.preventDefault();
      closeEditMode();
      document.removeEventListener('keydown', escapeHander);
    });
  }
}
