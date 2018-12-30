export default class DeviceError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}
