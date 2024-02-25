export default async function getLastMessage(channel) {
    const res = await fetch(`/last-message/${channel}`)
    const data = await res.json()
    return data
}