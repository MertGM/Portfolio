// When revisiting the page, the browser will sometimes scroll 
// to the user's last visited window location;
// if that happens, we set the location at the top of the page.
var fullpageHeight = document.documentElement.scrollHeight
var prevScrollY = Math.round(document.documentElement.scrollTop);


document.addEventListener('load', function(e) {
    console.log('loaded');
});

// temp scroll function
var scrollbarY = 0;
var start;
var scrolledY;
var prevScrollY = document.documentElement.scrollTop;
var node = document.querySelectorAll('.container100');
var index = 0;
var index2 = node.length -1;
var ticking;
function ScrollToNextNode(timestamp) {
    if (start == undefined) {
        start = timestamp;
    }
    // Because of the scroll event firing rapidly due it being triggered based on n times lines,
    // So that means, if by scrolling once it moves n lines, scroll triggers n times.

    const elapsed = timestamp - start;
    console.log('ENTERED FUNCTION');
    // BUG: As stated above, scrolling occasionally causes line skipping, going too far than intended.
    // The speed of the first scroll is also not consistent due the delay of the function.
    // However without this delay, the function will call too rapidly.
    if (elapsed > 500) { 
        node = document.querySelectorAll('.container100');
        scrolledY = document.documentElement.scrollTop;
        console.log('start: ' + start);

            console.log("scrolledY: " + scrolledY);
            console.log("prevScrollY: " + prevScrollY);

            if (scrolledY > prevScrollY) {
                    console.log('node ' + node[0].clientHeight * index);
                    console.log("prevScrollY: " + prevScrollY);
                        console.log('index ' + index);
                    while (prevScrollY < (node[0].clientHeight * index)) {
                        ticking = false;
                        //console.log('elapsed ' + elapsed);
                        prevScrollY = Math.min((prevScrollY + (0.1 * elapsed / 10)),
                        (node[0].clientHeight * index));
                        console.log('scrolled down ' + prevScrollY);
                        //scrolledY = scrollbarY;
                        document.documentElement.scroll(0, prevScrollY);
                        // scroll to next element

                    }
                    if (!ticking && index < node.length) {
                        console.log('TICKING DOWN');
                        index++;
                        console.log('index ' + index);
                        requestAnimationFrame(ScrollToNextNode);
                    }
            }
            else if (scrolledY < prevScrollY) {
                    console.log('node ' + node[0].clientHeight * index);
                    console.log("prevScrollY: " + prevScrollY);
                        console.log('index2 ' + index2);
                    while (prevScrollY > (node[0].clientHeight * index2)) {
                        ticking = false;
                        //console.log('elapsed ' + elapsed);
                        prevScrollY = (prevScrollY - (0.1 * elapsed /10)), 
                        //scrolledY = scrollbarY;
                        document.documentElement.scroll(0, prevScrollY);
                        // scroll to next elemen
                        console.log('scrolled up ' + prevScrollY);
                    }
                    if (!ticking && index2 > 0) {
                        console.log('TICKING UP');
                        index2--;
                        console.log('index2 ' + index2);
                        requestAnimationFrame(ScrollToNextNode);
                    }
            }
        //console.log('PREVSCROLL Y ' + prevScrollY);
        //console.log('SCROLLED Y ' + scrolledY);
        start = timestamp;
    }
}

// We use the DOM instead of the window property for accessing
// the distance of the scrollbar from the top.
// That is because the window object simply points to the DOM anyways,
// using the DOM directly prevent us from potential bubbling.

// documentElement is the root of the document which in this case is <html>.
window.addEventListener('scroll', function(e) {

    requestAnimationFrame(ScrollToNextNode);

});
document.querySelector('path').setAttribute('d', 
    'm 110.17728,25.092109 c -36.464186,0 -65.998482,28.596408 -65.998482,63.902622 0,28.276899 18.892061,52.160509 45.126444,60.627599 3.299913,0.55913 4.537398,-1.35795 4.537398,-3.03539 0,-1.51766 -0.08106,-6.55001 -0.08106,-11.90187 -16.582001,2.95563 -20.871889,-3.91403 -22.191847,-7.50854 -0.742405,-1.83707 -3.959907,-7.50854 -6.764863,-9.02623 -2.309841,-1.19826 -5.609846,-4.15371 -0.08106,-4.23355 5.197393,-0.0786 8.90979,4.63292 10.147275,6.55 5.939861,9.6653 15.427142,6.94941 19.222044,5.27197 0.577459,-4.15365 2.30984,-6.94942 4.207416,-8.54696 -14.684675,-1.59767 -30.029316,-7.10917 -30.029316,-31.551918 0,-6.949421 2.557415,-12.700657 6.764863,-17.173851 -0.660088,-1.597666 -2.969931,-8.147583 0.660088,-16.934172 0,0 5.527376,-1.677369 18.149594,6.550008 5.279866,-1.437959 10.889756,-2.15679 16.499586,-2.15679 5.60989,0 11.21977,0.718831 16.49965,2.15679 12.62217,-8.307351 18.14953,-6.550008 18.14953,-6.550008 3.62993,8.786589 1.31987,15.336626 0.66008,16.934172 4.2074,4.473194 6.76484,10.144544 6.76484,17.173851 0,24.522598 -15.42713,29.954338 -30.11177,31.551918 2.39249,1.99709 4.4549,5.83111 4.4549,11.82196 0,8.54697 -0.0842,15.41652 -0.0842,17.57322 0,1.67736 1.23756,3.67443 4.53736,3.03539 A 66.105693,64.006451 0 0 0 176.1773,88.994731 c 0,-35.306214 -29.53431,-63.902622 -65.99841,-63.902622 z');
