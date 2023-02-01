import { getPoints, getOffers, getDestinations, getSortings } from '../mock/points.js';

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

  getSortingsFilters() {
    return getSortings();
  }
}
