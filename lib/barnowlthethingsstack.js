/**
 * Copyright reelyActive 2023
 * We believe in an open Internet of Things
 */


const EventEmitter = require('events').EventEmitter;
const TheThingsStackDecoder = require('./thethingsstackdecoder.js');
const HttpListener = require('./httplistener.js');
const TestListener = require('./testlistener.js');


/**
 * BarnowlTheThingsStack Class
 * Converts The Things Stack data into standard raddec events.
 * @param {Object} options The options as a JSON object.
 */
class BarnowlTheThingsStack extends EventEmitter {

  /**
   * BarnowlTheThingsStack constructor
   * @param {Object} options The options as a JSON object.
   * @constructor
   */
  constructor(options) {
    super();
    options = options || {};
    options.barnowl = this;

    this.listeners = [];
    this.theThingsStackDecoder = new TheThingsStackDecoder({ barnowl: this });
  }

  /**
   * Add a listener to the given hardware interface.
   * @param {Class} ListenerClass The (uninstantiated) listener class.
   * @param {Object} options The options as a JSON object.
   */
  addListener(ListenerClass, options) {
    options = options || {};
    options.decoder = this.theThingsStackDecoder;

    let listener = new ListenerClass(options);
    this.listeners.push(listener);
  }

  /**
   * Handle and emit the given raddec.
   * @param {Raddec} raddec The given Raddec instance.
   */
  handleRaddec(raddec) {
    // TODO: observe options to normalise raddec
    this.emit("raddec", raddec);
  }

  /**
   * Handle and emit the given infrastructure message.
   * @param {Object} message The given infrastructure message.
   */
  handleInfrastructureMessage(message) {
    this.emit("infrastructureMessage", message);
  }
}


module.exports = BarnowlTheThingsStack;
module.exports.HttpListener = HttpListener;
module.exports.TestListener = TestListener;
