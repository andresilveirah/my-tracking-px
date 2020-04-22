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
  next()
}

app.use(tracker)
app.use(express.static('./'))

app.get('/hello.png', (_req, res) => {
  const img = Buffer.from("R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=", 'base64');

  res.writeHead(200, {
    'Content-Type': 'image/png',
    'Content-Length': img.length
  });
  res.end(img);
})

app.listen(port, () => console.log(`Listening at http://localhost:${port}`))

