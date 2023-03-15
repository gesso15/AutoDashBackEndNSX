import { DATA_MAP } from "../dataKeys.js";

// NOTE: (note for OpenInverter that uses LittleEndian(LE) functions)
const OPENINVERTER_CAN_MAP = {

   /**
    * 371 - 881 decimal
    * HV battery voltage as reported by the inverter
    */
   0x371: (data) => {
     
    return [
      { id: DATA_MAP.INV_HV_BATT_VOLTAGE, data: data.readInt32LE(0)},
    ];
  },

   /**
    * 373 - 883 decimal
    * Inverter error codes
    */
   0x373: (data) => {
     
    return [
      { id: DATA_MAP.INV_ERROR, data: data.readInt8(0)},
    ];
  },

   /**
    * 135 - 309 decimal
    * Inverter amp draw
    */
   0x135: (data) => {

    return [
      { id: DATA_MAP.INV_AMPS, data: data.readInt16LE(0)},
    ];
  },

   /**
    * 136 - 310 decimal
    * Inverter coolant temp
    * Motor coolant temp
    * Motor RPM
    */
  0x136: (data) => {
    return [
      { id: DATA_MAP.INV_CTS, data: data.readUInt8(6)},
      { id: DATA_MAP.MOTOR_CTS, data: data.readUInt8(7)},
      { id: DATA_MAP.RPM, data: data.readUInt16LE(2)},
    ];
  },

   /**
    * 137 - 311 decimal
    * Inverter amp draw
    */
   0x137: (data) => {

    return [
      { id: DATA_MAP.TPS, data: data.readInt8(0)},
    ];
  },

  
};

const openInverterDecoder = {
  /**
   * @param {{ ts: number; id: number; data: Uint8Array; ext: boolean; }} canMsg
   * @returns {[{id:Number, data:Number}] | []}
   */
  do: (canMsg) => {
    console.log(canMsg.id.toString(16));
    console.log(canMsg);
    // TODO: Replace racepak messages/ids/serial masking/etc with OI stuff.
    const decodedId = canMsg.id & 0xfffff800;
    const decodedId11bit = canMsg.id  // TODO: better 11 vs 29 bit handling.
    if (!!OPENINVERTER_CAN_MAP[decodedId]) {
      console.log("29 bit");
      return OPENINVERTER_CAN_MAP[decodedId](Buffer.from(canMsg.data.buffer));
    } else if (!!OPENINVERTER_CAN_MAP[decodedId11bit]) {
      console.log("11 bit");
      console.log(OPENINVERTER_CAN_MAP[decodedId11bit](Buffer.from(canMsg.data.buffer)));
      return OPENINVERTER_CAN_MAP[decodedId11bit](Buffer.from(canMsg.data.buffer));
    } else {
      console.log("id not found in map");
      return [];
    }
  },
};

export default openInverterDecoder;
