import MainPresenter from './presenters/mainPresenter.js';

const filtersContainer = document.querySelector('.trip-controls__filters');
const mainContainer = document.querySelector('.trip-events');

new MainPresenter({filtersContainer, mainContainer}).init();
