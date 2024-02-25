const { PrismaClient } = require('@prisma/client');
const express = require('express');
const expressWs = require('express-ws');
const path = require('path')
const WebSocket = require('ws');
const yargs = require('yargs')

const app = express();
expressWs(app);
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "./public")))

const prisma = new PrismaClient()

const channels = {};

// Middleware untuk menangani permintaan untuk membuat saluran baru
app.post('/channel/:channelName', async (req, res) => {
    const channelName = req.params.channelName;

    // check if channela already exist in database
    const channel = await prisma.channel.findUnique({
        where: {
            name: channelName
        }
    })

    if (channel) {
        return res.json({
            success: false,
            message: 'Channel already exists code: 1'
        });
    }

    await prisma.channel.create({
        data: {
            name: channelName
        }
    })

    if (!channels[channelName]) {
        channels[channelName] = { clients: [] };
    }

    return res.json({
        success: true,
        message: 'Created channel: ' + channelName
    });

});

// Middleware untuk menangani koneksi ke saluran yang ada
app.ws('/channel/:id', async function (ws, req) {

    const id = req.params.id;
    const channel = await prisma.channel.findUnique({
        where: {
            id
        }
    })

    if (!channel) {
        ws.send(JSON.stringify({
            channelName: null,
            content: 'Channel not found',
            category: 'info',
            info: 'error',
        }));
        return ws.close();
    }

    if (!channels[channel.id]) {
        channels[channel.id] = { clients: [] };
    }

    // Tambahkan klien ke saluran
    channels[channel.id].clients.push(ws);

    // Kirim pesan ke klien
    ws.send(JSON.stringify({
        channelId: channel.id,
        content: 'Connected to channel',
        category: 'info',
        info: 'connected',
    }));

    ws.on('close', function () {
        // Hapus klien dari daftar saat koneksi ditutup
        if (channels[channel.id]) {
            channels[channel.id].clients = channels[channel.id].clients.filter(client => client !== ws);
        }
    });

    ws.on('message', function (message) {
        // Teruskan pesan ke semua klien di saluran
        if (channels[channel.id]) {
            channels[channel.id].clients.forEach(async (client) => {
                if (client.readyState === WebSocket.OPEN) {

                    const data_message = JSON.parse(message)
                    const msg = await prisma.message.create({
                        data: {
                            channelId: channel.id,
                            channelName: channel.name,
                            content: data_message.content,
                            category: data_message.category
                        }
                    })

                    client.send(JSON.stringify(msg));

                }
            });
        }
    });
});

app.get('/get-channel/:id', async (req, res) => {
    const id = req.params.id
    const channel = await prisma.channel.findUnique({
        where: {
            id
        }
    })
    return res.json({ channel })
})

app.get('/list-channel', async (req, res) => {
    const channel = await prisma.channel.findMany({
        where: {
            isActive: true
        }
    })
    return res.json({ channel })
})

app.get("/last-message/:channelId", async (req, res) => {
    const channelId = req.params.channelId
    const message = await prisma.message.findMany({
        where: {
            channelId,
            channel: {
                isActive: true
            }
        },
        take: 10,
        orderBy: {
            createdAt: 'desc'
        }
    })

    return res.json({ message })
})

app.get('/count-message/:channelId', async (req, res) => {
    const channelId = req.params.channelId
    const count = await prisma.message.count({
        where: {
            channelId,
            channel: {
                isActive: true
            }
        }
    })
    return res.json({ count })
})

// Mulai server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server listening on port ${PORT}`);
// });


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
    .recommendCommands()
    .demandCommand(1)
    .parse(process.argv.splice(2))

async function funStart(argv) {

    app.listen(argv.p, () => {
        console.log(`Server listening on port ${argv.p}`);
    });
}