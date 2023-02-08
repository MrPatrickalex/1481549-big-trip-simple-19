import RoutePresenter from './presenters/routePresenter.js';
import PointsModel from './model/model.js';
import FilterModel from './model/filterModel.js';

const bodyContainer = document.querySelector('.page-body');
const pointsModel = new PointsModel();
const filterModel = new FilterModel();
new RoutePresenter({bodyContainer, pointsModel, filterModel}).init();
