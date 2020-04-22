const express = require('express')
const fetch = require('node-fetch')

const app = express()
const port = process.env.PORT || 3000

app.set('trust proxy', true)

const tracker = (req, _res, next) => {
  console.log("Request IP: ", req.ip)
  fetch(`http://ip-api.com/json/${req.ip}`)
    .then(r => r.json())
    .then(location => {
      console.log(JSON.stringify(location, null, 2))
      console.log(`ping: ${JSON.stringify(req.query)} -> ${location.city} - ${location.country}`)
      next()
    })
    .catch(() => {
      next()
    })
}

app.use(tracker)
app.use(express.static('./'))

app.get('/hello', (_req, res) => {
  const imgB64 = "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"

  res.writeHead(200, {
    'Content-Type': 'image/png',
    'Content-Length': imgB64.length
  });
  res.end(imgB64);
})

app.listen(port, () => console.log(`Listening at http://localhost:${port}`))

