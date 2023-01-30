import {createElement} from '../render.js';

export default class PointsView {
  #element = null;

  get element() {
    if(!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return `
    <ul class="trip-events__list">
    </ul>
    `;
  }

  removeElement() {
    this.#element = null;
  }
}
