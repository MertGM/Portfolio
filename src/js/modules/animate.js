var body = document.querySelector('body');

var optionsMenu = document.querySelector('.options-menu');
var optionsMenuWrapper = document.querySelector('.options-menu-wrapper');
var options = document.querySelector('.options');

// Svgs should have id names for handling logic and class if needed for styling.
// querySelector on svgs don't return Element object but instead SvgElementObject,
// which does not have an className attribute.

var optionIcons = document.getElementById('options-icons');
var optionsInnerButton = document.getElementById('inner-circle');
var optionsOuterButton = document.getElementById('outer-circle');
var buttonScrollInner= document.getElementById('auto-inner');
var buttonScrollOuter = document.getElementById('auto-outer');

var moon = document.getElementById('moon');
var moonShadow = document.getElementById('moon-shadow');
var sun = document.getElementById('sun');
var sunShadow = document.getElementById('sun-shadow');

var nav = document.querySelector('.nav'); 

var emailModal = document.getElementById('email-confirmation');

// We show the options menu at the start, because css conflicts with our transformations.
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
    { opacity: 0 },
    ], {
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


var buttonAnimation = buttonScrollInner.animate([
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
var optionsInnerButtonAnimation;
var optionsOuterButtonAnimation;

function InitButtonAnimation() {
    optionsFill = getComputedStyle(optionsInnerButton).getPropertyValue('--btn-primary');
    if ((document.querySelector('body').className) == 'light') {
            color1 = '#f91';
            color2 = '#fb1';
    }
    else {
            color1 = '#9af';
            color2 = '#aef'
    }

    optionsInnerButtonAnimation = optionsInnerButton.animate([
            { fill: optionsFill},
            { fill: color1},
            { fill: color2},
            { fill: optionsFill},
            ], {
                duration: 500
    });
    optionsInnerButtonAnimation.pause();

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
var navLeftOffset = 0;

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


var aside = document.querySelector('aside');

// Resize the nav if x + width gets bigger than page width
function ResizeNav(maxX, x) {
    var prevLeft = parseInt(((getComputedStyle(aside).left).split('px')[0]));
    var newLeft = prevLeft;
    var prevTime = -1;
    var dt;
    // Conversion to milliseconds included: unit * ms = 3 * 0.001 
    var speed = 0.003;

    console.log('resize');
    console.log('maxX %o', maxX);
    console.log('x %o', x);

    // Expand
    if (x > maxX) {
        console.log('prevLeft %s', prevLeft);
        function Loop(timestamp) {
            if (x > maxX) {
                if (prevTime == -1) {
                    prevTime = timestamp;
                    requestAnimationFrame(Loop);
                }
                dt = timestamp - prevTime;
                newLeft -= speed * dt;
                aside.style.left = (newLeft + 'px');
                x -= speed * dt;
                //console.log('Overflow-x: %s', x);
                //console.log('nav left offset %s', navLeftOffset);
                requestAnimationFrame(Loop);
            }
            else {
                navLeftOffset = prevLeft - newLeft;
                navFlags = 3;
            }
        }

        requestAnimationFrame(Loop);
    }

    // Collapse
    else if (navLeftOffset > 0) {
        function Loop(timestamp) {
            if (navLeftOffset > 0) {
                if (prevTime == -1) {
                    prevTime = timestamp;
                    requestAnimationFrame(Loop);
                }
                dt = timestamp - prevTime;
                newLeft += speed * dt;
                aside.style.left = (newLeft + 'px');
                navLeftOffset -= speed * dt;
                //console.log('shrink y offset: %s', navLeftOffset);
                requestAnimationFrame(Loop);
            }
            else if (navLeftOffset <= 0) {
                // Remove applied inline css, so that external css can do the alignment again
                //console.log('remove attr');
                aside.removeAttribute('style');
                navFlags = 0;
            }
        }

        requestAnimationFrame(Loop);
    }
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


var emailModalAnimation = emailModal.animate([
    { bottom: '50px'}
    ], {
      fill: 'forwards',
      easing: 'ease-in-out',
      duration: 500
});
emailModalAnimation.pause();


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
        optionsInnerButtonAnimation.play();
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


function Wait(ms) {
    return new Promise(function(resolve) {
        return setTimeout(resolve, ms);
    });
}


// 0 = Collapsed.
// 1 = Animation queued to transition from expanded to collapsed (cancelable).
// 2 = Animating collapse or expand.
// 3 = Expanded.
var navFlags = 0;
function NavAnimation(e) {
    if (e.target.tagName == 'LI') {
        console.log('target type %o', e.type);
        console.log('navFlags: %s', navFlags);
        // Cancel queued collapse.
        if (navFlags == 1) {
            // Reset to expanded so animation can be queued again.
            navFlags = 3;
        }
        else if (navFlags == 0) {
            navFlags = 2;

            for (var i = 0; i < navAnims.length; i++) {
                navAnims[i].playbackRate = 1;
                navAnims[i].play();
            }

            navAnims[navAnims.length -1].finished.then(function() {
                console.log('done animating nav, proceeding to resize...');
                ResizeNav(document.body.clientWidth, nav.getBoundingClientRect().right);
            });

            console.log('nav expanded.');
        }
        else if (e.type == 'mouseout' && navFlags == 3) {
            navFlags = 1;
            Wait(1000).then(function() {
                // Check if animation is still queued.
                if (navFlags == 1) {
                    navFlags = 2;

                    for (var i = 0; i < navAnims.length; i++) {
                        navAnims[i].playbackRate = -1;
                        navAnims[i].play();
                    }

                    navAnims[navAnims.length -1].finished.then(function() {
                        console.log('done animating nav, proceeding to resize...');
                        ResizeNav(0, 0);
                    });

                    console.log('nav collapsed.');
                }
            });
        }
    }
}


export function Animate() {
    InitButtonAnimation();
    buttonScrollInner.addEventListener('mousedown', SetAutoScroll, false);
    buttonScrollOuter.addEventListener('mousedown', SetAutoScroll, false);
    optionsInnerButton.addEventListener('mousedown', Options, false);
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


export function ConfirmEmailAnimation() {
    console.log('show email modal')
    console.log('playState %o', emailModalAnimation.playState);

    return new Promise(function(resolve) {
        // This prevents an animation from playing if there is already an animation playing.
        if (emailModalAnimation.playState == 'paused') {
            emailModalAnimation.playbackRate = 1;
            // show modal
            emailModalAnimation.play();
            emailModalAnimation.finished.then(function() {
                Wait(6000).then(function() {
                    emailModalAnimation.playbackRate = -1;
                    // hide modal
                    emailModalAnimation.play();
                    emailModalAnimation.finished.then(function() {
                        emailModalAnimation.pause();
                        return resolve();
                    });
                });
            });
        }
    });
}
