import http from 'http'
import https from 'https'
import url from 'url'
import fs from 'fs'
import { StringDecoder } from 'string_decoder'
import { config } from './config.mjs'
import router from './lib/router.mjs'

// Instantiating the HTTP server
const httpServer = http.createServer((req, res) => {
  unifiedServer(req, res)
})

// Start the server and have it listen on port 3000
httpServer.listen(config.httpPort, () => {
  console.log(`The server is listening on port ${config.httpPort} now`)
})

// Instantiate the HTTPS server
let httpsServerOptions = {
  key: fs.readFileSync('./https/key.pem'),
  cert: fs.readFileSync('./https/cert.pem'),
  passphrase: 'evicoach'
}
const httpsServer = https.createServer(httpsServerOptions, (req, res) => {
  unifiedServer(req, res)
})

// Start the HTTPS server
httpsServer.listen(config.httpsPort, () => {
  console.log(`The server is listening on port ${config.httpsPort} now`)
})

// All the server login for both the http and https server
let unifiedServer = (req, res) => {
  // Get the url and parse it
  const parsedUrl = url.parse(req.url, true)

  // Get the path from the url
  const path = parsedUrl.pathname // the untrimmed path
  const trimmedPath = path.replace(/^\/+|\/+$/g, '')

  // get the query string as an object
  const queryStringObject = parsedUrl.query

  // get the request method
  const method = req.method.toLocaleLowerCase()

  // get the headers as an object
  const headers = req.headers

  // get the payload, if any
  const decoder = new StringDecoder('utf-8')
  // payloads comes to the http server as a stream
  let buffer = '' // append new data to it as they arrive from the stream
  req.on('data', undecodedData => {
    buffer += decoder.write(undecodedData) // decode the data and append it to the buffer
  })
  // the end event will always get called, but not always the data event.
  req.on('end', () => {
    buffer += decoder.end()

    // Now that the request has finished,
    // We want to continue doing what we were doing

    // Choose the handler this request should go to. If one is not found
    let chosenHandler =
      typeof router[trimmedPath] !== 'undefined'
        ? router[trimmedPath]
        : handlers.notFound

    // construct the data object to send to the handler
    let data = {
      trimmedPath,
      queryStringObject,
      method,
      headers,
      payload: buffer
    }
    
    // route the request to the handler specified in the router
    chosenHandler(data, (statusCode, payload) => {
      // use the status code called back by the handler, or default to 200
      statusCode = typeof statusCode == 'number' ? statusCode : 200
      // use the payload calledback by the handler, or default to an empty object
      payload = typeof payload == 'object' ? payload : {}

      // convert the payload to a string
      let payloadString = JSON.stringify(payload)

      // return the response
      //   res.writeHead(statusCode)
      res.setHeader('Content-Type', 'application/json')
      res.end(payloadString)
      console.log(`Returning this response `, statusCode, payloadString)
    })
  })
}
