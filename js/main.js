import {SmoothScroll, scroll} from './modules/scroll.js';
import {Scrollup, Scrolldown} from './modules/scroll.js';

SmoothScroll();


// All the events handler for the web page

const elSmoothScroll = document.getElementById('smooth-scroll');
const elHome = document.getElementById('home');
const elAbout = document.getElementById('about');
const elProjects = document.getElementById('projects');
const elContact = document.getElementById('contact');

const pages = document.querySelectorAll('.container100');
//console.log('pages: %o', pages[0].className);
//console.log('pages: %o', pages[1].className);
//console.log('pages: %o', pages[2].className);
//console.log('pages: %o', pages[3].className);

// Scroll to events currently not functioning correctly

console.log('node: %o', scroll.node);
console.log('node: %s', elHome.id);

// Not working atm
elHome.addEventListener('click', function() {
    const index = scroll.index;
    console.log('index: %s', index);
        if (scroll.prevScrollY < scroll.node[index+1].clientHeight) {
            requestAnimationFrame(Scrolldown);
            }
        else if (( ( (index != 0) && scroll.prevScrollY > scroll.node[index-1].clientHeight) )) {
            requestAnimationFrame(Scrollup);
                }
});

elAbout.addEventListener('click', function() {
    const index = scroll.index;
console.log('index: %s', index);
        if (scroll.prevScrollY < scroll.node[index+1].clientHeight) {
            requestAnimationFrame(Scrolldown);
            }
        else if (( ( (index != 0) && scroll.prevScrollY > scroll.node[index-1].clientHeight) )) {
            requestAnimationFrame(Scrollup);
                }
});

elProjects.addEventListener('click', function() {
    const index = scroll.index;
console.log('node: %s', index);
        if (prevScrollY < scroll.node[index+1].clientHeight) {
            requestAnimationFrame(Scrolldown);
            }
        else if (( ( (index != 0) && prevScrollY > scroll.node[index-1].clientHeight) )) {
            requestAnimationFrame(Scrollup);
                }
});

elContact.addEventListener('click', function() {
        index = 3;
        if (prevScrollY < (node[0].clientHeight * index)) {
                    requestAnimationFrame(Scrolldown);
                }
        else {
                    requestAnimationFrame(Scrollup);
                }
});


// Code for the svg properties are valued here due to it's code cluttering

document.querySelector('path').setAttribute('d', 
    'm 110.17728,25.092109 c -36.464186,0 -65.998482,28.596408 -65.998482,63.902622 0,28.276899 18.892061,52.160509 45.126444,60.627599 3.299913,0.55913 4.537398,-1.35795 4.537398,-3.03539 0,-1.51766 -0.08106,-6.55001 -0.08106,-11.90187 -16.582001,2.95563 -20.871889,-3.91403 -22.191847,-7.50854 -0.742405,-1.83707 -3.959907,-7.50854 -6.764863,-9.02623 -2.309841,-1.19826 -5.609846,-4.15371 -0.08106,-4.23355 5.197393,-0.0786 8.90979,4.63292 10.147275,6.55 5.939861,9.6653 15.427142,6.94941 19.222044,5.27197 0.577459,-4.15365 2.30984,-6.94942 4.207416,-8.54696 -14.684675,-1.59767 -30.029316,-7.10917 -30.029316,-31.551918 0,-6.949421 2.557415,-12.700657 6.764863,-17.173851 -0.660088,-1.597666 -2.969931,-8.147583 0.660088,-16.934172 0,0 5.527376,-1.677369 18.149594,6.550008 5.279866,-1.437959 10.889756,-2.15679 16.499586,-2.15679 5.60989,0 11.21977,0.718831 16.49965,2.15679 12.62217,-8.307351 18.14953,-6.550008 18.14953,-6.550008 3.62993,8.786589 1.31987,15.336626 0.66008,16.934172 4.2074,4.473194 6.76484,10.144544 6.76484,17.173851 0,24.522598 -15.42713,29.954338 -30.11177,31.551918 2.39249,1.99709 4.4549,5.83111 4.4549,11.82196 0,8.54697 -0.0842,15.41652 -0.0842,17.57322 0,1.67736 1.23756,3.67443 4.53736,3.03539 A 66.105693,64.006451 0 0 0 176.1773,88.994731 c 0,-35.306214 -29.53431,-63.902622 -65.99841,-63.902622 z');
