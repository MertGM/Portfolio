//
//
// TODO: Make an option for the scrolling speed: fast->slow (smooth), slow->fast (snappy)
//
// TODO: Make scrolling to current index + > 1 transition close to destination's height relative to 
// root (start height, 0), instead of this irritating fast scroll.
//
// TODO: Draw greetings on the landing page aka root

import {preferences} from './animate.js'; 
console.log('preferences %o', preferences)

// Objects are passed by "reference", thus the scroll object is able to change it's properties externally

export var scroll = {
    prevScrollY: document.documentElement.scrollTop,
    currentScrollY: 0,

    // This is a "reference" (shallow copy) of the body's HTMLCollection.
    
    node: Array.from(document.body.children),
    index: 0,
    ticking: false,
    active: false,

};


// RequestAnimationFrame doesn't accept arguments, so for now
// these variables are global.

var t = 0;
var sum = 0;
var clickedNode = false;

// Hash table to an id and index lookup of the 'navigation' elements.
// These elements are found via the parent element provided by the user.
// Elements must be identical to the structure, and id name 
// of the containers to be able to scroll to.

// Might make individual object in this object for each element.
// Since the syntax gets cumbersome.

var navNodes = {
    id: {},
}

// Add a new object to the HTMLCollection that includes the height of the top page, which is '0' in 'height'

scroll.node.unshift({clientHeight: 0});
console.log(scroll.node);

// Check what the index is on page load, so that when you refresh at a certain position,
// the index will get set.
function SetCurrentIndex() {
    console.log('prevscrolly %s', scroll.prevScrollY);
    for (var i = 0; i < scroll.node.y.length; i++) {
        console.log(scroll.node.y[i]);
        if (scroll.node.y[i] >= scroll.prevScrollY) {
            console.log('index: %s', i)
            scroll.index = i;
            return;
        }
    }
}

window.addEventListener('load', SetCurrentIndex, false);

function ScrollToNextNode() {
    scroll.currentScrollY = document.documentElement.scrollTop;

    console.log('scroll obj %o', scroll);
    console.log('scroll.prevScrollY ' + scroll.prevScrollY);
    console.log('currentScrollY ' + scroll.currentScrollY);
    console.log('scroll' + scroll.index);
    console.log('node obj %o', scroll.node);

        if (scroll.currentScrollY > scroll.prevScrollY) {
            // Include the index of the page below (relative to the current page) beforehand,
            // to calculate the sum in the scrolldown function
            if (scroll.index != scroll.node.y.length) {scroll.index += 1;}
            Scrolldown();
        }

        else if (scroll.currentScrollY < scroll.prevScrollY) {
            // Same reason as above
            if (scroll.index != 0) {scroll.index -= 1;}
            Scrollup();
        }
}

// Quadratic bezier curve
function Easein(p0,p1,p2) {
    var p = (((1-t)**2 * p0) + (2*(1-t)*t*p1) + (t**2*p2))
    document.documentElement.scroll(0, p);
    return p;
}

function Scrolldown() {
    // Todo: Scroll function doesn't acknowledge the page starting somewhere but the first container;
    // e.g: on reloading the page at a specific location, the page will stay on the previous location.
    // Our algorithm thinks it will always start at the top of the page (the first container).
    

    // if we call this function via a click event, then ticking is false
    
    if (!scroll.ticking || clickedNode) {
        sum = scroll.node.y[scroll.index];
        scroll.ticking = true;
        clickedNode = false;
        scroll.currentScrollY = window.scrollY;

        // Have as starting point the current scroll y, so that we can 
        // smoothly scroll to the destination
        scroll.prevScrollY = scroll.currentScrollY;
        console.log('click');
        console.log('Sum %c%s  ', 'color: green;', sum);
        console.log('current scroll y %c%s  ', 'color: blue;', scroll.currentScrollY);
    }
    
    if (scroll.currentScrollY >= sum) {
        scroll.prevScrollY = scroll.currentScrollY;
        t = 0;
        // End of scrolling
        scroll.ticking = false;
        scroll.prevScrollY
        console.log('done scrolling');
        console.log('current scroll y %c%s  ', 'color: blue;', scroll.currentScrollY);
        console.log('prev scroll y %c%s  ', 'color: red;', scroll.prevScrollY);
        return;
    }

    console.log('index %s', scroll.index);
    console.log('Sum %c%s  ', 'color: blue;', sum);


    // Having the control point closer to the some makes scrolling ease out
    // and further ease in.
    // The default atm is ease out.
    
    scroll.currentScrollY = Easein(scroll.prevScrollY, sum - 100, sum);
    t+= 0.02;


    console.log('scroll.prevScrollY ' + scroll.prevScrollY);
    console.log('scroll.currentScrollY ' + scroll.currentScrollY);
    console.log('scrolled down');

    requestAnimationFrame(Scrolldown);
}


function Scrollup() {
    if (!scroll.ticking || clickedNode) {
        sum = scroll.node.y[scroll.index];
        scroll.ticking = true;
        clickedNode = false;
        scroll.currentScrollY = window.scrollY;
        scroll.prevScrollY = scroll.currentScrollY;
        console.log('click');
        console.log('Sum %c%s  ', 'color: green;', sum);
        console.log('current scroll y %c%s  ', 'color: blue;', scroll.currentScrollY);
    }

    if (scroll.currentScrollY <= sum) {
        t = 0;
        // End of scrolling
        scroll.ticking = false;
        clickedNode = false;

        scroll.prevScrollY = scroll.currentScrollY;
        console.log('done scrolling');
        console.log('Sum %c%s  ', 'color: green;', sum);
        console.log('current scroll y %c%s  ', 'color: blue;', scroll.currentScrollY);
        return;

    }

    console.log('index %s', scroll.index);
    console.log('Sum %c%s  ', 'color: blue;', sum);


    // Placeholder values, easing can be smoother than it is.
    
    scroll.currentScrollY = Easein(scroll.prevScrollY, sum + 100, sum);
    t+= 0.02;


    console.log('scroll.prevScrollY ' + scroll.prevScrollY);
    console.log('scroll.currentScrollY ' + scroll.currentScrollY);
    console.log('scrolled up');

    requestAnimationFrame(Scrollup);
}

function Sum(htmlCollection, stop) {
    var x = 0;
    for (var i = 0; i < stop; i++) {
        x += htmlCollection[i].clientHeight;
    }
    return x;
}


function CurrentNode() {
        // Offset so that >= and <= don't collapse
        var yOffset = 25;
        if (window.scrollY >= ((scroll.node.y[scroll.index+1]) - yOffset)) {

            // Reset the background color to it's 'non active' color
            document.getElementById((navNodes.id.array[scroll.index])).style.background = 'rgba(255, 0, 100, 0.5)';
            console.log('changed color');
            scroll.index++;
            console.log('index %s', scroll.index);
        }
        // Bug: This doesn't get detected when scrolling up
        else if ((window.scrollY <= ((scroll.node.y[scroll.index]) - yOffset))) {
            document.getElementById((navNodes.id.array[scroll.index])).style.background = 'rgba(255, 0, 100, 0.5)';
            scroll.index--;
            console.log('changed color');
            console.log('index %s', scroll.index);
        }
}

// Might make the EventHanlder reside in a different script file,
// since it handles different events besides scroll

function EventHandler(event) {
    // event.target gets the previous fired event
    // This is handy when Event listener has a bubbling phase
    console.log('event %o', event);
    console.log('event target %o', event.target);
    console.log('event target id %s', event.target.id);
    console.log('nav outside handler: %s', navNodes.id[event.target.id]);

    if (event.type == 'scroll' && event.target == document) {
        CurrentNode();
        
        console.log("current node %s", navNodes.id.array[scroll.index]);
        document.getElementById((navNodes.id.array[scroll.index])).style.background = 'rgba(255, 20, 0, 0.5)';

        // Because of the scroll event firing rapidly due to events being asynchronous,
        // which results in the event being fired, even during a function call in the event,
        // we use ticking.
        // ticking means it's busy scrolling the page, 
        // we only start executing the function if we currently aren't scrolling scrolling.
        
        if (!scroll.ticking && preferences["autoScroll"] == 'true') {
            console.log('error');
            requestAnimationFrame(ScrollToNextNode);
        }
    }

    else if (event.type == 'click') {
        console.log('found a click event!');

        if (preferences['autoScroll'] == 'false') {
            scroll.ticking = true;
            console.log('turned off auto scroll')
        }

        else if (preferences['autoScroll'] == 'true') {
            scroll.ticking = false;
            // Save the current window scroll y when activating auto scroll enabled,
            // so that when you scroll it will be able to compare prevscrollY with currentScrollY
            scroll.prevScrollY = window.scrollY;
            console.log('turned on auto scroll')
        }

        if (event.target.id == navNodes.id[event.target.id]) {

            console.log('nav found in handler: %s', navNodes.id[event.target.id]);
            var displacement = 0;

            for (var i = 0; i < navNodes.id.array.length; i++) {
                if (event.target.id == navNodes.id.array[i]) {
                    scroll.prevScrollY = scroll.node.y[scroll.index];
                    displacement = i - scroll.index;
                    if (displacement < 0) {
                        // This makes sure the current index node changes its color,
                        // as currentNode doesn't detect <=, sometimes.
                        document.getElementById((navNodes.id.array[scroll.index])).style.background = 
                            'rgba(255, 0, 100, 0.5)';
                    }
                    scroll.index += displacement;
                }
            }

            console.log('displacement %s', displacement);
            if (displacement < 0) {
                clickedNode = true;
                console.log('going to scroll up');
                requestAnimationFrame(Scrollup);
            }

            else if (displacement > 0) {
                clickedNode = true;
                console.log('going to scroll down');
                requestAnimationFrame(Scrolldown);
            }
        }
        
        else if (event.target.className == 'theme') {
            console.log('Event target %o', event.target);
            const el = document.querySelector('.theme');
            console.log('element %s', el);
            if (el.id == 'dark') {
                el.id = 'light';
                console.log('switched to light theme', el.id)
            }

            else if (el.id == 'light') {
                el.id = 'dark';
                console.log('switched to dark theme %s', el.id)
            }
        }
    }
}

// This function will enable auto scrolling for the given page.
export function AutoScroll() {
    window.addEventListener('scroll', EventHandler, false);
}


// Add an event listener to the given argument which triggers the EventHandler
// Argument: must be a parent of child elements with the child's id corresponding to
// the container classes of the document.

// Id's and indecies get put in a hash table (object) for instant lookup.
// A navigator is a parent element that has a bubbling phase ... 

export function Listen(el, nav=false) {
    //  we create a lookup table (hash table) aka object,
    //  if we don't already have one.
    //  This is so we have instant access to the index (page) of an element (container)
    
    if ((Object.keys(navNodes.id).length == 0) && nav == true) {
        for (var i = 0; i < el.children.length; i++) {
            navNodes.id[(el.children[i].id)] = el.children[i].id;
        }

        var nav = Object.keys(navNodes.id);
        console.log("navs %o", navNodes.id);

        
        var node = [];
        var m = 0;
        console.log('node id %o', scroll.node[3]);
        for (var j = 0; j < scroll.node.length; j++) {
            var classname = scroll.node[j].classList;
            if (classname != undefined) {
                for (var k = 0; k < classname.length; k++) {
                    //console.log(classname[k]);
                    //console.log(nav[j]);
                    if (nav[m] == classname[k]) {
                        //console.log('found matching id %s', classname[k]);

                        // Sum the height of the elements up to the node aka parent node
                        node.push(Sum(scroll.node, j-1));
                        m++;
                    }
                }
            }
        }

        scroll.node.y = node;
        console.log("%o", scroll.node.y);
        navNodes.id.array = Object.keys(navNodes.id);
    }

    console.log('Added event listener on %o', el);
    el.addEventListener('click', EventHandler, false);
}
