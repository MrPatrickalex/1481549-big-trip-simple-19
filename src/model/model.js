import Observable from '../framework/observable.js';
import { getPoints, getOffers, getDestinations, getSortings, getOffersByType } from '../mock/points.js';

export default class PointsModel extends Observable {
  #points = null;

  get points() {
    if(!this.#points) {
      this.#points = getPoints();
    }
    return this.#points;
  }

  updatePoint(updateType, updated) {
    const index = this.#points.findIndex((p) => p.id === updated.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this.#points = this.#points.map(
      (point) => point.id === updated.id ? updated : point
    );

    this._notify(updateType, updated);
  }

  addPoint(updateType, newPoint) {
    this.#points = [...this.#points, newPoint];

    this._notify(updateType, newPoint);
  }

  removePoint(updateType, pointToRemove) {
    const index = this.#points.findIndex((p) => p.id === updated.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this.#points = [...this.#points.filter((p) => p.id !== pointToRemove.id)];

    this._notify(updateType, pointToRemove);
  }

  get offers() {
    return getOffers();
  }

  get offersByType() {
    return getOffersByType();
  }

  get destinations() {
    return getDestinations();
  }

  get sortingsFilters() {
    return getSortings();
  }
}
