import {render} from '../framework/render.js';
import {isEscapeKey} from '../utils.js';
import EditEventView from '../views/editEventView.js';
import ContentView from '../views/contentView.js';
import EventView from '../views/eventView.js';
import HeaderView from '../views/headerView.js';
import PointsView from '../views/pointsView.js';
import SortView from '../views/sortView.js';
import EmptyListView from '../views/emptyListBoilerplate.js';

export default class MainPresenter {
  #headerView = new HeaderView();
  #contentView = new ContentView();
  #sortView = new SortView();
  #pointsView = new PointsView();
  #emptyView = new EmptyListView();

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

    if(this.#points.length > 0) {
      this.#points.forEach((p) => this.createPoint(p));
    } else {
      render(this.#emptyView, contentContainer);
    }
  }

  createPoint(point) {
    const pointOffers = this.#offers.filter((o) => point.offers.some((o2) => o2 === o.id));
    const [pointDestination] = this.#destinations.filter((d) => d.id === point.destination);

    const pointView = new EventView({
      point,
      pointOffers,
      pointDestination,
      onEditClick: () => showEditMode.call(this)
    });
    const pointEdit = new EditEventView({
      point,
      pointOffers,
      pointDestination,
      allOffers: this.#offers,
      allDestinations: this.#destinations,
      onCloseClick: () => closeEditMode.call(this),
      onSubmitClick: () => closeEditMode.call(this)
    });

    render(pointView, this.#pointsView.element);

    const escapeHander = (event) => {
      if(isEscapeKey(event)) {
        closeEditMode.call(this);
      }
    };

    function changeViewToForm() {
      this.#pointsView.element.replaceChild(pointEdit.element, pointView.element);
    }

    function changeFormToView() {
      this.#pointsView.element.replaceChild(pointView.element, pointEdit.element);
    }

    function showEditMode() {
      changeViewToForm.call(this);
      document.addEventListener('keydown', escapeHander);
    }

    function closeEditMode() {
      changeFormToView.call(this);
      document.removeEventListener('keydown', escapeHander);
    }
  }
}
