const devices = {};
const defaultConfiguration = {
  pins: [13],
  status: [0]
};
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function add(ip) {
  let device = findByIP(ip);
  if (device) {
    update(id);
  } else {
    device = {
      id: getRandomInt(1, 1000),
      ip: ip,
      lastOnline: new Date(),
      pins: defaultConfiguration.pins,
      status: defaultConfiguration.status
    };
    devices[device.id] = device;
  }
  return device;
}
function update(id) {
  const device = devices[id];
  if (device) {
    device.lastOnline = new Date();
  } else {
    throw new Error("Device not found: " + id);
  }
}
function set(id, options) {
  const device = devices[id];
  if (device) {
    device.lastOnline = new Date();
    device.pins = options.pins;
    device.status = options.status;
    return device;
  } else {
    throw new Error("Device not found: " + id);
  }
}
function findByIP(ip) {
  return Object.keys(devices).filter(id => ip == devices[id])[0];
}
function fetchOne(id) {
  const device = devices[id];

  if (device) {
    return device;
  } else {
    throw new Error("Device not found: " + id);
  }
}
function fetchAll() {
  return devices;
}
module.exports = { fetchAll, fetchOne, set, update, add };
