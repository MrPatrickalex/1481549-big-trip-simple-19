import {render} from '../render.js';
import AddNewEventView from '../views/addNewEventView.js';
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
  #newEventView = new AddNewEventView();

  #bodyContainer = null;
  #pointsModel = null;

  constructor({bodyContainer, pointsModel}) {
    this.#bodyContainer = bodyContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    const points = this.pointsModel.getPoints();
    const offers = this.pointsModel.getOffers();
    const destinations = this.pointsModel.getDestinations();

    render(this.#headerView, this.bodyContainer);
    render(this.#contentView, this.bodyContainer);

    const contentElement = this.#contentView.getElement();
    const contentContainer = contentElement.querySelector('.trip-events');

    render(this.#sortView, contentContainer);
    render(this.#pointsView, contentContainer);
    render(new AddNewEventView(destinations, offers), this.#pointsView.getElement());

    points.forEach((p) => {
      const pointOffers = offers.filter((o) => p.offers.some((o2) => o2 === o.id));
      const [pointDestination] = destinations.filter(d => d.id === p.destination);
      render(new EventView(p, pointOffers, pointDestination), this.#pointsView.getElement());
    });
  }
}
