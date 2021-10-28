//
//
// TODO: Make an option for the scrolling speed: fast->slow (smooth), slow->fast (snappy)
//
// 


// Objects are passed by reference, thus the scroll object is able to change it's properties externally

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

// Hash table to an id and index lookup of the 'navigation' elements.
// These elements are found via the parent element provided by the user.
// Elements must be identical to the structure and id name 
// of the containers to be able to scroll to.

// Might make individual object in this object for each element.
// Since the syntax gets cumbersome

var navNodes = {
}


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

function Scrolldown(ftime) {

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


function Scrollup(ftime) {
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


function EventHandler(event) {
    console.log('event %o', event);
    console.log('event target %o', event.target);
    console.log('event target id %s', event.target.id);
    console.log('nav outside handler: %s', navNodes[(event.target.id + 'Id')]);

    if (event.type == 'scroll' && event.target == document) {

        // Because of the scroll event firing rapidly due to events being asynchronous,
        // which results in the event being fired, even during a function call in the event,
        // we use ticking.
        // ticking means it's busy scrolling the page, 
        // we only start executing the function if we currently aren't scrolling scrolling.
        
        if (!scroll.ticking) {
            requestAnimationFrame(ScrollToNextNode);
        }
    }

    else if (event.type == 'click' && navNodes[(event.target.id + 'Id')]) {
        console.log('found a click event!');
        
        console.log('nav found in handler: %s', navNodes[(event.target.id + 'Id')]);

        // Yeah... might want to make seperate objects to avoid this syntax, idk
        
        const displacement = ( (navNodes[(event.target.id + 'Index')]) - scroll.index);

        scroll.index = navNodes[(event.target.id + 'Index')];
        console.log('displacement %s', displacement);
        console.log('nav node +1 %s', (navNodes[(event.target.id + 'Index')]) +1);
        console.log('scroll index +1 %s', (scroll.index) +1);

        if (displacement < 0) {
            requestAnimationFrame(Scrollup);
        }

        else if (displacement > 0) {
            requestAnimationFrame(Scrolldown);
        }
    }
}


export function SmoothScroll() {
    // Might want to enable capturing phase in the future if we have scrollable elements.
    
    if (!scroll.ticking) {
        window.addEventListener('scroll', EventHandler, false);
    }
}


// Add an event listener to the given argument which triggers the EventHandler
// Argument: must be a parent of child elements with the child's id corresponding to
// the container classes of the document.

// Id's and indecies get put in a hash table (object) for instant lookup.
// A navigator is a parent element that has a bubbling phase ... 

export function Listen(nav) {
    //  we create a lookup table (hash table) aka object,
    //  if we don't already have one.
    //  This is so we have instant access to the index (page) of an element (container)
    
    if (Object.keys(navNodes).length == 0) {
        for (var i = 0; i < nav.children.length; i++) {
            navNodes[((nav.children[i].id) + 'Id')] = nav.children[i].id;
            navNodes[((nav.children[i].id) + 'Index')] = i;
        }
    }

    console.log('navNodes %o', navNodes);
    console.log('home id %o', navNodes.homeId);
    console.log('home index %o', navNodes.homeIndex);

    nav.addEventListener('click', EventHandler, false);
}
