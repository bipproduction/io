export default async function kirimPesan(wss, channelId) {
    const content = $("#input").val()
    // check empty aler no empty
    if (!content) return alert("no empty")
    const category = "message"

    const data_body = {
        content,
        channelId,
        category
    }

    wss.send(JSON.stringify(data_body))
    $("#input").val("")
}