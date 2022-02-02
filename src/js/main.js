import {Animate, PreloadAnimations} from './modules/animate.js';

PreloadAnimations();
Animate();

import {AutoScroll, Listen} from './modules/scroll.js';


const nav = document.querySelector('.nav');
const options = document.getElementById('options-icons');
const innerButton = document.querySelector('.inner-button');
const outerButton = document.querySelector('.outer-button');

const form = document.querySelector('form');

Listen(null)
Listen(nav, true);
Listen(options);
Listen(innerButton);
Listen(outerButton);
Listen(form);

AutoScroll();

import {TwinkleStars} from './modules/canvas.js';

if (document.body.clientWidth <= 500) {
    TwinkleStars(100);
}
else if (document.body.clientWidth <= 1200) {
    TwinkleStars(200);
}
else if (document.body.clientWidth >= 1200) {
    TwinkleStars(300);
}


import {Slider} from './modules/slider.js';
Slider(['discord_examples.png', 'discord_example1.png', 'discord_example2.png', 'discord_example3.png'], 'discord')
