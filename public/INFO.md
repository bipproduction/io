# Ini Adalah Info

### POST /post/:evn?

evn = event name

EXAMPLE:  
POST http://localhost:3000/post/nama-event

BODY
```json
{
    "key":"value"
}
```

RESPONSE:
```json
{
    "success": true,
    "evn": "event name",
    "data": {}
}
```