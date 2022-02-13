import {ConfirmEmailAnimation} from '../js/modules/animate.js';


function ConfirmEmailToDefault(email_confirm_text, confirm_message) {
    setTimeout(function() {
        email_confirm_text[0].innerText = confirm_message[0];
        email_confirm_text[1].innerText = confirm_message[1];
    }, 6000);
}

function Message(message) {
    console.log("received data: %s", message.data);
    console.log("received by: %s", message.source);
    if (message.data[0] != "0") {
        console.log('Sucessfully send email %o', message);
        ConfirmEmailAnimation();
    }
    else {
        // Change text from successful (which is default) to an error message.
        var email_confirm_text = document.querySelectorAll('.email-confirmation-text');
        var confirm_message = [email_confirm_text[0].innerText];
        confirm_message.push(email_confirm_text[1].innerText);

        // Remove error code from string and clear second <p> default text.
        email_confirm_text[0].innerText = message.data.slice(1);
        email_confirm_text[1].innerText = "";
        ConfirmEmailAnimation();
        ConfirmEmailToDefault(email_confirm_text, confirm_message);
        console.log('Failed to send email, error: %o', message);
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
    console.log('name: %s\n email: %s\n subject: %s\n message: %s\n', name, email, subject, message);

    var email_confirm_text = document.querySelectorAll('.email-confirmation-text');
    var confirm_message = [email_confirm_text[0].innerText];
    confirm_message.push(email_confirm_text[1].innerText);

    // readyState 3 = closed
    var elapsed = Date.now() - startTime;
    console.log('elapsed: %s', elapsed);
    console.log('start time: %s', startTime);

    if (ws.readyState != 3) {
        // Prevent email spamming.
        // Bug: email confirmation still sends timeout message meanwhile the email did get delivered.
        if (elapsed > 30000) {
            ws.send([name, email, subject, message]);
            startTime = Date.now();
        }
        else {
            var threshold = Math.ceil(((30000 - elapsed)/1000));
            email_confirm_text[0].innerText = "Blimey, slow down!";
            email_confirm_text[1].innerText = "Please wait " + threshold + " more seconds before sending your email.";
            ConfirmEmailAnimation();
            ConfirmEmailToDefault(email_confirm_text, confirm_message);
        }
    }
    else {
        email_confirm_text[0].innerText = "Oops, mail server is down.";
        email_confirm_text[1].innerText = "Try again later or contact me manually via the email icon.";
        ConfirmEmailAnimation();
        ConfirmEmailToDefault(email_confirm_text, confirm_message);
        console.log('Mail server is down, failed to send email, error');
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
