import {render} from '../render.js';
import AddNewEventView from '../views/addNewEventView.js';
import EventView from '../views/eventView.js';
import FiltersView from '../views/filtersView.js';
import PointsView from '../views/pointsView.js';
import SortView from '../views/sortView.js';

export default class MainPresenter {
  filtersView = new FiltersView();
  sortView = new SortView();
  pointsView = new PointsView();
  newEventView = new AddNewEventView();

  constructor({filtersContainer, mainContainer}) {
    this.filtersContainer = filtersContainer;
    this.mainContainer = mainContainer;
  }

  init() {
    render(this.filtersView, this.filtersContainer);
    render(this.sortView, this.mainContainer);
    render(this.pointsView, this.mainContainer);
    render(this.newEventView, this.pointsView.getElement());

    for(let i = 0; i < 3; i++) {
      render(new EventView(), this.pointsView.getElement());
    }
  }
}
