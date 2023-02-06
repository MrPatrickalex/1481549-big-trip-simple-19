import { getPoints, getOffers, getDestinations, getSortings, getOffersByType } from '../mock/points.js';

export default class PointsModel {
  getPoints() {
    return getPoints();
  }

  getOffers() {
    return getOffers();
  }

  getOffersByType() {
    return getOffersByType();
  }

  getDestinations() {
    return getDestinations();
  }

  getSortingsFilters() {
    return getSortings();
  }
}
