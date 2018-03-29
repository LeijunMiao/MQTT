var mqtt = require('mqtt');
var api = require('./api');
var client = mqtt.connect('mqtt://47.98.106.202', {
    username: 'loraappserver',
    password: 'kxw',
    clientId: 'app_1',
    port: 1883
});

client.on('connect', function () {
    console.log('connected mqtt');
    client.subscribe('application/1/#');
    // client.publish('app2dev/', 'Hello mqtt');  
});

var io = require("socket.io");
var express = require("express");
var app = express();
app.use(express.static(__dirname+ '/public'));

app.get('/', function (req, res) {
    res.render('index');;
});

app.get('/ws/data',api.getData)

// app.use(express.static('www'));
var server = app.listen(5438);
console.info('console server started on port ' + 5438);

var sio = io.listen(server);

sio.on('connection', function (socket) {
    client.on('message', function (topic, msg) {
        console.log('收到 ' + topic + ' 主題，訊息：' + msg.toString());
        var data = JSON.parse(msg);
        socket.emit('mqtt', data.appData);
    });
});
