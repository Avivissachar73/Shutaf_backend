var config = null;

if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development';
process.env.NODE_ENV = process.env.NODE_ENV.trim();

const ENV = process.env.NODE_ENV;
if (ENV === 'development') config = require('./dev');
else if (ENV === 'staging') config = require('./stage');
else if (ENV === 'production') config = require('./prod');

config = {
  ...config,
  env: ENV,
  jwt: {
    secret: 'some_secret_string',
    options: {
      expiresIn: '5h',
      algorithm: 'HS256'
    }
  }
}

module.exports = config;