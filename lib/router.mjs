import handlers from './handlers.mjs'

// Define a request router
let router = {
  ping: handlers.ping
}

export default router
