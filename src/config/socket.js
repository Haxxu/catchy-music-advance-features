function SocketServer(socket) {
    console.log(socket.id + ' connected.');

    socket.on('joinRoom', (id) => {
        socket.join(id);
        // console.log('join room: ', id);
        // console.log({ joinRoom: socket.adapter.rooms });
    });

    socket.on('outRoom', (id) => {
        socket.leave(id);
        // console.log({ outRoom: socket.adapter.rooms });
    });

    socket.on('disconnect', () => {
        console.log(socket.id + ' disconnected.');
    });
}

module.exports = { SocketServer };
