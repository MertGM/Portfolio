//
//
// TODO: Make an option for the scrolling speed: fast->slow (smooth), slow->fast (snappy)
//
// 


// Objects are passed by "reference", thus the scroll object is able to change it's properties externally

export var scroll = {
    scrolledY: 0,
    prevScrollY: document.documentElement.scrollTop,
    currentScrollY: 0,

    // This is a "reference" (shallow copy) of the body's HTMLCollection.
    // The -1 removes the script element from the array.
    
    node: Array.from(document.body.children),
    index: 0,
    ticking: false,
    active: false,

};

// RequestAnimationFrame doesn't accept arguments, so for now
// these variables are global.

var t = 0;
var sum = 0;

// Hash table to an id and index lookup of the 'navigation' elements.
// These elements are found via the parent element provided by the user.
// Elements must be identical to the structure, and id name 
// of the containers to be able to scroll to.

// Might make individual object in this object for each element.
// Since the syntax gets cumbersome.

var navNodes = {
}


// Add a new object to the HTMLCollection that includes the height of the top page, which is '0' in 'height'

scroll.node.unshift({clientHeight: 0});
console.log(scroll.node);


function ScrollToNextNode() {
    scroll.scrolledY = document.documentElement.scrollTop;

    console.log('scroll obj %o', scroll);
    console.log('scroll.prevScrollY ' + scroll.prevScrollY);
    console.log('scrolledY ' + scroll.scrolledY);
    console.log('scroll' + scroll.index);
    console.log('node obj %o', scroll.node);

        if (scroll.scrolledY > scroll.prevScrollY) {
            // Include the index of the page below (relative to the current page) beforehand,
            // to calculate the sum in the scrolldown function
            scroll.index += 1;
            Scrolldown();
        }

        else if (scroll.scrolledY < scroll.prevScrollY) {
            // Same reason as above
            scroll.index -= 1;
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
    
    // Only calculate the sum on the first call of this function
    if (!scroll.ticking) {
        sum = Sum(scroll.node, scroll.index);
        scroll.ticking = true;
    }

    if (scroll.currentScrollY >= sum) {
         
        scroll.prevScrollY = scroll.currentScrollY;
        t = 0;
        // End of scrolling
        scroll.ticking = false;
        return;

    }

    console.log('Sum %c%s  ', 'color: blue;', sum);


    // Placeholder values, easing can be smoother than it is.
    
    scroll.currentScrollY = Easein(scroll.prevScrollY, scroll.prevScrollY +600, sum);
    t+= 0.02;


    console.log('scroll.prevScrollY ' + scroll.prevScrollY);
    console.log('scroll.currentScrollY ' + scroll.currentScrollY);
    console.log('scrolled down');

    requestAnimationFrame(Scrolldown);
}


function Scrollup() {

    if (!scroll.ticking) {
        sum = Sum(scroll.node, scroll.index);
        scroll.ticking = true;
    }


    if (scroll.currentScrollY <= sum) {
         
        scroll.prevScrollY = scroll.currentScrollY;
        t = 0;
        // End of scrolling
        scroll.ticking = false;
        return;

    }

    console.log('Sum %c%s  ', 'color: blue;', sum);


    // Placeholder values, easing can be smoother than it is.
    
    scroll.currentScrollY = Easein(scroll.prevScrollY, scroll.prevScrollY -600, sum);
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

// Might make the EventHanlder reside in a different script file,
// since it handles different events besides scroll

function EventHandler(event) {
    // event.target gets the previous fired event
    // This is handy when Event listener has a bubbling phase
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

    else if (event.type == 'click') {
        console.log('found a click event!');
        if (event.target.id == navNodes[(event.target.id + 'Id')]) {
            // Yeah... might want to make seperate objects to avoid this syntax, idk
            
            console.log('nav found in handler: %s', navNodes[(event.target.id + 'Id')]);
            var displacement = 0;

            for (var i = 0; i < scroll.node.length; i++) {
                var classes = scroll.node[i].classList;

                // element with no class name
                if (classes == undefined) {
                    continue;
                }
                console.log('class list %o', classes);
                for (var j = 0; j < classes.length; j++) {
                    if (classes[j] == navNodes[(event.target.id + 'Id')]) {
                        displacement = i - scroll.index;
                        scroll.index = i;
                        console.log('class index %s', i);
                        console.log('element %o', classes[j]);
                    }
                }
            }
            //const displacement = ((navNodes[(event.target.id + 'Index')]) - scroll.index);
            //scroll.index = navNodes[(event.target.id + 'Index')];

            //console.log('displacement %s', displacement);
            //console.log('nav node +1 %s', (navNodes[(event.target.id + 'Index')]) +1);
            //console.log('scroll index +1 %s', (scroll.index) +1);

            if (displacement < 0) {
                requestAnimationFrame(Scrollup);
            }

            else if (displacement > 0) {
                requestAnimationFrame(Scrolldown);
            }
        }
        
        // TODO: Might want to set a bitfield with flags to avoid nested if statements

        // Checking for className doesn't work on svg elements,
        // because it gives us a SVGAnimatedString instead unlike a normal html element
        
        
        else if (event.target.className == 'smooth-scroll') {
            console.log('Event target %o', event.target);
            const el = document.querySelector('.smooth-scroll');
            const elbody = document.querySelector('body');
            console.log('element %o', el);
            console.log('element %o', elbody);

            if (el.id == 'on') {
                el.id = 'off';

                // Ticking true does not mean it's scrolling in this context;
                // we set it to true to not listen in the AutoScroll function
                
                scroll.ticking = true;
            }

            else if (el.id == 'off') {
                el.id = 'on';
                scroll.ticking = false;
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
