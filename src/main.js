import RoutePresenter from './presenters/routePresenter.js';
import PointsModel from './model/model.js';
import FilterModel from './model/filterModel.js';
import PointsApiService from './pointsApiService.js';

const AUTHORIZATION = 'Basic cEb6kXF01zY9HIVbdpY';
const END_POINT = 'https://19.ecmascript.pages.academy/big-trip-simple';

const pointsApiService = new PointsApiService(END_POINT, AUTHORIZATION);

// pointsApiService.offers
//   .then(offers => console.log(offers));

const bodyContainer = document.querySelector('.page-body');
const pointsModel = new PointsModel({pointsApiService});
const filterModel = new FilterModel();

new RoutePresenter({bodyContainer, pointsModel, filterModel}).init();
pointsModel.init();
