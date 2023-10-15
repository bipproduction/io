
const config = require('./conf.json')
const PORT = config.server.port
const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const cors = require('cors');
require('colors')

const app = express();
app.use(cors())
app.use(express.static('public'))
const server = createServer(app);
const io = new Server(server, {
    allowEIO3: true,
    cors: {
        origin: "*",
        credentials: true,
        methods: ["GET", "POST"]
    }
});

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    socket.on('server', (data) => {
        console.log(data)
    })
    setTimeout(() => {
        socket.emit("client", "from_server")
    }, 1000);
});


server.listen(PORT, () => {
    console.log(`server running at http://localhost:${config.server.port}`.green);
});