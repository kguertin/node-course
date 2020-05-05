const http = require('http');

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === '/') {
    res.setHeader('Content-Type', 'text/html')
    res.write('<html>')
    res.write('<body>')
    res.write('<h1>Toronto Raptors NBA Champions</h1>')
    res.write('<form action="/create-user" method="POST"><input type="text" name="username"><button type="submit">submit</button></form>')
    res.write('</body>')
    res.write('</html>')
    return res.end()
  } else if (url === '/users') {
    res.setHeader('Content-Type', 'text/html')
    res.write('<html>')
    res.write('<body><ul><li>Marc Gasol</li><li>Kyle Lowry</li></ul></body>')
    res.write('</html>')
    return res.end()
  }

  if (url === '/create-user' && method === 'POST') {
    const body = [];
    req.on('data', (chunk) => {
      body.push(chunk);
    })
    return req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split('=')[1]
      console.log(message)
      res.writeHead(302, { 'Location': '/' })
      res.end()
    })
  }
});

server.listen(3000)