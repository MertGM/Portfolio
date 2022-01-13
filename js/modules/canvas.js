var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');


function Vec2(x, y) {
    this.x = x;
    this.y = y;
}

var particles = [];
var intervalIds = [];

var width = canvas.width;
var height = canvas.height;

function DrawParticle(amount) {
    for (var i = 0; i < amount; i++) {
        particles.push(new Vec2(Math.floor(Math.random() * width), Math.floor(Math.random() * height)));
        ctx.fillStyle = 'rgb(204, 204, 255)'; // #ccf
        ctx.fillRect(particles[i].x, particles[i].y, 1, 1);
    }
}

function AnimateParticle(particle) {
    var brighten = false;
    var r = 204;
    var g  = 204;
    var b = 255;
    function Loop () {
        if (brighten) {
            r++;
            g++;
            b++;
        }

        else {
            r--;
            g--;
            b--;
        }

        ctx.fillStyle = `rgb(${r}, ${g}, ${b})` 
        ctx.fillRect(particle.x, particle.y, 1, 1);

        if (r == 0) {
            brighten = true;
        }

        else if (r == 204) {
            brighten = false;
        }

        // Don't run the animation if the page is in the background,
        // this will cause the animation to run very fast when alt tabbing back.
        
        else if (document.visibilityState == 'visible') {
            requestAnimationFrame(Loop);
        }

    }

    intervalIds.push(setInterval(Loop, ((Math.floor((Math.random() * 10000 + 1000))))));
}


export function TwinkleStars(amount) {
    canvas.setAttribute('class', 'visible');
    DrawParticle(amount);
    for (var i = 0; i < particles.length; i++) {
        AnimateParticle(particles[i]);
    }
}


export function StopTwinkleStars() {
    for (var i = 0; i < intervalIds.length; i++) {
        clearInterval(intervalIds[i]);
        console.log('remove id %s', i);
    }
    canvas.setAttribute('class', 'invisible');
    console.log('clear canvas');

    // Stopping the particle animation takes awhile, longer the more particles there are.
    setTimeout(function() {
        ctx.clearRect(0, 0, width, height);
    }, 20000);
}
