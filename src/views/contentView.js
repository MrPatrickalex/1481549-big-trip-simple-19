import AbstractView from '../framework/view/abstract-view.js';

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

export default class ContentView extends AbstractView {
  get template() {
    return createContentTemplate();
  }
}
