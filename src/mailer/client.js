import {ConfirmEmailAnimation} from '../js/modules/animate.js';

function Message(message) {
    console.log("received data: %s", message.data);
    console.log("received by: %s", message.source);
    if (message.data[0] != "0") {
        console.log('Sucessfully send email %o', message);
        ConfirmEmailAnimation();
    }
    else {
        // Change text from successful (which is default) to an error message.
        var email_confirm = document.querySelectorAll('.email-confirmation-text');
        var confirm_message1 = email_confirm[0].innerText;
        var confirm_message2 = email_confirm[1].innerText;

        // Remove error code from string and clear second <p> default text.
        email_confirm[0].innerText = message.data.slice(1);
        email_confirm[1].innerText = "";
        ConfirmEmailAnimation();
        setTimeout(function() {
            email_confirm[0].innerText = confirm_message1;
            email_confirm[1].innerText = confirm_message2;
        }, 6000);
        console.log('Failed to send email, error: %o', message);
    }
}

function Connected(e) {
    console.log("connected: %s", e);
}


const ws = new WebSocket('ws://localhost:9999');
console.log(ws);
ws.onmessage = Message;
ws.onopen = Connected;

document.getElementById('submit').addEventListener('click', function() {
    var name = document.getElementById('form-name').value;
    var email = document.getElementById('form-email').value;
    var subject = document.getElementById('form-subject').value;
    var message = document.getElementById('form-message').value;
    console.log('name: %s\n email: %s\n subject: %s\n message: %s\n', name, email, subject, message);
    // Todo: Allow sending email to happen only after like 5 seconds after a previously sent email.
    ws.send([name, email, subject, message]);
});
