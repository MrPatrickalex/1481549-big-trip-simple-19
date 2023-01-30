import {createElement} from '../render.js';

const createContentTemplate = () => `
  <main class="page-body__page-main  page-main">
    <div class="page-body__container">
      <section class="trip-events">
        <h2 class="visually-hidden">Trip events</h2>

        <!-- Сортировка -->

        <!-- Контент -->
      </section>
    </div>
  </main>
`;

export default class ContentView {
  #element = null;

  get element() {
    if(!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createContentTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
