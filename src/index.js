require('dotenv').config();
require('express-async-errors');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { createServer } = require('http');
const { Server } = require('socket.io');
const app = express();
const port = process.env.PORT || 8080;

const database = require('./config/database');
const routes = require('./routes');
const { errorHandler } = require('./app/middlewares/errorHandler');
const { SocketServer } = require('./config/socket');

database.connect();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Socket.io
const http = createServer(app);
const io = new Server(http, {
    cors: {
        origin: `${process.env.CLIENT_URL}`,
        credentials: true,
    },
});

io.on('connection', (socket) => {
    SocketServer(socket);
});

// Routes init
routes(app);

app.use(errorHandler);

async function test() {
    console.log('\n\n\n-------------------------------------------');

    // console.log('\n\n\n-------------------------------------------');
}

test();

app.listen(port, console.log(`Listening on port ${port}`));

module.exports = { io };
