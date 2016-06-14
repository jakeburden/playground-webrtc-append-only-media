const http = require('http')
const fs = require('fs')

http.createServer((req, res) => {
  if (req.url === '/') send('browser/index.html', res)
  else if (req.url === '/bundle.js') send('browser/dist/bundle.js', res)
  else {
    res.writeHead(404, {'Content-Type': 'text/plain'})
    res.end('404: file not found :sad-face:')
  }
}).listen(9090, () => {
  console.log('server is running on http://localhost:9090')
})

function send (file, res) {
  fs.createReadStream(file).pipe(res)
}
