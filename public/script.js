import loadListChannel from "./script/load_list_channel.js";
import connectWebSocket from "./script/connect_websocket.js";
import kirimPesan from "./script/kirim_pesan.js";
import createChannel from "./script/create_channel.js";


; (async () => {
    loadListChannel()
    const { wss, list_data, channelId } = await connectWebSocket()

    if (!channelId) return alert("channel not found")

    $("#btn").click(() => kirimPesan(wss, channelId))

    $("#input").keypress((event) => {
        if (event.which === 13) {
            kirimPesan(wss, channelId)
        }
    })

    $("#create_channel").click(async () => {
        await createChannel()
        await loadListChannel()
    })

    const messageCount = await fetch(`/count-message/${channelId}`)
    const { count } = await messageCount.json()
    $("#message_count").text(`Total Message: ${count}`)
})()




// detect enter


// function kirim() {
//     const data = $("#input").val()
//     // check empty aler no empty
//     if (!data) return alert("no empty")
//     wss.send(JSON.stringify({ data, channel }))
//     $("#input").val("")

// }

// create channel POST /channel/:channelName



// function loadListChannel GET /list-channel


