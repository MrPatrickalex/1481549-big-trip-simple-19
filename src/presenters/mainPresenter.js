import {render} from '../render.js';
import AddNewEventView from '../views/addNewEventView.js';
import ContentView from '../views/contentView.js';
import EventView from '../views/eventView.js';
import HeaderView from '../views/headerView.js';
import PointsView from '../views/pointsView.js';
import SortView from '../views/sortView.js';

export default class MainPresenter {
  headerView = new HeaderView();
  contentView = new ContentView();
  sortView = new SortView();
  pointsView = new PointsView();
  newEventView = new AddNewEventView();

  constructor({bodyContainer}) {
    this.bodyContainer = bodyContainer;
  }

  init() {
    render(this.headerView, this.bodyContainer);
    render(this.contentView, this.bodyContainer);

    const contentElement = this.contentView.getElement();
    const contentContainer = contentElement.querySelector('.trip-events');

    render(this.sortView, contentContainer);
    render(this.pointsView, contentContainer);
    render(this.newEventView, this.pointsView.getElement());

    for(let i = 0; i < 3; i++) {
      render(new EventView(), this.pointsView.getElement());
    }
  }
}
