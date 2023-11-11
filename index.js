
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
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const server = createServer(app);
let sock;
const io = new Server(server, {
    allowEIO3: true,
    cors: {
        origin: "*",
        credentials: true,
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    sock = socket
    socket.on('server', (data) => {
        console.log(data)
    })

    setTimeout(() => {
        socket.emit("client", "from_server")
    }, 1000);
});

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

app.post('/io', (req, res) => {
    const body = req.body
    if (sock) {

        // const d =  {
        //     "id": "",
        //     "path": "",
        //     "data": ""
        // }

        sock.emit(req.body.id, req.body)
    }
    // console.log(req.body)
    return res.status(200).json({
        ...req.body
    })
})



server.listen(PORT, () => {
    console.log(`server running at http://localhost:${config.server.port}`.green);
});