const express = require('express');
const { createServer } = require('node:http');
const { Server, Socket } = require('socket.io');
const cors = require('cors');
require('colors')
const yargs = require('yargs')
const path = require('path')
const _ = require('lodash')

const app = express();
// app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "./public")))

const server = createServer(app);

/**
 * @type {Socket}
 */
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
        socket.emit("client", {
            success: true,
            evn: "client",
            message: "from server"
        })
    }, 100);

});


app.get('/test', (req, res) => {
    res.setHeader("Content-Type", "text/html")
    res.sendFile(path.join(__dirname, "./public/test.html"))
})

app.post('/post/:evn?', (req, res) => {
    const evn = req.params.evn
    if (!evn) return res.json({
        success: false,
        message: "evn require"
    })

    if (sock) {
        sock.emit(evn, {
            success: true,
            evn,
            data: req.body
        })
    }

    return res.json({
        success: true,
        evn,
        data: req.body
    })
})

yargs
    .command(
        "start",
        "start",
        yargs => yargs
            .options({
                "port": {
                    alias: "p",
                    default: 3000
                }
            }),
        funStart
    )
    .demandCommand(1)
    .recommendCommands()
    .parse(process.argv.splice(2))


async function funStart(argv) {
    server.listen(argv.p, () => {
        console.log(`server running at http://localhost:${argv.p}`.green);
    });
}

