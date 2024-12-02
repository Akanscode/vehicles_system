const { getDataConnect, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default',
  service: 'vehicle_scheduling',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

