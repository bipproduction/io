export default async function loadListChannel() {
    const channelId = window.localStorage.getItem("channel_id") ?? "default"
    const res = await fetch("/list-channel")
    const data = await res.json()

    // input as html element
    $("#list_channel").empty()
    data.channel.forEach((channel) => {
        $("#list_channel").append(`<li data-id="${channel.id}" class="list_channel" style="cursor:pointer; font-weight: ${channel.id === channelId ? "bold" : "normal"}">${channel.name}</li>`)
    })

    // click list channel
    $(".list_channel").click(function () {
        const id = $(this).data("id")
        window.localStorage.setItem("channel_id", id)
        location.reload()
    })

}