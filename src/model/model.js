import Observable from '../framework/observable.js';
import { getPoints } from '../mock/points.js';
import {UpdateType} from '../const.js';

export default class PointsModel extends Observable {
  #points = [];
  #offersByType = [];
  #destinations = [];
  #pointsApiService = null;

  constructor({pointsApiService}) {
    super();
    this.#pointsApiService = pointsApiService;
  }

  async init() {
    try {
      const points = await this.#pointsApiService.points;
      const offersByType = await this.#pointsApiService.offers;
      const destinations = await this.#pointsApiService.destinations;

      this.#points = points.map(this.#adaptToClient);
      this.#offersByType = offersByType;
      this.#destinations = destinations;
    } catch(err) {
      this.#points = [];
      this.#offersByType = [];
      this.#destinations = [];
    }

    this._notify(UpdateType.INIT);
  }

  #adaptToClient(point) {
    const adaptedPoint = {...point,
      basePrice: point['base_price'],
      dateFrom: point['date_from'],
      dateTo: point['date_to'],
    };

    // Ненужные ключи мы удаляем
    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];

    return adaptedPoint;
  }

  get points() {
    if(!this.#points) {
      this.#points = getPoints();
    }
    return this.#points;
  }

  async updatePoint(updateType, updated) {
    // console.log('asdasdasd');
    // throw new Error('Can\'t update unexisting point');
    const index = this.#points.findIndex((p) => p.id === updated.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    try {
      const response = await this.#pointsApiService.updatePoint(updated);
      const updatedPoint = this.#adaptToClient(response);

      this.#points = this.#points.map(
        (point) => point.id === updatedPoint.id ? updatedPoint : point
      );

      this._notify(updateType, updatedPoint);
    } catch(err) {
      throw new Error('Can\'t update point');
    }
  }

  async addPoint(updateType, update) {
    try {
      const response = await this.#pointsApiService.addPoint(update);
      const newPoint = this.#adaptToClient(response);
      this.#points = [newPoint, ...this.#points];
      this._notify(updateType, newPoint);
    } catch(err) {
      throw new Error('Can\'t add point');
    }
  }

  async removePoint(updateType, update) {
    const index = this.#points.findIndex((p) => p.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    try {
      // Обратите внимание, метод удаления задачи на сервере
      // ничего не возвращает. Это и верно,
      // ведь что можно вернуть при удалении задачи?
      await this.#pointsApiService.deletePoint(update);
      this.#points = [...this.#points.filter((p) => p.id !== update.id)];
      this._notify(updateType, update);
    } catch(err) {
      throw new Error('Can\'t delete point');
    }
  }

  get offersByType() {
    return this.#offersByType;
  }

  get destinations() {
    return this.#destinations;
  }
}
