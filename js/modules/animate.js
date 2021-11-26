// Animation for button turning smooth scroll on and off
// Todo: Cache the animation state, so that an animation stays where it has been left off;
// e.g: option button stays off when refreshed instead of resetting the state.
// Cookies would do the trick I think.

var optionsMenu = document.querySelector('.options-menu');
var optionsMenuWrapper = document.querySelector('.options-menu-wrapper');
var options = document.querySelector('.options');
var optionIcons = document.getElementById('options-icons');

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


var optionsButton = document.getElementById('inner-circle');
var optionsButtonOuter = document.getElementById('outer-circle');
var optionsFill = getComputedStyle(optionsButton).getPropertyValue('fill');
if ((document.querySelector('body').className) == 'light') {
    var color1 = '#a88';
    var color2 = '#f96';
}
else {
    var color1 = '#9af';
    var color2 = '#aef'
}
console.log(optionsFill);

var optionsButtonAnimation = optionsButton.animate([
    { fill: optionsFill},
    { fill: color1},
    { fill: color2},
    { fill: optionsFill},
    ], {
        duration: 500
    });
optionsButtonAnimation.pause();


// We show the options menu at the start, because css messes up transormations.
// Because we have flexbox css will also calculate the width and the height over time.
// So we can't also change the width and height of an flexbox element or parent of one.



export function Animate() {
    buttonScroll.addEventListener('mousedown', Start, false);
    optionsButton.addEventListener('mousedown', Options, false);
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

    optionsAnimation.play();
    optionsMenuAnimation.play();
    optionsButtonAnimation.play();
    optionIconsAnimation.play();
    localStorage.setItem('options', optionsCollapsed);
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
