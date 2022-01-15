var optionsMenu = document.querySelector('.options-menu');
var optionsMenuWrapper = document.querySelector('.options-menu-wrapper');
var options = document.querySelector('.options');
var optionIcons = document.getElementById('options-icons');
var moon = document.querySelector('.moon');
var sun = document.querySelector('.sun');
var body = document.querySelector('body');
var optionsButton = document.getElementById('inner-circle');
var optionsOuterButton = document.getElementById('outer-circle');
var buttonScroll = document.querySelector('.inner-button');
var buttonScrollOuter = document.querySelector('.outer-button');
var nav = document.querySelector('.nav'); 
var sunShadow = document.getElementById('sun-shadow');
var moonShadow = document.getElementById('moon-shadow');

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
var colorBgPrimary = getComputedStyle(document.body).getPropertyValue('--bg-primary');
var spinnerBackgroundAnimation = spinnerBackground.animate([
    { opacity: '0' },
    ],  {
      fill: 'forwards',
      easing: 'steps(2, end)',
      duration: 1000
    });
spinnerBackgroundAnimation.pause();




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

    optionsButton = document.getElementById('inner-circle');
    optionsOuterButton = document.getElementById('outer-circle');
    optionsFill = getComputedStyle(optionsButton).getPropertyValue('--btn-primary');
    if ((document.querySelector('body').className) == 'light') {
            color1 = '#f91';
            color2 = '#fb1';
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


var navColor = getComputedStyle(nav).getPropertyValue('--li-hover');
var fontPrimary = getComputedStyle(document.body).getPropertyValue('--font-primary');
var navAnims = [];
var navCollapsed = true;
var navLeftOffset = 0;
var aside = document.querySelector('aside');
var navCurrentTarget;
var resizing = false;

for (var i = 0; i < nav.children.length; i++) {
    navAnims.push(nav.children[i].animate([
        { width: '0.1em'},
        { color: 'rgba(255, 0, 100, 0)'},
        { width: '3em'},
        { color: fontPrimary}
        ], {
          fill: 'both',
          easing: 'ease-in-out',
          duration: 500
        }));
    navAnims[i].pause();
}

// Resize the nav if x + width gets bigger than screen width

function Resize(maxX, x) {
    console.log('resize');
    console.log('maxX %o', maxX);
    console.log('x %o', x);
    if (x > maxX) {
        var prevLeft = parseInt(((getComputedStyle(aside).left).split('px')[0]));
        var newLeft = prevLeft;
        console.log('prevLeft %s', prevLeft);
        function Loop() {
            if (x > maxX) {
                //console.log('loop');
                aside.style.left = ((--newLeft) + 'px');
                x = nav.getBoundingClientRect().right;
                //console.log('resize x: %s', x);
                navLeftOffset = prevLeft - newLeft;
                //console.log('nav left offset %s', navLeftOffset);
                requestAnimationFrame(Loop);
            }
        }

        requestAnimationFrame(Loop);
    }

    else if (navLeftOffset > 0) {
        var prevLeft = parseInt(((getComputedStyle(aside).left).split('px')[0]));
        var newLeft = prevLeft;
        function Loop() {
            if (navLeftOffset > 0) {
                //console.log('loop');
                aside.style.left = ((++newLeft) + 'px');
                navLeftOffset--;
                //console.log('shrink y offset: %s', navLeftOffset);
                requestAnimationFrame(Loop);
            }
            else if (navLeftOffset == 0) {
                // Remove applied inline css, so that external css can do the alignment again
                //console.log('remove attr');
                aside.removeAttribute('style');
            }
        }

        requestAnimationFrame(Loop);
    }

    return true;
}


function ThemeSwitch() {
    if (theme == 'sun') {
        theme = 'moon';
        sunAnimation.playbackRate = 1;
        moonAnimation.playbackRate = -1;
        sunAnimation.play();
        moonAnimation.play()
        body.setAttribute('class', '');
        sunShadow.setAttribute('class', 'hidden');
        moonShadow.setAttribute('class', 'visible');
    }
    else {
        theme = 'sun';
        sunAnimation.playbackRate = -1;
        moonAnimation.playbackRate = 1;
        moonAnimation.play();
        sunAnimation.play()
        body.setAttribute('class', 'light');
        moonShadow.setAttribute('class', 'hidden');
        sunShadow.setAttribute('class', 'visible');
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


function SetAutoScroll() {
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


function NavAnimation(e) {
    if (e.target.tagName == 'LI') {
        console.log('target type %o', e.type);
        console.log('navCollapsed %s', navCollapsed);
        if (e.type == 'mouseover') {
            navCurrentTarget = 'mouseover';
            if (navCollapsed && resizing == false) {
                for (var i = 0; i < navAnims.length; i++) {
                    navAnims[i].playbackRate = 1;
                    navAnims[i].play()
                }

                // Passing a function call by name does not work as expected,
                // only lambda's work for some reason.
                
                navAnims[navAnims.length -1].finished.then(function() {
                    console.log('done animating nav, proceeding to resize...');
                    Resize(document.body.clientWidth, nav.getBoundingClientRect().right);
                });

                console.log('nav open');
                navCollapsed = false;
            }
        }

        else if (e.type == 'mouseout' && navCollapsed == false) {
            navCurrentTarget = 'mouseout';
            setTimeout(function() {
                console.log('nav current target', navCurrentTarget);
                if (navCurrentTarget == 'mouseout') {
                    resizing = true;

                    for (var i = 0; i < navAnims.length; i++) {
                        navAnims[i].playbackRate = -1;
                        navAnims[i].play();
                    }
                    navAnims[navAnims.length -1].finished.then(function() {
                        console.log('done animating nav, proceeding to resize...');
                        if (Resize(0, 0)) {
                            resizing = false;
                        }
                    });
                    console.log('nav collapse');
                    navCollapsed = true;
                }
            }, 1000);
        }
    }
}


export function Animate() {
    InitButtonAnimation();
    buttonScroll.addEventListener('mousedown', SetAutoScroll, false);
    buttonScrollOuter.addEventListener('mousedown', SetAutoScroll, false);
    optionsButton.addEventListener('mousedown', Options, false);
    optionsOuterButton.addEventListener('mousedown', Options, false);
    moon.addEventListener('mousedown', ThemeSwitch, false);
    sun.addEventListener('mousedown', ThemeSwitch, false);
    nav.addEventListener('mouseover', NavAnimation, false);
    nav.addEventListener('mouseout', NavAnimation, false);
}

export function PreloadAnimations() {
    // Animate animations to its last state according to local storage values
    // Only animate collapse since the default is the menu being open 

    if (optionsCollapsed == 'true') {
        optionsMenuAnimation.playbackRate = 20;
        optionsAnimation.playbackRate = 20;

        optionsAnimation.play();
        optionsMenuAnimation.play();
        optionsMenuAnimation.finished.then(function() {
            spinnerBackgroundAnimation.play();
            spinnerBackgroundAnimation.finished.then(function () {
                spinnerBackground.id = 'hidden';
            });
        });
    }
    else {
        spinnerBackgroundAnimation.play();
        spinnerBackgroundAnimation.finished.then(function () {
            spinnerBackground.id = 'hidden';
        });
    }

    if (theme == 'sun') {
        moonAnimation.playbackRate = 20;
        moonAnimation.play();
        body.setAttribute('class', 'light');
        moonShadow.setAttribute('class', 'hidden');
        sunShadow.setAttribute('class', 'visible');
    }
    else if (theme == 'moon') {
        sunAnimation.playbackRate = 20;
        sunAnimation.play();
        sunShadow.setAttribute('class', 'hidden');
        moonShadow.setAttribute('class', 'visible');
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
