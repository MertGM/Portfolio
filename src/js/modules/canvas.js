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
    ctx.fillStyle = 'rgb(204, 204, 255)'; // #ccf
    for (var i = 0; i < amount; i++) {
        particles.push(new Vec2(Math.floor(Math.random() * width), Math.floor(Math.random() * height)));
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

    
    //intervalIds.push((setInterval(Loop, Math.floor((Math.random() * 10000 + 1000)))));
    setInterval(Loop, Math.floor((Math.random() * 10000 + 1000)));
}


function FadeOut(x, y, r, g, b) {
    var dr = 0;
    var dg = 0;
    var db = 51;

    var nr = 0;
    var ng = 0;
    var nb = 0;

    var t = 0;

    function Fade() {
        //console.log('fade');
        if (t < 1) {
            //console.log('fading');

            nr = Math.floor(((1-t) * r + dr*t)); 
            ng = Math.floor(((1-t) * g + dg*t)); 
            nb = Math.floor(((1-t) * b + db*t)); 

            ctx.fillStyle = `rgb(${nr}, ${ng}, ${nb})`
            ctx.fillRect(x, y, 1, 1);
            t += 0.1;

            if (document.visibilityState == 'visible') {
                requestAnimationFrame(Fade);
            }
        }
        else {
            ctx.clearRect(x, y, 1, 1);
        }

    }

    requestAnimationFrame(Fade);
}


function MeteorShower() {
    var x = Math.floor((Math.random() * width));
    var y = Math.floor((Math.random() * height));
    var dx = Math.floor((Math.random() * x - 10));
    var dy = Math.floor((Math.random() * y + 10));

    var t = 0;

    var nx = 0;
    var ny = 0;

    var r = Math.floor((Math.random() * 200));
    var g = 255;
    var b = 255;

    function Loop() {
        if (t < 1) {
            nx = Math.round(((1-t)*x + dx*t));
            ny = Math.round(((1-t)*y + dy*t));

            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            ctx.fillRect(nx, ny, 1, 1);
            r++;
            t += 0.05;

            // Fade out particles
            FadeOut(nx, ny, r, g, b);

            if (document.visibilityState == 'visible') {
                requestAnimationFrame(Loop);
            }
        }
    }

    requestAnimationFrame(Loop);
}


export function TwinkleStars(amount) {
    canvas.setAttribute('class', 'visible');
    DrawParticle(amount);
    for (var i = 0; i < particles.length; i++) {
        AnimateParticle(particles[i]);
    }

    setTimeout(MeteorShower, Math.floor((Math.random() * 1000 + 2000)));
    setInterval(MeteorShower, Math.floor((Math.random() * 10000 + 10000)));

}



// Probably not gonna use this because of the delay
/*
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

}*/
