import MainPresenter from './presenters/mainPresenter.js';

const bodyContainer = document.querySelector('.page-body');
new MainPresenter({bodyContainer}).init();
