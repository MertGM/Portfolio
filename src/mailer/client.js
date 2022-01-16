// Client that sends form input to python server.
// Python handles the input and sends it to a corresponding mail server

function Message(message) {
    console.log("received data: %s", message.data);
    console.log("received by: %s", message.source);
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
    ws.send([name, email, subject, message]);
});
