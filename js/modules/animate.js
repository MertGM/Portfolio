var optionsMenu = document.querySelector('.options-menu');
var optionsMenuWrapper = document.querySelector('.options-menu-wrapper');
var options = document.querySelector('.options');
var optionIcons = document.getElementById('options-icons');
var moon = document.querySelector('.moon');
var sun = document.querySelector('.sun');
var body = document.querySelector('body');
var optionsButton = document.getElementById('inner-circle');
var optionsButtonOuter = document.getElementById('outer-circle');

// We show the options menu at the start, because css messes up transormations.
// Because we have flexbox css will also calculate the width and the height over time.
// So we can't also change the width and height of an flexbox element or parent of one.

var optionsMenuAnimation = optionsMenu.animate([
    { transform: 'scale(0, 0)'},
    ], {
        fill: 'forwards',
        easing: 'ease-in-out',
        duration: 1500
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


var spinnerBackground = document.querySelector('.spinner');
var spinnerBackgroundAnimation = spinnerBackground.animate([
    { opacity: 0 }
    ],  {
      fill: 'forwards',
      easing: 'ease-in',
      duration: 1000
    });
spinnerBackgroundAnimation.pause();



var optionsCollapsed = localStorage.getItem('options');
console.log(optionsCollapsed);
if (optionsCollapsed == null) {
    optionsCollapsed = false;
}


var buttonScroll = document.querySelector('.auto-scroll');
var time = 1000;
var buttonAnimation = buttonScroll.animate([
    { transform: 'translateX(-10px)' }
    ], {
      fill: 'forwards',
      easing: 'ease-in-out',
      duration: time
    });
buttonAnimation.pause();

var optionsFill;
var color1;
var color2;
var optionsButtonAnimation;

// Initialize variables when css is done parsing

function InitButtonAnimation() {
    optionsButton = document.getElementById('inner-circle');
    optionsFill = getComputedStyle(optionsButton).getPropertyValue('--btn-primary');
    if ((document.querySelector('body').className) == 'light') {
            color1 = '#a88';
            color2 = '#f96';
    }
    else {
            color1 = '#9af';
            color2 = '#aef'
    }

    // Todo: Reinitializing might not be optimal, have to benchmark this.
    optionsButtonAnimation = optionsButton.animate([
            { fill: optionsFill},
            { fill: color1},
            { fill: color2},
            { fill: optionsFill},
            ], {
                duration: 500
        });
    optionsButtonAnimation.pause();
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

export function Options() {
    // Change play back rate according to its 'state' (true or false) and store it in the local storage.
    // This is so we can load the animations beforehand according how the user last left them there;
    // in this case is the menu collapsed or not?
    // This allows us to replicate caching an animation state
    
    // local storage stores utf-16 strings
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
    optionsButtonAnimation.play();
    optionIconsAnimation.play();
    localStorage.setItem('options', optionsCollapsed);
}

export function Animate() {
    buttonScroll.addEventListener('mousedown', Start, false);
    optionsButton.addEventListener('mousedown', Options, false);
    optionsButtonOuter.addEventListener('mousedown', Options, false);
    moon.addEventListener('mousedown', ThemeSwitch, false);
    sun.addEventListener('mousedown', ThemeSwitch, false);
}

export function PreloadAnimations() {
    // Play the animations according to its collapsed 'state'
     
    // Make the animation run faster so our loading screen will take the minimum time,
    // and also prevent from showing the animation after the loading is done.
    // Only animate collapse since the default is the menu being open 
    
    if (optionsCollapsed == 'true') {
        optionsMenuAnimation.playbackRate = 20;
        optionsAnimation.playbackRate = 20;

        spinnerBackgroundAnimation.play();
        optionsAnimation.play();
        optionsMenuAnimation.play();

        spinnerBackgroundAnimation.finished.then(function() {
            spinnerBackground.id = 'hidden';
        });
    }
    else {
        spinnerBackgroundAnimation.play();
        spinnerBackgroundAnimation.finished.then(function() {
            spinnerBackground.id = 'hidden';
        });
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

}

function Start() {
    console.log(buttonAnimation.currentTime);
    console.log(buttonAnimation.playbackRate);
    console.log(buttonAnimation.effect);
    if (buttonAnimation.currentTime == time) {
        buttonAnimation.playbackRate = -1;
        buttonAnimation.play()
    }
    else {
        buttonAnimation.playbackRate = 1;
        buttonAnimation.play();
    }
}
function End() {
    console.log(buttonAnimation.currentTime);

    console.log('End animation');
}
