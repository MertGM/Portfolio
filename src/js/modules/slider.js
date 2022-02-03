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

function Lerp(p1, p2, t) {
    return ((1-t) * p1 + p2*t)
}

function Slide(e) {
    var t = 0;
    var x = 0;

    if (e.target.className == 'slide-right') {
        var direction = 1;
    }
    else {
        var direction = -1;
    }

    function Loop() {
        if (t <= 1.05) {
            sliding = true;
            ctx.save();
            ctx.clearRect(0,0, imageWidth, imageHeight);
            x = Lerp(0, imageWidth, t);

            if (direction == 1) {
                ctx.translate(-x, 0);
                // Javascript returns a negative value on -a mod n, so we have to add n to get a positive value.
                ctx.drawImage(sliderImages[((((imageIndex+direction)%sliderImages.length) + sliderImages.length) % sliderImages.length)], imageWidth, 0, imageWidth, imageHeight);
            }

            else {
                ctx.translate(x, 0);
                ctx.drawImage(sliderImages[((((imageIndex-1)%sliderImages.length) + sliderImages.length) % sliderImages.length)], -imageWidth, 0, imageWidth, imageHeight);
            }

            ctx.drawImage(sliderImages[(((imageIndex%sliderImages.length) + sliderImages.length) % sliderImages.length)], 0, 0, imageWidth, imageHeight);

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
function SetImage(image, i) {
    image.onload = function() {
        sliderImages.push(image);
        if (i == 0) {
            ctx.drawImage(image, 0, 0, image.width, image.height);
            imageWidth = sliderImages[0].width; 
            imageHeight = sliderImages[0].height; 
        }
    }
}
export function Slider(images, canvas) {
    var canvas = document.querySelector('.' + canvas);
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;
    ctx = canvas.getContext('2d');
    var dx = 0;
    
    for (var i = 0; i < images.length; i++) {
        const sliderImage = new Image(300, 150);
        sliderImage.crossOrigin = 'anonymous';
        sliderImage.referrerPolicy = 'no-referrer';
        sliderImage.src = document.location + 'assets/' + images[i];
        SetImage(sliderImage, i);
    }
    

    arrowLeft.addEventListener('click', Slide, false)
    arrowRight.addEventListener('click', Slide, false)
}
