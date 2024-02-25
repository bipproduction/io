# DOCUMENT

## Documentation Socket Server

### CONNECT

`wss://host/channel/:channelName`

### RESPONSE

```json
{
  "id": string,
  "content": string text,
  "channelId": string,
  "channelName": string,
  "category": string,
  "isActive": bool,
  "createdAt": date,
  "updatedAt": date"
}
```

### POST 

```
// string
const data_body = {
        content,
        channelId,
        category
    }
```