//
//
//TODO: Make an option for the scrolling speed: fast->slow (smooth), slow->fast (snappy)
//
//


// The scroll object is imported as a reference, thus able to change it's properties externally

export var scroll = {
    start: 0,
    scrolledY: 0,
    prevScrollY: document.documentElement.scrollTop,

    // This is a reference (shallow copy) of the body's HTMLCollection
    // The -1 removes the script element from the array
    
    node: Array.from(document.body.children).slice(0, document.body.children.length -1),
    index: 0,
    ticking: false,
    active: false,
};


// Add a new object to the HTMLCollection that includes the height of the top page, which is '0' in height

scroll.node.unshift({clientHeight: 0});


function ScrollToNextNode(timestamp) {
    if (scroll.start == undefined) {
        scroll.start = timestamp;
    }

    const elapsed = timestamp - scroll.start;

    /*console.log('ENTERED FUNCTION');
    console.log('scroll.start' + scroll.start);
    console.log('TIMESTAMP' + timestamp);
    console.log('ELAPSED: ' + scroll.elapsed);*/

    if (elapsed > 100) { 
        scroll.scrolledY = document.documentElement.scrollTop;
        scroll.start = timestamp;

        console.log('scroll.start: ' + scroll.start);
        console.log('scroll' + (scroll.node[scroll.index].clientHeight * scroll.index));
        console.log('scrollvalue' + scroll.node[3].clientHeight);
        console.log('scroll obj %o', scroll);
        console.log('scroll.prevScrollY ' + scroll.prevScrollY);
        console.log('scrolledY ' + scroll.scrolledY);
        console.log('scroll' + scroll.index);
        console.log('node obj %o', scroll.node);

            if (scroll.scrolledY > scroll.prevScrollY) {
                // Include the index of the page below (relative to the current page) beforehand,
                // to calculate the sum in the scrolldown function
                scroll.index += 1;
                Scrolldown(timestamp);
            }

            else if (scroll.scrolledY < scroll.prevScrollY) {
                // Include the index of the page above (relative to the current page) beforehand,
                // to calculate the sum in the scrolldown function
                scroll.index -= 1;
                Scrollup(timestamp);
            }

    }
}

export function Scrolldown(ftime) {

    // incase the function does not get called via the scroll event,
    // e.g: via a click event
    if (scroll.start == undefined) {
        scroll.start = ftime;
    }

    const elapsed = ftime - scroll.start;
    
    const sum = Sum(scroll.node, scroll.index);
    console.log('Sum %c%s  ', 'color: blue;', sum);
    if (scroll.prevScrollY < (Sum(scroll.node, scroll.index))) {
        scroll.start = ftime;
        scroll.ticking = true;

        scroll.prevScrollY = Math.min((scroll.prevScrollY + 10 + (0.1 * elapsed /10)),
        sum);
        document.documentElement.scroll(0, scroll.prevScrollY);

        console.log('scroll.prevScrollY ' + scroll.prevScrollY);
        console.log('scrolled down');
        /*console.log('elapsed ' + elapsed);
        console.log('ftime ' + ftime);
        console.log('scroll.start ' + scroll.start);*/

        requestAnimationFrame(Scrolldown);
    }
    else {
        // End of scrolling
        scroll.ticking = false;
    }
}


export function Scrollup(ftime) {
    const elapsed = ftime - scroll.start;

    // incase the function does not get called via the scroll event,
    // e.g: via a click event
    if (scroll.start == undefined) {
        scroll.start = ftime;
    }

    const sum = Sum(scroll.node, scroll.index);
    console.log('Sum %c%s  ', 'color: blue;', sum);

    if (scroll.prevScrollY > sum) {
        scroll.start = ftime;
        scroll.ticking = true;

        // The -10 is because in first couple exectutions of the function,
        // scroll.prevScrollY receives a fraction and causes the scroll to glitch/hitch
        scroll.prevScrollY = Math.max((scroll.prevScrollY - 10 - (0.1 * elapsed /10)),
        sum);
        document.documentElement.scroll(0, scroll.prevScrollY);

        console.log('elapsed ' + elapsed);
        console.log('scrolled up ' + scroll.prevScrollY);
        requestAnimationFrame(Scrollup);
    }
    else {
        // End of scrolling
        scroll.ticking = false;
    }
}

function Sum(htmlCollection, stop) {
    var x = 0;
    for (var i = 0; i <= stop; i++) {
        x += htmlCollection[i].clientHeight;
    }
    return x;
}

export function SmoothScroll() {
    window.addEventListener('scroll', function(e) {

        // Because of the scroll event firing rapidly due to events being asynchronous,
        // which results in the event being fired, even during a function call in the event,
        // we use ticking.
        // ticking means it's busy scrolling the page, 
        // we only start executing the function if we stop scrolling.
        
        if (!scroll.ticking) {
            requestAnimationFrame(ScrollToNextNode);
        }
    });
}
