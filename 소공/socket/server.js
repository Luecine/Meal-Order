// app.js의 본문내에 삽입하시면 된다.
var io = require('socket.io').listen(3100);

io.on('connection', function (socket) {
    console.log('connect');
    var instanceId = socket.id;
    socket.on('msg', function (data) {

 

        console.log(data);
        socket.emit('recMsg', {comment: instanceId + ":" + data.comment+'\n'});
    })
});