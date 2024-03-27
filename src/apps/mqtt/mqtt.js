const aedes = require('aedes')()
const { createServer } = require('aedes-server-factory')
const yargs = require('yargs')

module.exports = async function mqtt() {
    yargs
        .command(
            "start",
            "start",
            yargs => yargs
                .options({
                    port: {
                        type: "number",
                        default: 3003
                    }
                }),
            async argv => {
                const server = createServer(aedes, {ws: true})

                // Tambahkan header untuk mengizinkan CORS
                server.on('request', (req, res) => {
                    res.setHeader('Access-Control-Allow-Origin', '*')
                    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
                    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

                    if (req.method === 'OPTIONS') {
                        res.writeHead(200)
                        res.end()
                        return
                    }

                    aedes.handle(req, res)
                })

                server.listen(argv.port, () => {
                    console.log(`MQTT server running on port ${argv.port}`)
                })
            }
        )
        .demandCommand(1)
        .recommendCommands()
        .parse(process.argv.slice(2))
}
