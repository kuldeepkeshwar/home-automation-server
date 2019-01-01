import express from 'express';

import devices from './devices.mjs';
import DeviceError from './device-error.mjs';

const ESP8266HTTPClient = 'ESP8266HTTPClient';
const router = express.Router();

router.post('/devices', async (req, res, next) => {
  console.log({ url: req.originalUrl, method: req.method });
  try {
    const { ip, name } = req.body;
    if (!ip) {
      throw new Error('device ip is required');
    }
    const device = await devices.add(name, ip);
    res.json({ success: 1, data: device });
  } catch (err) {
    next(err);
  }
});
router.get('/devices/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await devices.update(id);
    const device = await devices.fetchOne(id);
    if (req.headers['user-agent'] === ESP8266HTTPClient) {
      const { pins, status } = device;
      res.json({ success: 1, data: { pins, status } });
    } else {
      res.json({ success: 1, data: device });
    }
  } catch (err) {
    next(err);
  }
});
router.post('/devices/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const device = await devices.set(id, payload);
    res.json({ success: 1, data: device });
  } catch (err) {
    next(err);
  }
});
router.get('/devices', async (req, res, next) => {
  try {
    const data = await devices.fetchAll();
    res.json({ success: 1, data });
  } catch (err) {
    next(err);
  }
});
router.get('/devices/:id/heartbeat', async (req, res, next) => {
  try {
    const { id } = req.params;
    await devices.update(id);
    const device = await devices.fetchOne(id);
    const { syncd, reset } = device;
    res.json({ success: 1, data: { syncd, reset } });
  } catch (err) {
    next(err);
  }
});
router.post('/devices/:id/meta', async (req, res, next) => {
  try {
    const { id } = req.params;
    let { syncd, reset } = req.body;
    syncd = Number(syncd);
    reset = Number(reset);
    syncd = !!syncd;
    reset = !!reset;
    const device = await devices.update(id);
    await devices.set(id, { ...device, ...{ syncd, reset } });
    res.json({ success: 1 });
  } catch (err) {
    next(err);
  }
});
router.post('/devices/:deviceId/pins/:id', async (req, res, next) => {
  try {
    const id = req.params.id - 0;
    const { deviceId } = req.params;
    const { status } = req.body;
    const device = await devices.setPin(deviceId, id, status - 0);
    res.json({ success: 1, data: device });
  } catch (err) {
    next(err);
  }
});

router.get('/devices/:deviceId/pins/:id', async (req, res, next) => {
  try {
    const id = req.params.id - 0;
    const { deviceId } = req.params;
    const status = await devices.getPin(deviceId, id);
    res.json({ success: 1, data: { status } });
  } catch (err) {
    next(err);
  }
});
router.post('/smart-home/:room/device/on', async (req, res, next) => {
  try {
    const { room } = req.params;
    let { device } = req.body;
    device = device.trim().toLowerCase();

    console.log({ room, device });
    const board = await devices.findByName(room);
    const { pins, buttons } = board;
    const index = buttons.findIndex(btn => device.includes(btn));
    if (index > -1) {
      await devices.setPin(board.id, pins[index], 1);
      console.log({ button: buttons[index] });
    } else {
      throw new DeviceError(`device not found: ${device}`, 404);
    }
  } catch (err) {
    next(err);
  }
});
router.post('/smart-home/:room/device/off', async (req, res, next) => {
  try {
    const { room } = req.params;
    let { device } = req.body;
    device = device.trim().toLowerCase();

    console.log({ room, device });
    const board = await devices.findByName(room);
    const { pins, buttons } = board;
    const index = buttons.findIndex(btn => device.includes(btn));
    if (index > -1) {
      await devices.setPin(board.id, pins[index], 0);
      console.log({ button: buttons[index] });
    } else {
      throw new DeviceError(`device not found: ${device}`, 404);
    }
  } catch (err) {
    next(err);
  }
});
export default router;
