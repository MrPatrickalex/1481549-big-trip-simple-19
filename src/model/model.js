import { getPoints, getOffers, getDestinations} from '../mock/points.js';

export default class PointsModel {
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
