import MainPresenter from './presenters/mainPresenter.js';
import PointsModel from './model/model.js';

const bodyContainer = document.querySelector('.page-body');
const pointsModel = new PointsModel();
new MainPresenter({bodyContainer, pointsModel}).init();
