/**
 * Copyright reelyActive 2023
 * We believe in an open Internet of Things
 */


const Raddec = require('raddec');


/**
 * TheThingsStackDecoder Class
 * Decodes data from The Things Stack and forwards the packets to the given
 * BarnowlTheThingsStack instance.
 */
class TheThingsStackDecoder {

  /**
   * TheThingsStackDecoder constructor
   * @param {Object} options The options as a JSON object.
   * @constructor
   */
  constructor(options) {
    options = options || {};

    this.barnowl = options.barnowl;
  }

  /**
   * Handle data from a given stack, specified by the origin
   * @param {Object} data The data as JSON.
   * @param {String} origin The unique origin identifier of the stack.
   * @param {Number} time The time of the data capture.
   * @param {Object} decodingOptions The packet decoding options.
   */
  handleData(data, origin, time, decodingOptions) {
    let self = this;
    let raddec = processWebhookData(data, origin, time, decodingOptions);

    if(raddec) {
      self.barnowl.handleRaddec(raddec);
    }
  }
}


/**
 * Process Webhook data
 * @param {Object} data The data as JSON.
 * @param {String} origin The unique origin identifier of the stack.
 * @param {Number} time The time of the data capture.
 * @param {Object} decodingOptions The packet decoding options.
 */
function processWebhookData(data, origin, time, decodingOptions) {
  let isValidWebhookData = (data && data.hasOwnProperty('received_at') &&
                            data.hasOwnProperty('end_device_ids') &&
                            data.hasOwnProperty('uplink_message') &&
                            Array.isArray(data.uplink_message.rx_metadata));

  if(!isValidWebhookData) {
    return null;
  }

  let raddec = new Raddec({
      transmitterId: data.end_device_ids.dev_eui,
      transmitterIdType: Raddec.identifiers.TYPE_EUI64,
      timestamp: new Date(data.received_at).getTime()
  });

  data.uplink_message.rx_metadata.forEach((decoding) => {
    raddec.addDecoding({
        receiverId: decoding.gateway_ids.eui.toLowerCase(),
        receiverIdType: Raddec.identifiers.TYPE_EUI64,
        rssi: decoding.rssi
    });
  });

  if(typeof data.uplink_message.frm_payload === 'string') {
    let payload = Buffer.from(data.uplink_message.frm_payload, 'base64');

    raddec.addPacket(payload.toString('hex'));
  }

  return raddec;
}


module.exports = TheThingsStackDecoder;
