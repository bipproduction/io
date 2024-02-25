let wss;
let list_data = [];
let channelId = window.localStorage.getItem("channel_id") ?? "default";
export default async function connectWebSocket() {

    // get channel by id
    const res_channel = await fetch(`/get-channel/${channelId}`)
    const res_channel_data = await res_channel.json()
    if (!res_channel_data) {
        return {
            wss,
            list_data,
            channelId
        }
    }

    // get last message
    const res = await fetch(`/last-message/${channelId}`);
    const res_data = await res.json();
    list_data = res_data.message

    // show preview
    preview()

    const local = window.location.hostname === "localhost"
    const url = `${local ? "ws" : "wss"}://${window.location.host}/channel/${channelId}`
    wss = new WebSocket(url);
    wss.onopen = () => {
        console.log("wss connect")
    }

    wss.onmessage = (event) => {
        // if(res_data.message){
        //     list_data = JSON.parse(res_data.message.data)
        // }
        const data = JSON.parse(event.data);
        if (data.channelName) {
            const dataReceived = JSON.parse(event.data);
            if (dataReceived.category === "message") {
                list_data.unshift(dataReceived)
                preview()

                // console.log(JSON.stringify(dataReceived, null, 2))
            }

            if (dataReceived.info === "connected") {
                $("#info").text("Channel: " + dataReceived.channelName)
            }

            if (dataReceived.info === "error") {
                $("#info").text("Channel: " + dataReceived.content)
            }
        }
    };

    wss.onclose = () => {
        console.log("wss disconnect")

        // auto reconnect
        setTimeout(() => {
            console.log("auto reconnect websockwet")
            connectWebSocket()
        }, 1000)
    };

    return {
        wss,
        list_data,
        channelId
    }
}

function preview() {
    $("#content").empty()
    for (let ld of list_data) {
        $("#content").append(`<div>[${ld.createdAt}] ${ld.content}</div>`)

    }
    $("#json").text(JSON.stringify(list_data, null, 2))
}