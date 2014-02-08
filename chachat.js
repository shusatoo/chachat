var http = require('http');
var socketio = require('socket.io');
var fs = require('fs');

var server = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type':'text/html'});
    var output = fs.readFileSync("./index.html", "utf-8");
    res.end(output);
}).listen(process.env.VMC_APP_PORT || 3000);

// サーバーとソケットの紐付け
var io = socketio.listen(server);

// クライアントからのアクション
io.sockets.on('connection', function(socket) {

    // メッセージ送信（カスタムイベントの呼び出し）
    socket.on('msg_to_server', function(data) {
        // 自分を含めて全員に送信
        io.sockets.emit('msg_to_client', {value: data.value});
    });

    // ブロードキャスト（カスタムイベントの呼び出し）
    socket.on('bcast_to_server', function(data) {
        // 自分以外の全員に送信
        socket.broadcast.emit('msg_to_client', {value: data.value});
    });

    // 切断
    socket.on('disconnect', function() {
        io.sockets.emit('msg_to_client', {value: 'user disconnected'});
    });
});



