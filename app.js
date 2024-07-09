const express = require('express');
const socket = require('socket.io');
const app = express();

app.use(express.static('public'));

/**
 * Starts the server and listens on port 3000.
 * Logs a message to the console once the server is running.
 */
const server = app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

const io = socket(server);

io.on('connection', (socket) => {
    // Receives data from the client
    socket.on('beginPath', (data) => {
        // Sends data to the client
        io.sockets.emit('beginPath', data);
    });

    socket.on('drawLine', (data) => {
        // Sends data to the client
        io.sockets.emit('drawLine', data);
    });

    socket.on('undoRedoCanvas', (data) => {
        // Sends data to the client
        io.sockets.emit('undoRedoCanvas', data);
    });

    socket.on('shapeMode', (data) => {
        // Sends data to the client
        io.sockets.emit('shapeMode', data);
    });

    socket.on('setting', (data) => {
        // Sends data to the client
        io.sockets.emit('setting', data);
    });

    // socket.on('penWidthEle', (data) => {
    //     // Sends data to the client
    //     io.sockets.emit('penWidthEle', data);
    // });

    socket.on('eraserWidthEle', (data) => {
        // Sends data to the client
        io.sockets.emit('eraserWidthEle', data);
    });

    socket.on('pencil', (data) => {
        // Sends data to the client
        io.sockets.emit('pencil', data);
    });

    socket.on('eraser', (data) => {
        // Sends data to the client
        io.sockets.emit('eraser', data);
    });
});
