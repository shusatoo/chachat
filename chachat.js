var http = require('http');
var socketio = require('socket.io');
var fs = require('fs');

var server = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type':'text/html'});
    var output = fs.reqdFileSync("./chachat.html", "utf-8");
    res.end(output);
}).listen(process.env.VMC_APP_PORT || 3000);

var io = socketio.listen(server);

io.sockets.on('connection', function(socket) {

    // メッセージ送信
    socket.on('msg_to_server', function(data) {
        io.sockets.emit('msg_to_client', {value: data.value});
    });

    // ブロードキャスト
    socket.on('bcast_to_server', function(data) {
        socket.broadcast.emit('msg_to_client', {value: data.value});
    });

    // 切断
    socket.on('disconnect', function() {
        io.sockets.emit('msg_to_client', {value: 'user disconnected'});
    });
});



