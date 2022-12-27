import { getPoints, getOffers, getDestinations} from './mock/points.js';
import MainPresenter from './presenters/mainPresenter.js';

const bodyContainer = document.querySelector('.page-body');
new MainPresenter({bodyContainer}).init();

const points = getPoints();

console.log(points);
