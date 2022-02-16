import {ConfirmEmailAnimation} from '../js/modules/animate.js';


function Message(message) {
    var email_confirm_text = document.querySelectorAll('.email-confirmation-text');

    if (message.data[0] != "0") {
        email_confirm_text[0].innerText = 'Your message has been send.';
        email_confirm_text[1].innerText = "Check your inbox or spam folder for a confirmation mail, if you've not receiven any then try again later or try an other email service";

        console.log('Sucessfully send email %o', message);
        ConfirmEmailAnimation();
    }
    else {
        email_confirm_text[0].innerText = message.data.slice(1);
        email_confirm_text[1].innerText = "";
        ConfirmEmailAnimation();
    }
}

function Connected(e) {
    console.log("connected: %s", e);
}

function EmailSubmit() {
    var name = document.getElementById('form-name').value;
    var email = document.getElementById('form-email').value;
    var subject = document.getElementById('form-subject').value;
    var message = document.getElementById('form-message').value;
    var email_confirm_text = document.querySelectorAll('.email-confirmation-text');
    var elapsed = Date.now() - startTime;

    console.log('name: %s\n email: %s\n subject: %s\n message: %s\n', name, email, subject, message);
    console.log('elapsed: %s', elapsed);
    console.log('start time: %s', startTime);

    // readyState 3 = closed
    if (ws.readyState != 3) {
        // Only allow subsequent emails after 30 seconds, to prevent email spamming.
        if (elapsed > 30000) {
            ws.send([name, email, subject, message]);
            startTime = Date.now();
        }
        else {
            var threshold = Math.ceil(((30000 - elapsed)/1000));
            email_confirm_text[0].innerText = "Blimey, slow down!";
            email_confirm_text[1].innerText = "Please wait " + threshold + " more seconds before sending your email.";
            ConfirmEmailAnimation();
        }
    }
    else {
        email_confirm_text[0].innerText = "Oops, mail server is down.";
        email_confirm_text[1].innerText = "Try again later or contact me manually via the email icon.";
        ConfirmEmailAnimation();
    }
}


// Local
const ws = new WebSocket('ws://127.0.0.1:9999');

// Server
// const wss = new WebSocket('wss://worldofmine.org:9999');

console.log(ws);
ws.onmessage = Message;
ws.onopen = Connected;
var startTime = 0;

document.getElementById('submit').addEventListener('click', EmailSubmit, false);
