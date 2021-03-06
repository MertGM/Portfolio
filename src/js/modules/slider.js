// @Future: more sliders will be in the DOM as there will be more cards.
var arrowLeft = document.querySelector('.arrow-left')
var arrowRight = document.querySelector('.arrow-right')
var canvasWidth;
var canvasHeight;
var imageWidth;
var imageHeight;
var ctx;
var sliderImages = [];
var imageIndex = 0;
var sliding = false;
var slider = document.querySelector('.slider')
var discordDescriptions = document.querySelectorAll('.discord');
var fadeDescriptionAnimations = [];


var arrowsVisible = false;
var arrowLeftHoverAnimation = arrowLeft.animate([
    { opacity: 1},
    ], {
        fill: 'forwards',
        easing: 'ease-in-out',
        duration: 300
});
arrowLeftHoverAnimation.pause();

var arrowRightHoverAnimation = arrowRight.animate([
    { opacity: 1},
    ], {
        fill: 'forwards',
        easing: 'ease-in-out',
        duration: 300
});
arrowRightHoverAnimation.pause();


function SliderArrows() {
    if (!arrowsVisible) {
        console.log('show arrows');
        arrowsVisible = true;
        arrowLeftHoverAnimation.playbackRate = 1;
        arrowRightHoverAnimation.playbackRate = 1;
        arrowLeftHoverAnimation.play();
        arrowRightHoverAnimation.play();
    }
    else {
        console.log('hide arrows');
        arrowsVisible = false;
        arrowLeftHoverAnimation.playbackRate = -1;
        arrowRightHoverAnimation.playbackRate = -1;
        arrowLeftHoverAnimation.play();
        arrowRightHoverAnimation.play();
    }
}

function Lerp(p1, p2, t) {
    return ((1-t) * p1 + p2*t)
}

function Slide(e) {
    console.log('event: ', e.target);
    var t = 0;
    var x = 0;

    if (e.target.className == 'slide-right' || e.target.className == 'arrow-right') {
        var direction = 1;
    }

    else {
        var direction = -1;
    }

    // Javascript returns a negative value on -a mod n, so we have to add n mod n to get a positive value.
    
    var currSliderIndex = ((((imageIndex+direction)%sliderImages.length) + sliderImages.length) % sliderImages.length)
    var prevSliderIndex = (((imageIndex%sliderImages.length) + sliderImages.length) % sliderImages.length);

    fadeDescriptionAnimations[prevSliderIndex].playbackRate = 1;
    fadeDescriptionAnimations[prevSliderIndex].play();
    fadeDescriptionAnimations[prevSliderIndex].finished.then(function() {
        discordDescriptions[prevSliderIndex].classList.add('hidden');
        fadeDescriptionAnimations[currSliderIndex].playbackRate = -1;
        fadeDescriptionAnimations[currSliderIndex].play();
        discordDescriptions[currSliderIndex].classList.remove('hidden');
    });

    function Loop() {
        if (t <= 1.05) {
            sliding = true;
            ctx.save();
            ctx.clearRect(0,0, imageWidth, imageHeight);
            x = Lerp(0, imageWidth, t);

            if (direction == 1) {
                ctx.translate(-x, 0);
                ctx.drawImage(sliderImages[currSliderIndex], imageWidth, 0, imageWidth, imageHeight);
            }

            else {
                ctx.translate(x, 0);
                ctx.drawImage(sliderImages[currSliderIndex], -imageWidth, 0, imageWidth, imageHeight);
            }

            ctx.drawImage(sliderImages[prevSliderIndex], 0, 0, imageWidth, imageHeight);

            t += 0.05;
            ctx.restore();
            requestAnimationFrame(Loop);
        }

        else {
            imageIndex += direction;
            sliding = false;
        }
    }
    if (!sliding) {
        Loop();
    }
}
function SetImage(image, first=false) {
    image.onload = function() {
        if (first) {
            ctx.drawImage(image, 0, 0, image.width, image.height);
            imageWidth = sliderImages[0].width; 
            imageHeight = sliderImages[0].height; 
        }
    }
}
export function Slider(images, canvas) {
    var canvas = document.getElementById(canvas);
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;
    ctx = canvas.getContext('2d');
    
    for (var i = 0; i < images.length; i++) {
        sliderImages.push(new Image(canvasWidth, canvasHeight));
        sliderImages[i].crossOrigin = 'anonymous';
        sliderImages[i].referrerPolicy = 'no-referrer';
        sliderImages[i].src = document.location + 'assets/' + images[i];

        // Block the for loop with the function call until image is properly loaded.
        if (i == 0) {
            SetImage(sliderImages[i], true);
        }
        else {
            SetImage(sliderImages[i], false);
        }
    }

    for (i = 0; i < discordDescriptions.length; i++) {
        fadeDescriptionAnimations.push((discordDescriptions[i].animate([
            {'opacity': 0}
        ], {
            duration: 300,
            fill: 'forwards'
        })));
        fadeDescriptionAnimations[i].pause();
    }
    
    console.log('Discord descriptions: %o', discordDescriptions);

    slider.addEventListener('mouseenter', SliderArrows, false);
    slider.addEventListener('mouseleave', SliderArrows, false);
    arrowLeft.addEventListener('click', Slide, false)
    arrowRight.addEventListener('click', Slide, false)
}
