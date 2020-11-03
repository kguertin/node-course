require('dotenv').config;
const NodeGeocoder = require('node-geocoder');

const options = {
  provider: 'mapquest',
  httpAdapter: 'https',
  apiKey: 'GxbEhWPBi5I43s0kWbbVHlXBw9KBq2mN',
  formatter: null,
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;
