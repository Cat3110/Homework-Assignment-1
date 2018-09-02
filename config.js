/*
 * Config for variiables
 *
 */

// Dependencies
var fs = require('fs');

 // Container for all environments
var env = {}

// HTTPS cert
httpsServerOptions = {
  'key' : fs.readFileSync('./https/key.pem'),
  'cert' : fs.readFileSync('./https/cert.pem')
};

// Staging (default) environment
env.stage = {
  'httpPort' : 3000,
  'httpsPort' : 3001,
  'envName' : 'stage',
  'httpsServerOptions' : httpsServerOptions
};

// Production environment
env.prod = {
  'httpPort' : 5000,
  'httpsPort' : 5001,
  'envName' : 'prod',
  'httpsServerOptions' : httpsServerOptions
};

// Determine, which env we're using throw comman line
var curEnv = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check, that the current env is one of we use, if not - use default
var envToExport = typeof(env[curEnv]) == 'object' ? env[curEnv] : env.stage;

// Export the module
module.exports = envToExport;
