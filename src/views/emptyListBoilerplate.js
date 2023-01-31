import {createElement} from '../render.js';

export default class EmptyListView {
  #element = null;

  get element() {
    if(!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return `
    <p class="trip-events__msg">Click New Event to create your first point</p>
    `;
  }

  removeElement() {
    this.#element = null;
  }
}
