/**
 * Library for storing and editing data
 */

// Dependencies
import fs from 'fs'
import path from 'path'

import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

let lib = {}

lib.baseDir = path.join(__dirname, '/../.data/')

// Write data to a file
lib.create = (dir, file, data, callback) => {
  // open the file for writing
  fs.open(
    lib.baseDir + dir + '/' + file + '.json',
    'wx',
    (err, fileDescriptor) => {
      if (!err && fileDescriptor) {
        // convert data to string
        let stringData = JSON.stringify(data)

        // write to file and close it
        fs.writeFile(fileDescriptor, stringData, err => {
          if (!err) {
            fs.close(fileDescriptor, err => {
              if (!err) {
                callback(false)
              } else {
                callback('Error closing file')
              }
            })
          } else {
            callback('Error writing to new file')
          }
        })
      } else {
        callback('Could not create new file, it may already exist')
      }
    }
  )
}

lib.read = (dir, file, callback) => {
  fs.readFile(lib.baseDir + dir + '/' + file + '.json', 'utf8', (err, data) => {
    callback(err, data)
  })
}

lib.update = (dir, file, data, callback) => {
  fs.open(`${lib.baseDir}${dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      // Convert data to a string
      let stringData = JSON.stringify(data)

      // truncate the file
      fs.ftruncate(fileDescriptor, err => {
        if (!err) {
          // Write to the file and close it
          fs.writeFile(fileDescriptor, stringData, err => {
            if (!err) {
              fs.close(fileDescriptor, err => {
                if (!err) {
                  callback(false)
                } else {
                  callback('Error closing file')
                }
              })
            } else {
              callback('Error writing to file')
            }
          })
        } else {
          callback('Error truncating file')
        }
      })
    } else {
      callback('Could not open the file for updating, it may not exist yet')
    }
  })
}

// Delete a file
lib.delete = (dir, file, callback) => {
  // Unlink the file
  fs.unlink(`${lib.baseDir}${dir}/${file}.json`, err => {
    if (!err) {
      callback(false)
    } else {
      callback('Error deleting file')
    }
  })
}

export default lib
