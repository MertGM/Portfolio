import {Animate, PreloadAnimations} from './modules/animate.js';

//document.addEventListener('DOMContentLoaded', PreloadAnimations, false);
PreloadAnimations();
Animate();

import {AutoScroll, Listen} from './modules/scroll.js';


const nav = document.querySelector('.nav');
const options = document.getElementById('options-icons');
const innerButton = document.querySelector('.inner-button');
const outerButton = document.querySelector('.outer-button');

Listen(null)
Listen(nav, true);
Listen(options);
Listen(innerButton);
Listen(outerButton);

AutoScroll();
