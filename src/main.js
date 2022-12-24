import { getRandomPoints } from './mock/points.js';
import MainPresenter from './presenters/mainPresenter.js';

const bodyContainer = document.querySelector('.page-body');
new MainPresenter({bodyContainer}).init();

const points = getRandomPoints(10);

console.log(points)
