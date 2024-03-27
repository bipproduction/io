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
                const server = createServer(aedes)
                server.listen(argv.port, () => {
                    console.log(`MQTT server running on port ${argv.port}`)
                })
            }
        )
        .demandCommand(1)
        .recommendCommands()
        .parse(process.argv.slice(2))
}