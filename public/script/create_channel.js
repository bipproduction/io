export default async function createChannel() {
    const channel = $("#channel").val()
    if (!channel) return alert("no empty")
    const res = await fetch(`/channel/${channel}`, {
        method: "POST"
    })

    const data = await res.json()
    alert(data.message)

    // clear input
    $("#channel").val("")
}