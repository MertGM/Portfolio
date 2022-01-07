var optionsMenu = document.querySelector('.options-menu');
var optionsMenuWrapper = document.querySelector('.options-menu-wrapper');
var options = document.querySelector('.options');
var optionIcons = document.getElementById('options-icons');
var moon = document.querySelector('.moon');
var sun = document.querySelector('.sun');
var body = document.querySelector('body');
var optionsButton = document.getElementById('inner-circle');
var optionsOuterButton = document.getElementById('outer-circle');

// We show the options menu at the start, because css messes up transformations.
// Because we have flexbox css will also calculate the width and the height over time.
// So we can't also change the width and height of an flexbox element or parent of one.

var optionsMenuAnimation = optionsMenu.animate([
    { transform: 'scale(0, 0)'},
    ], {
        fill: 'forwards',
        easing: 'ease-in-out',
        duration: 1200
    });
optionsMenuAnimation.pause();


var optionsAnimation = options.animate([
    {opacity: 0},
    ], {
        fill: 'forwards',
        easing: 'ease-in-out',
        duration: 1000
    });
optionsAnimation.pause();


var optionIconsAnimation = optionIcons.animate([
    {opacity: 0},
    ], {
        fill: 'forwards',
        easing: 'ease-in-out',
        duration: 1000
    });
optionIconsAnimation.pause();


var spinnerBackground = document.querySelector('.spinner-background');
var spinner = document.getElementById('spinner');
var spinnerAnimation = spinner.animate([
    { transform: 'rotate(360deg)' },
    ],  {
      fill: 'forwards',
      easing: 'ease-in',
      duration: 2000,
      iterations: Infinity,
    });
spinnerAnimation.pause();



var optionsCollapsed = localStorage.getItem('options');
console.log(optionsCollapsed);
if (optionsCollapsed == null) {
    optionsCollapsed = false;
}

var autoScroll = localStorage.getItem('auto scroll');
console.log('auto scroll %s', autoScroll);
console.log(optionsCollapsed);
if (autoScroll == null) {
    // Auto scroll is enabled by default
    autoScroll = 'true';
    localStorage.setItem('auto scroll', autoScroll);
}

var buttonScroll = document.querySelector('.inner-button');
var buttonScrollOuter = document.querySelector('.outer-button');
var buttonAnimation = buttonScroll.animate([
    { transform: 'translateX(-14px)' }
    ], {
      fill: 'forwards',
      easing: 'ease-in-out',
      duration: 600
    });
buttonAnimation.pause();

var buttonFillAnimation = buttonScrollOuter.animate([
    { fill: '#0f5' },
    { fill: '#f25' }
    ], {
      fill: 'forwards',
      easing: 'ease-in-out',
      duration: 500
    });
buttonFillAnimation.pause();

var optionsFill;
var color1;
var color2;
var optionsButtonAnimation;
var optionsOuterButtonAnimation;

// Initialize variables when css is done parsing

function InitButtonAnimation() {
    spinnerBackground.id = 'hidden';

    optionsButton = document.getElementById('inner-circle');
    optionsOuterButton = document.getElementById('outer-circle');
    optionsFill = getComputedStyle(optionsButton).getPropertyValue('--btn-primary');
    if ((document.querySelector('body').className) == 'light') {
            color1 = '#a88';
            color2 = '#f96';
    }
    else {
            color1 = '#9af';
            color2 = '#aef'
    }

    optionsButtonAnimation = optionsButton.animate([
            { fill: optionsFill},
            { fill: color1},
            { fill: color2},
            { fill: optionsFill},
            ], {
                duration: 500
        });
    optionsButtonAnimation.pause();

    optionsOuterButtonAnimation = optionsOuterButton.animate([
            { stroke: optionsFill},
            { stroke: color1},
            { stroke: color2},
            { stroke: optionsFill},
            ], {
                duration: 500
        });
    optionsOuterButtonAnimation.pause();
    console.log(optionsFill);
}

window.addEventListener('load', InitButtonAnimation, false);


var theme = localStorage.getItem('theme');
if (theme == null) {
    theme = 'moon';
}
var moonAnimation = moon.animate([
    {transform: 'scale(0,0)'}
    ], {
      fill: 'forwards',
      easing: 'ease-in-out',
      duration: 500
    });
moonAnimation.pause();


var sunAnimation = sun.animate([
    { transform: 'scale(0,0)'}
    ], {
      fill: 'forwards',
      easing: 'ease-in-out',
      duration: 500
    });
sunAnimation.pause();


function ThemeSwitch() {
    if (theme == 'sun') {
        theme = 'moon';
        sunAnimation.playbackRate = 1;
        moonAnimation.playbackRate = -1;
        sunAnimation.play();
        moonAnimation.play()
        body.setAttribute('class', '');
    }
    else {
        theme = 'sun';
        sunAnimation.playbackRate = -1;
        moonAnimation.playbackRate = 1;
        moonAnimation.play();
        sunAnimation.play()
        body.setAttribute('class', 'light');
    }
    InitButtonAnimation();
    localStorage.setItem('theme', theme);
}

export function Options(e) {
    // Change play back rate according to its 'state' (true or false) and store it in the local storage.
    // This is so we can load the animations beforehand according how the user last left them there.
    
    console.log(e.currentTarget);

    if (optionsCollapsed == 'true') {
        console.log('open');
        optionsCollapsed = 'false';
        optionsMenuAnimation.playbackRate = -1;
        optionsAnimation.playbackRate = -1;
        optionIconsAnimation.playbackRate = -1;
    }
    else {
        console.log('collapse');
        optionsMenuAnimation.playbackRate = 1;
        optionsAnimation.playbackRate = 1;
        optionIconsAnimation.playbackRate = 1;
        optionsCollapsed = 'true';
    }


    InitButtonAnimation();

    optionsAnimation.play();
    optionsMenuAnimation.play();
    optionIconsAnimation.play();

    if (e.currentTarget.id == 'outer-circle') {
        optionsOuterButtonAnimation.play();
    }
    else {
        optionsButtonAnimation.play();
    }

    // local storage uses utf-16 strings
    localStorage.setItem('options', optionsCollapsed);
}

export function Animate() {
    buttonScroll.addEventListener('mousedown', Start, false);
    buttonScrollOuter.addEventListener('mousedown', Start, false);
    optionsButton.addEventListener('mousedown', Options, false);
    optionsOuterButton.addEventListener('mousedown', Options, false);
    moon.addEventListener('mousedown', ThemeSwitch, false);
    sun.addEventListener('mousedown', ThemeSwitch, false);
}

export function PreloadAnimations() {
    // Animate animations to its last state according to local storage values
    // Only animate collapse since the default is the menu being open 
    spinnerAnimation.play();

    if (optionsCollapsed == 'true') {
        optionsMenuAnimation.playbackRate = 20;
        optionsAnimation.playbackRate = 20;

        spinnerAnimation.play();
        optionsAnimation.play();
        optionsMenuAnimation.play();
    }

    if (theme == 'sun') {
        moonAnimation.playbackRate = 20;
        moonAnimation.play();
        body.setAttribute('class', 'light');
    }
    else if (theme == 'moon') {
        sunAnimation.playbackRate = 20;
        sunAnimation.play();
    }

    if (autoScroll == 'false')
    {
        // We can't do this instantly afaik
        buttonAnimation.playbackRate = 20;
        buttonAnimation.play();
        buttonFillAnimation.playbackRate = 20;
        buttonFillAnimation.play();
    }
}

function Start() {
    if (autoScroll == 'true') {
        console.log('Swipe left')
        buttonAnimation.playbackRate = 1;
        buttonAnimation.play()
        buttonFillAnimation.playbackRate = 1;
        buttonFillAnimation.play();
        autoScroll = 'false';
    }
    else {
        console.log('Swipe right')
        buttonAnimation.playbackRate = -1;
        buttonAnimation.play();
        buttonFillAnimation.playbackRate = -1;
        buttonFillAnimation.play();
        autoScroll = 'true';
    }

    localStorage.setItem('auto scroll', autoScroll);
}
