// Client that sends form input to python server.
// Python handles the input and sends it to a corresponding mail server

function Message(message) {
    console.log("received data: %s", message.data);
    console.log("received by: %s", message.source);
}

function Connected(e) {
    console.log("connected: %s", e);
}

function Send() {
    var data = document.getElementById('data').value;
    console.log('send data');
    ws.send(data);
}

const ws = new WebSocket('ws://localhost:9999');
console.log(ws);
console.log('connected?');
ws.onmessage = Message;
ws.onopen = Connected;

const btn = document.querySelector('button');
btn.addEventListener('click', Send, false);





