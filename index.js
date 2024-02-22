const yargs = require('yargs')
const express = require('express')
const http = require('https')
const Websocket = require('ws')
const path = require('path')
require('colors')

const app = express()
const server = http.createServer(app)
const wss = new Websocket.Server({ server })

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "./public")))

yargs
    .command(
        "start",
        "start",
        yargs => yargs.options({
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


wss.on('connection', (ws) => {

    ws.on('message', function incoming(message) {
        const data = JSON.parse(message)
        wss.clients.forEach((client) => {
            if ( client.readyState === Websocket.OPEN) {
                client.send(JSON.stringify(data))
            }
        })
    })

})


async function funStart(argv) {
    server.listen(argv.p, () => {
        console.log(`server running at http://localhost:${argv.p}`.green);
    })
}