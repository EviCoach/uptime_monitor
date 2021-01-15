/**
 * Request handlers
 */

// Define the handlers
let handlers = {}

// Users
handlers.users = (data, callback) => {
  // list acceptable methods
  let acceptableMethods = ['post', 'get', 'put', 'delete']

  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._users[data.method](data, callback)
  } else callback(405)
}

// Container for the user's submethods
handlers._users = {}

// Users - post
handlers._users.post = (data, callback) => {}

// Users - get
handlers._users.get = (data, callback) => {}

// Users - delete
handlers._users.delete = (data, callback) => {}

// Users - put 
handlers._users.put = (data, callback) => {}

// not found handler
handlers.notFound = (data, callback) => callback(404)

// Ping handler
handlers.ping = (data, callback) => {
  callback(200)
}

export default handlers
