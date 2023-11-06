/**
 * Copyright reelyActive 2023
 * We believe in an open Internet of Things
 */


const DEFAULT_RADIO_DECODINGS_PERIOD_MILLISECONDS = 10000;
const DEFAULT_RSSI = -100;
const MIN_RSSI = -120;
const MAX_RSSI = -80;
const RSSI_RANDOM_DELTA = 5;
const TEST_ORIGIN = 'test';


/**
 * TestListener Class
 * Provides a consistent stream of artificially generated packets.
 */
class TestListener {

  /**
   * TestListener constructor
   * @param {Object} options The options as a JSON object.
   * @constructor
   */
  constructor(options) {
    options = options || {};

    this.decoder = options.decoder;
    this.radioDecodingPeriod = options.radioDecodingPeriod ||
                               DEFAULT_RADIO_DECODINGS_PERIOD_MILLISECONDS;
    this.rssi = [ DEFAULT_RSSI ];
    this.decodingOptions = options.decodingOptions || {};

    setInterval(emitRadioDecodings, this.radioDecodingPeriod, this);
  }

}


/**
 * Emit simulated radio decoding packets
 * @param {TestListener} instance The given instance.
 */
function emitRadioDecodings(instance) {
  let now = new Date();
  let simulatedStackData = {
    received_at: now.toISOString(),
    end_device_ids: {
      dev_eui: "70B3D57ED8001E9E",
      dev_addr: "50BADA55",
      join_eui: "00000000D0000000",
      device_id: "eui-70b3d57ed8001e9e",
      application_ids: { application_id: "simulator" }
    },
    uplink_message: {
      f_cnt: 173401,
      f_port: 2,
      settings: {
        time: now.toISOString(),
        data_rate: {
          lora: {
            bandwidth: 125000,
            coding_rate: "4/5",
            spreading_factor: 7
          }
        },
        frequency: "915000000",
        timestamp: Math.round(now.getTime() / 1000)
      },
      locations: {
        user: {
          source: "SOURCE_REGISTRY",
          altitude: 50,
          latitude: 45.50883,
          longitude: -73.57123
        }
      },
      frm_payload: "HQK6AsoA",
      network_ids: {
        ns_id: "0000000000000000",
        net_id: "000123",
        tenant_id: "reelyactive",
        cluster_id: "nam1",
        tenant_address: "reelyactive.nam1.cloud.thethings.industries",
        cluster_address: "nam1.cloud.thethings.industries"
      },
      received_at: now.toISOString(),
      rx_metadata: [{
        snr: 12.3,
        rssi: instance.rssi[0],
        time: now.toISOString(),
        location: {
          source: "SOURCE_REGISTRY",
          altitude: 50,
          latitude: 45.50883,
          longitude: -73.57123
        },
        timestamp: Math.round(now.getTime() / 1000),
        gateway_ids: {
          eui: "001BC50940840000",
          gateway_id: "test-gw"
        },
        received_at: now.toISOString(),
        channel_rssi: instance.rssi[0],
        uplink_token: ""
      }],
      session_key_id: "",
      decoded_payload: {
        temp: 21.0, humidity: 49.9, batt_volt: 3.3, button_press: 0
      },
      consumed_airtime: "0.051456s"
    },
    correlation_ids: [ "as:up:01HE84ZGX353THQ1YB57JTCMD2" ]
  };

  updateSimulatedRssi(instance);
  instance.decoder.handleData(simulatedStackData, TEST_ORIGIN, now.getTime(),
                              instance.decodingOptions);
}


/**
 * Update the simulated RSSI values
 * @param {TestListener} instance The given instance.
 */
function updateSimulatedRssi(instance) {
  for(let index = 0; index < instance.rssi.length; index++) {
    instance.rssi[index] += Math.floor((Math.random() * RSSI_RANDOM_DELTA) -
                                       (RSSI_RANDOM_DELTA / 2));
    if(instance.rssi[index] > MAX_RSSI) {
      instance.rssi[index] = MAX_RSSI;
    }
    else if(instance.rssi[index] < MIN_RSSI) {
      instance.rssi[index] = MIN_RSSI;
    }
  }
}


module.exports = TestListener;
