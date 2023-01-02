import { getPoints, getOffers, getDestinations} from '../mock/points.js';

export default class Model {
  getPoints() {
    return getPoints();
  }

  getOffers() {
    return getOffers();
  }

  getDestinations() {
    return getDestinations();
  }
}
