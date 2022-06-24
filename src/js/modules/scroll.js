// 
// Bug: Resize event and click event get fired multiple times when you switch from tabs.
// although Chrome doesn't do this, the problem still persists with scrolling hitching.
// Firefox causes it to randomly scroll up or down and causes a small hitch.
// For now I don't know how to fix this since this is on the browser's implementation side.
//

var preferences = {
    // Local storage uses utf-16 encoding.
    auto_scroll: true
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


var scroll = {
    prevScrollY: document.documentElement.scrollTop,
    currentScrollY: 0,
    state: scroll_state.enabled,
    trigger: scroll_trigger.none,
    node: Array.from(document.querySelectorAll('.container100')),
    index: 0,
};

// Local storage should already be set by animate.js since that is loaded first, so we don't need to check for undefined or null.
if (localStorage.getItem('auto scroll') == 'false') {   // Default is 'true' and enabled.
    preferences.auto_scroll = false;
    scroll.state = scroll_state.disabled;
}


// Object has an id object and index array of the 'navigation' elements.
// These elements are found via the parent element provided by the user.
// Elements' structure must be identical to the DOM, and id names
// must equal the containers' class names.

var navNodes = {
    id: {},
}


console.log(scroll.node);

// Check what the index is on page load, so that when you refresh at a certain position,
// the index corresponds to the right container.

function SetCurrentIndex() {
    console.log('prevscrolly %s', scroll.prevScrollY);
    if (scroll.node.y != undefined) {
        for (var i = 0; i < scroll.node.y.length; i++) {
            console.log(scroll.node.y[i]);
            if (scroll.node.y[i] >= scroll.prevScrollY) {
                document.getElementById((navNodes.id.array[i])).style.background = 'rgba(255, 20, 0, 0.5)';
                console.log('index: %s', i)
                scroll.index = i;
                return;
            }
        }
    }
}


function ScrollToNextNode() {
    scroll.currentScrollY = document.documentElement.scrollTop;

    console.log('scroll object: %o', scroll);
    console.log('scroll.prevScrollY: ' + scroll.prevScrollY);
    console.log('currentScrollY: ' + scroll.currentScrollY);
    console.log('scroll: ' + scroll.index);
    console.log('node obj: %o', scroll.node);
    

        // Don't Auto Scroll down further if the index is at the last container.
        // This is because 1) there is nothing down to scrolll to 2) heights of div get inaccurate when the page is resized, due to possible overflow not being added to the height.
    
        if (scroll.currentScrollY > scroll.prevScrollY && scroll.index < scroll.node.y.length -1) {
            Scrolldown();
        }

        else if (scroll.currentScrollY < scroll.prevScrollY) {
            Scrollup();
        }
}

// Quadratic bezier curve
function EaseOut(t, p0, p1, p2) {
    var p = (((1-t)**2 * p0) + (2*(1-t)*t*p1) + (t**2*p2))
    document.documentElement.scroll(0, p);
    return p;
}

function Scrolldown(dis=1) {
    scroll.state = scroll_state.scrolling;
    scroll.prevScrollY = scroll.currentScrollY;
    var t = 0;
    var sum = scroll.node.y[scroll.index+dis];
    var prevTime = -1;
    var dt;
    // Conversion to milliseconds included: unit * ms = 1 * 0.001.
    var speed = 0.001;

    console.log('Sum %c%s  ', 'color: green;', sum);
    console.log('current scroll y %c%s  ', 'color: blue;', scroll.currentScrollY);

    function Loop(timestamp) {
        if (prevTime == -1) {prevTime = timestamp;}
        dt = timestamp - prevTime;


        console.log('prev index %s', scroll.index);
        console.log('Sum %c%s  ', 'color: blue;', sum);
        console.log('dis %c%s  ', 'color: red;', dis);
        
        if (scroll.currentScrollY >= sum) {
            // End of scrolling
            scroll.prevScrollY = scroll.currentScrollY;
            scroll.state = scroll_state.enabled;
            scroll.trigger = scroll_trigger.none;
            scroll.index += dis;
            console.log('done scrolling');
            console.log('current index %s', scroll.index);
            console.log('current scroll y %c%s  ', 'color: blue;', scroll.currentScrollY);
            console.log('prev scroll y %c%s  ', 'color: red;', scroll.prevScrollY);
            return;
        }

        t += speed * dt;
        // Offset of 2 to make sure currentScrollY will be higher or equal to sum.
        scroll.currentScrollY = EaseOut(t, scroll.prevScrollY, sum, sum + 2);

        console.log('scroll.prevScrollY ' + scroll.prevScrollY);
        console.log('scroll.currentScrollY ' + scroll.currentScrollY);
        console.log('scrolled down');
        console.log('current time: ' + timestamp);
        console.log('prev time: ' + prevTime);
        console.log('delta time: ' + dt);

        prevTime = timestamp;
        requestAnimationFrame(Loop);
    };
    requestAnimationFrame(Loop);
}


function Scrollup(dis=-1) {
    scroll.state = scroll_state.scrolling;
    scroll.prevScrollY = scroll.currentScrollY;
    var t = 0;

    // When scrolling without Auto Scroll, index will decrement by 1 when scrollY <= current container's height - y offset.
    // Scrolling up now causes the preceded container to be skipped, thus causing an infinite scroll if scroll.index= 1, because the first container (index 0) gets skipped, and scrollY goes to negative infinity.
    // Incrementing the index by 1 resolves this unexpected behaviour.
    if (scroll.prevScrollY > scroll.node.y[scroll.index]){scroll.index++;}
    var sum = scroll.node.y[scroll.index+dis];
    var prevTime = -1;
    var dt;
    // Conversion to milliseconds included: unit * ms = 1 * 0.001.
    var speed = 0.001;


    console.log('Sum %c%s  ', 'color: green;', sum);
    console.log('current scroll y %c%s  ', 'color: blue;', scroll.currentScrollY);

    function Loop(timestamp) {
        if (prevTime == -1) {prevTime = timestamp;}
        dt = timestamp - prevTime;


        console.log('prev index %s', scroll.index);
        console.log('Sum %c%s  ', 'color: blue;', sum);


        if (scroll.currentScrollY <= sum) {
            // End of scrolling
            scroll.prevScrollY = scroll.currentScrollY;
            scroll.state = scroll_state.enabled;
            scroll.trigger = scroll_trigger.none;
            scroll.index += dis;
            console.log('done scrolling');
            console.log('current index %s', scroll.index);
            console.log('Sum %c%s  ', 'color: green;', sum);
            console.log('current scroll y %c%s  ', 'color: blue;', scroll.currentScrollY);
            return;

        }

        t += speed * dt;
        scroll.currentScrollY = EaseOut(t, scroll.prevScrollY, sum, sum -2);


        console.log('scroll.prevScrollY ' + scroll.prevScrollY);
        console.log('scroll.currentScrollY ' + scroll.currentScrollY);
        console.log('scrolled up');

        prevTime = timestamp;
        requestAnimationFrame(Loop);
    };
    requestAnimationFrame(Loop);
}

function Sum(htmlCollection, start, stop) {
    var x = 0;
    for (var i = start; i < stop; i++) {
        x += htmlCollection[i].clientHeight;
    }
    return x;
}

function CurrentNode() {
        var yOffset = 60;
        if (window.scrollY >= ((scroll.node.y[scroll.index+1]) - yOffset)) {

            // Reset the background color to it's 'non active' color
            document.getElementById((navNodes.id.array[scroll.index])).style.background = 'rgba(255, 0, 100, 0.5)';
            document.getElementById((navNodes.id.array[scroll.index+1])).style.background = 'rgba(255, 20, 0, 0.5)';
            console.log('changed color on scroll down');
            console.log('index %s', scroll.index);

            // Change index if page is scrolling without auto scroll
            if (preferences.auto_scroll == false) {scroll.index++;}
        }

        else if ((window.scrollY <= ((scroll.node.y[scroll.index]) - yOffset))) {

            document.getElementById((navNodes.id.array[scroll.index])).style.background = 'rgba(255, 0, 100, 0.5)';
            document.getElementById((navNodes.id.array[scroll.index-1])).style.background = 'rgba(255, 20, 0, 0.5)';
            console.log('changed color on scroll up');
            console.log('index %s', scroll.index);

            if (preferences.auto_scroll == false) {scroll.index--;}

        }
}


function EventHandler(event) {
    console.log('event %o', event);
    console.log('event target %o', event.target);
    console.log('event target id %s', event.target.id);
    console.log('event target class %s', event.target.className);
    console.log('nav outside handler: %s', navNodes.id[event.target.id]);
    console.log('node full scroll height: %s', scroll.node.y[scroll.node.y.length -1]);

    if (event.type == 'resize') {
        console.log('resizing page');
        var containers = document.querySelectorAll('.container100');

        for (var i = 0; i < containers.length; i++) {
            scroll.node.y[i] = Sum(containers, 0, i);
        }

        console.log('resized scroll node y: %o', scroll.node.y);
    }

    else if (event.type == 'scroll' && event.target == document) {
        // Only start executing the function if page isn't scrolling already.
        if (scroll.state == scroll_state.enabled && preferences.auto_scroll == true) {
            scroll.trigger = scroll_trigger.scroll;
            ScrollToNextNode();
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
        // Sometimes the svg 'options-icons' will trigger, despite having pointer-events set to none.
        // However clicking the svg area that does not coincide with the buttons will not be triggered;
        // So we can check for clicks on the svg aswell.
        
        if (event.target.id == 'auto-inner' || event.target.id == 'auto-outer' || 
            event.target.id == 'options-icons') {

            // Getting the value requires some time, so we need the lambda function, proceeding when it returns.
            var done = (function() {
                if (localStorage.getItem('auto scroll') == 'true') {
                    preferences.auto_scroll = true;
                }
                else {
                    preferences.auto_scroll = false;
                }

                return true;
            })();
            if (done) {
                if (preferences.auto_scroll) {
                    scroll.state = scroll_state.enabled;

                    // Save the current window scroll y when activating auto scroll,
                    // so that when you scroll it will be able to compare prevscrollY with currentScrollY
                    scroll.prevScrollY = window.scrollY;
                    console.log('turned on auto scroll');
                }
                else {
                    scroll.state = scroll_state.disabled;
                    console.log('turned off auto scroll');
                }
            }
        }

        else if (scroll.state != scroll_state.scrolling && event.target.id in navNodes.id) {

            console.log('nav found in handler: %s', navNodes.id[event.target.id]);
            scroll.currentScrollY = document.documentElement.scrollTop;
            var displacement = 0;

            for (var i = 0; i < navNodes.id.array.length; i++) {
                if (event.target.id == navNodes.id.array[i]) {
                    displacement = i - scroll.index;
                    break;
                }
            }

            console.log('displacement %s', displacement);
            if (displacement < 0) {
                // Set current node to a light color
                // and set destination node to a dark color.
                document.getElementById((navNodes.id.array[scroll.index])).style.background = 'rgba(255, 0, 100, 0.5)';
                document.getElementById((navNodes.id.array[scroll.index+displacement])).style.background = 'rgba(255, 20, 0, 0.5)';
                scroll.trigger = scroll_trigger.click;

                // This is needed to execute the if statement block in the scrolling functions.
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

    // Temporarily disable Auto Scroll to prevent interfering scrolling when filling out the form.
    
    else if (event.type == 'focusin' && event.target.tagName != 'BUTTON') {
        console.log('form focus in');
        scroll.state = scroll_state.disabled;
        scroll.trigger = scroll_trigger.none;
    }

    else if (event.type == 'focusout' && event.target.tagName != 'BUTTON') {
        console.log('form focus out');
        if (preferences.auto_scroll) {scroll.state = scroll_state.enabled;}
    }
}


// Enable auto scrolling for the given page.
export function AutoScroll() {
    SetCurrentIndex();
    CurrentNode();
    window.addEventListener('scroll', EventHandler, false);
    window.addEventListener('resize', EventHandler, false);
}


// Add a click or focus event listener to the given element, handled by the EventHandler function.

// @param el: Element's event to be listened for, if null then for each container (container100 in this case),
// the distance from the top container to the current container will be assigned to scroll.node.y. 
// @param nav: Parent element that is able to be propegated in the bubbling phase, to handle events for its descendants.

export function Listen(el, nav=false) {
    if (el == null) {
        var node = [];
        var start = 0;
        console.log('scroll nodes %o', scroll.node);
        for (var j = 0; j < scroll.node.length; j++) {
            node.push(Sum(scroll.node, start, j));
        }

        scroll.node.y = node;

        console.log("%o", scroll.node.y);
    }

    else if (nav == true) {
        for (var i = 0; i < el.children.length; i++) {
            navNodes.id[(el.children[i].id)] = el.children[i].id;
        }

        navNodes.id.array = Object.keys(navNodes.id);
        el.addEventListener('click', EventHandler, false);
        console.log('Added event listener on %o', el);
        console.log('navNodes %o', navNodes);
    }

    else if (el.tagName == 'FORM') {
        console.log('Added focus event on form %o', el);
        el.addEventListener('focusin', EventHandler, false);
        el.addEventListener('focusout', EventHandler, false);
    }
    else {
        el.addEventListener('click', EventHandler, false);
        console.log('Added event listener on %o', el);
    }
}
