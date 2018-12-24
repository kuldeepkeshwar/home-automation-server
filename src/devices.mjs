import db from './db.mjs';

const defaultConfiguration = {
  pins: [13, 12],
  status: [0, 0],
};

class DeviceError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}
async function fetchAll() {
  const devices = await db.findAll();
  return devices;
}

async function fetchOne(id) {
  const device = db.getById(id);

  if (device) {
    return device;
  }
  throw new DeviceError(`Device not found: ${id}`, 404);
}
async function findByIP(ip) {
  const devices = await fetchAll();
  const id = devices.filter(device => ip === device.ip)[0];
  return devices[id];
}
async function update(id) {
  const device = await fetchOne(id);
  if (device) {
    device.lastOnline = new Date();
    db.updateById(id, device).then(d => console.log('updated device ', { id, device: d }));
  } else {
    throw new DeviceError(`Device not found: ${id}`, 404);
  }
}
async function add(ip) {
  let device = await findByIP(ip);
  if (device) {
    await update(device.id);
  } else {
    device = await db.add({
      ip,
      lastOnline: new Date(),
      pins: defaultConfiguration.pins,
      status: defaultConfiguration.status,
    });
    return device;
  }
  return device;
}

async function set(id, options) {
  const device = await fetchOne(id);
  if (device) {
    device.lastOnline = new Date();
    device.pins = options.pins.map(Number);
    device.status = options.status.map(Number);
    const updatdDevice = await db.updateById(id, device);
    return updatdDevice;
  }
  throw new DeviceError(`Device not found: ${id}`, 404);
}
async function setPin(id, pin, status) {
  const device = await fetchOne(id);
  if (device) {
    device.lastOnline = new Date();
    device.pins.forEach((p, index) => {
      if (pin === p) {
        device.status[index] = status;
      }
    });
    const updatdDevice = await db.updateById(id, device);
    return updatdDevice;
  }
  throw new DeviceError(`Device not found: ${id}`, 404);
}
async function getPin(id, pin) {
  const device = await fetchOne(id);
  if (device) {
    await update(device.id);
    let status;
    device.pins.forEach((p, index) => {
      if (pin === p) {
        status = device.status[index];
      }
    });
    return status;
  }
  throw new DeviceError(`Device not found: ${id}`, 404);
}

export default {
  fetchAll,
  fetchOne,
  set,
  update,
  add,
  setPin,
  getPin,
};
