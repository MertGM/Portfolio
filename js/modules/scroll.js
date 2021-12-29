//
//
// TODO: Make an option for the scrolling speed: fast->slow (smooth), slow->fast (snappy)
//
// TODO: Draw greetings on the landing page aka root
//
//


var preferences = {
    // Local storage uses utf-16 characters
    auto_scroll: 'true'
};

var scroll_state = {
    disabled: 0,
    enabled: 1,
    scrolling: 2,
};

var scroll_trigger = {
    none: 0,
    scroll: 1,
    click: 2,
};

// Objects are passed by "reference", thus the scroll object is able to change it's properties externally

export var scroll = {
    prevScrollY: document.documentElement.scrollTop,
    currentScrollY: 0,
    state: scroll_state.enabled,
    trigger: scroll_trigger.none,

    // This is a "reference" (shallow copy) of the body's HTMLCollection.
    
    node: Array.from(document.body.children),
    index: 0,
};

// Local storage should already be set by animate.js since that is loaded first, so we don't need to check for undefined or null.
preferences.auto_scroll = localStorage.getItem('auto scroll');

var t = 0;
var sum = 0;

// Hash table to an id and index lookup of the 'navigation' elements.
// These elements are found via the parent element provided by the user.
// Elements must be identical to the structure, and id name 
// of the containers to be able to scroll to.

// Might make individual object in this object for each element.
// Since the syntax gets cumbersome.

var navNodes = {
    id: {},
}

// We need a base height of 0 to be able to scroll from the root
// to the subsequent container

scroll.node.unshift({clientHeight: 0});
console.log(scroll.node);

// Check what the index is on page load, so that when you refresh at a certain position,
// the index corresponds to the container.

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

        // Bug: Scroll function sets current.ScrollY multiple times if scrolling happens too fast.
        // Could be because of recursion?
    
        if (scroll.currentScrollY > scroll.prevScrollY) {
            Scrolldown();
        }

        else if (scroll.currentScrollY < scroll.prevScrollY) {
            Scrollup();
        }
}

// Quadratic bezier curve
function Easein(p0,p1,p2) {
    var p = (((1-t)**2 * p0) + (2*(1-t)*t*p1) + (t**2*p2))
    document.documentElement.scroll(0, p);
    return p;
}

function Scrolldown(dis=1) {
    function Loop() {
        if (scroll.state == scroll_state.enabled) {
            scroll.state = scroll_state.scrolling;
            sum = scroll.node.y[scroll.index+dis];
            scroll.currentScrollY = window.scrollY;

            // Have as starting point the current scroll y, so that we can 
            // smoothly scroll to the destination
            scroll.prevScrollY = scroll.currentScrollY;
            console.log('click');
            console.log('Sum %c%s  ', 'color: green;', sum);
            console.log('current scroll y %c%s  ', 'color: blue;', scroll.currentScrollY);
        }

        console.log('index %s', scroll.index);
        console.log('Sum %c%s  ', 'color: blue;', sum);
        console.log('dis %c%s  ', 'color: red;', dis);


        // Having the control point closer to the destination makes scrolling ease out
        // and further ease in.
        // The default atm is ease out.
        
        if (scroll.currentScrollY >= sum) {
            // End of scrolling
            t = 0;
            scroll.prevScrollY = scroll.currentScrollY;
            scroll.state = scroll_state.enabled;
            scroll.trigger = scroll_trigger.none;
            scroll.index += dis;
            console.log('done scrolling');
            console.log('current scroll y %c%s  ', 'color: blue;', scroll.currentScrollY);
            console.log('prev scroll y %c%s  ', 'color: red;', scroll.prevScrollY);
            return;
        }

        scroll.currentScrollY = Easein(scroll.prevScrollY, sum - 100, sum);
        t+= 0.02;


        console.log('scroll.prevScrollY ' + scroll.prevScrollY);
        console.log('scroll.currentScrollY ' + scroll.currentScrollY);
        console.log('scrolled down');

        requestAnimationFrame(Loop);
    }

    requestAnimationFrame(Loop);
}


function Scrollup(dis=-1) {
    function Loop() {
        if (scroll.state == scroll_state.enabled) {
            scroll.state = scroll_state.scrolling;
            sum = scroll.node.y[scroll.index+dis];
            scroll.currentScrollY = window.scrollY;
            scroll.prevScrollY = scroll.currentScrollY;
            console.log('click');
            console.log('Sum %c%s  ', 'color: green;', sum);
            console.log('current scroll y %c%s  ', 'color: blue;', scroll.currentScrollY);
        }

        console.log('index %s', scroll.index);
        console.log('Sum %c%s  ', 'color: blue;', sum);


        if (scroll.currentScrollY <= sum) {
            // End of scrolling
            t = 0;
            scroll.prevScrollY = scroll.currentScrollY;
            scroll.state = scroll_state.enabled;
            scroll.trigger = scroll_trigger.none;
            scroll.index += dis;
            console.log('done scrolling');
            console.log('Sum %c%s  ', 'color: green;', sum);
            console.log('current scroll y %c%s  ', 'color: blue;', scroll.currentScrollY);
            return;

        }

        scroll.currentScrollY = Easein(scroll.prevScrollY, sum + 100, sum);
        t+= 0.02;


        console.log('scroll.prevScrollY ' + scroll.prevScrollY);
        console.log('scroll.currentScrollY ' + scroll.currentScrollY);
        console.log('scrolled up');

        requestAnimationFrame(Loop);
    }
    requestAnimationFrame(Loop);
}

function Sum(htmlCollection, stop) {
    var x = 0;
    for (var i = 0; i < stop; i++) {
        x += htmlCollection[i].clientHeight;
    }
    return x;
}


function CurrentNode() {
        var yOffset = 50;
        if (window.scrollY >= ((scroll.node.y[scroll.index+1]) - yOffset)) {

            // Reset the background color to it's 'non active' color
            document.getElementById((navNodes.id.array[scroll.index])).style.background = 'rgba(255, 0, 100, 0.5)';
            document.getElementById((navNodes.id.array[scroll.index+1])).style.background = 'rgba(255, 20, 0, 0.5)';
            console.log('changed color on scroll down');
            console.log('index %s', scroll.index);

            // Change index if page is scrolling without auto scroll
            if (preferences.auto_scroll == 'false') {scroll.index++;}
        }

        else if ((window.scrollY <= ((scroll.node.y[scroll.index]) - yOffset))) {

            document.getElementById((navNodes.id.array[scroll.index])).style.background = 'rgba(255, 0, 100, 0.5)';
            document.getElementById((navNodes.id.array[scroll.index-1])).style.background = 'rgba(255, 20, 0, 0.5)';
            console.log('changed color on scroll up');
            console.log('index %s', scroll.index);

            if (preferences.auto_scroll == 'false') {scroll.index--;}

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
    console.log('event target class %s', event.target.className);
    console.log('nav outside handler: %s', navNodes.id[event.target.id]);

    if (event.type == 'scroll' && event.target == document) {
        // Only start executing the function if page isn't scrolling already.
        
        if (scroll.state == scroll_state.enabled && preferences.auto_scroll == 'true') {
            scroll.trigger = scroll_trigger.scroll;
            requestAnimationFrame(ScrollToNextNode);
        }

        // The click block already handles the scroll index
        // and coloring.
        if (scroll.trigger != scroll_trigger.click) {
            CurrentNode();
        }
        console.log("current node %s", navNodes.id.array[scroll.index]);
    }

    else if (event.type == 'click') {
        console.log('found a click event!');

        // It might that the event handler doesn't get fired,
        // this might be because animate.js also handles the click event for these elements.
        // So nice...
        if (event.target.id == 'auto-inner' || event.target.id == 'auto-outer') {
            preferences.auto_scroll = localStorage.getItem('auto scroll');
            if (preferences.auto_scroll == 'true') {
                scroll.state = scroll_state.enabled;

                // Save the current window scroll y when activating auto scroll,
                // so that when you scroll it will be able to compare prevscrollY with currentScrollY
                scroll.prevScrollY = window.scrollY;
                console.log('turned on auto scroll')
            }
            else {
                scroll.state = scroll_state.disabled;
                console.log('turned off auto scroll')
            }

        }

        if (scroll.state != scroll_state.scrolling && event.target.id == navNodes.id[event.target.id]) {

            console.log('nav found in handler: %s', navNodes.id[event.target.id]);
            var displacement = 0;

            for (var i = 0; i < navNodes.id.array.length; i++) {
                if (event.target.id == navNodes.id.array[i]) {
                    scroll.prevScrollY = scroll.node.y[scroll.index];
                    displacement = i - scroll.index;
                }
            }

            console.log('displacement %s', displacement);
            if (displacement < 0) {
                // Set current node to a light color
                // and set destination node to dark color.
                document.getElementById((navNodes.id.array[scroll.index])).style.background = 'rgba(255, 0, 100, 0.5)';
                document.getElementById((navNodes.id.array[scroll.index+displacement])).style.background = 'rgba(255, 20, 0, 0.5)';
                scroll.trigger = scroll_trigger.click;

                // This is needed to execute the block that get evaluated once in the scrolling functions.
                // Note: this does not mean enabling auto scroll on scroll event.
                scroll.state = scroll_state.enabled;
                console.log('going to scroll up');

                Scrollup(displacement);
            }

            else if (displacement > 0) {
                document.getElementById((navNodes.id.array[scroll.index])).style.background = 'rgba(255, 0, 100, 0.5)';
                document.getElementById((navNodes.id.array[scroll.index+displacement])).style.background = 'rgba(255, 20, 0, 0.5)';
                scroll.trigger = scroll_trigger.click;
                scroll.state = scroll_state.enabled;
                console.log('going to scroll down');

                Scrolldown(displacement);
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
