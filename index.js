'use strict';

const SerialPort = require('serialport'),
  nconf = require('nconf'),
  winston = require('winston'),
  logger = new (winston.Logger)({
    level: 'silly',
    transports: [
      new winston.transports.Console({
        timestamp: true
      })
    ]
  });

nconf.env();

let deviceName = nconf.get('DEVICE') || '/tmp/V2';
let baudrate = parseInt(nconf.get('BAUDRATE') || 9600);
let port = new SerialPort(deviceName, {baudrate});

let count = 0;

port.on('open', () => logger.debug('Reader: port is opened'));
port.on('close', () => logger.debug('Port is closed'));
port.on('error', (err) => logger.error(err));
port.on('data', (data) => {
  let border = (Math.floor(count / 10000) + 1) * 10000;
  count += (data.toString().match(/\r/g) || []).length;
  if (count >= border) {
    logger.debug(`Got ${count} elements from port`);
  }
});
