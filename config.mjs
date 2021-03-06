/**
 * Create and export configuration variables
 */

// Contaier for all the environments
let environments = {}

// Staging (default) environment
environments.staging = {
  httpPort: 3000,
  httpsPort: 3001,
  envName: 'staging'
}

// Production environments
environments.production = {
  httpPort: 5000,
  httpsPort: 5001,
  envName: 'production'
}

// Determine which environment was passed as a command-line argument
let currentEnvironment =
  typeof process.env.NODE_ENV == 'string'
    ? process.env.NODE_ENV.toLocaleLowerCase()
    : ''

// check that the current environment is one of the environments above, if not, default to staging
let environmentToExport =
  typeof environments[currentEnvironment] == 'object'
    ? environments[currentEnvironment]
    : environments.staging

// Export the module
export let config = environmentToExport
