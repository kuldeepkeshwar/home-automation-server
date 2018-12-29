import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import devices from './devices.mjs';
import DeviceError from './device-error.mjs';

const app = express();
const port = process.env.PORT || 9090;

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log({ url: req.originalUrl, method: req.method });
  next();
});
app.get('/ping', (req, res) => {
  res.send('pong');
});
app.post('/api/devices', async (req, res, next) => {
  try {
    const { ip } = req.body;
    if (!ip) {
      throw new Error('device ip is required');
    }
    const device = await devices.add(ip);
    res.json({ success: 1, data: device });
  } catch (err) {
    next(err);
  }
});
app.get('/api/devices/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await devices.update(id);
    const device = await devices.fetchOne(id);
    res.json({ success: 1, data: device });
  } catch (err) {
    next(err);
  }
});
app.post('/api/devices/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const device = await devices.set(id, payload);
    res.json({ success: 1, data: device });
  } catch (err) {
    next(err);
  }
});

app.get('/api/devices', async (req, res, next) => {
  try {
    const data = await devices.fetchAll();
    res.json({ success: 1, data });
  } catch (err) {
    next(err);
  }
});

app.post('/api/devices/:deviceId/pins/:id', async (req, res, next) => {
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

app.get('/api/devices/:deviceId/pins/:id', async (req, res, next) => {
  try {
    const id = req.params.id - 0;
    const { deviceId } = req.params;
    const status = await devices.getPin(deviceId, id);
    res.json({ success: 1, data: { status } });
  } catch (err) {
    next(err);
  }
});
app.post('/api/smart-home/:room/device/on', async (req, res, next) => {
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
app.post('/api/smart-home/:room/device/off', async (req, res, next) => {
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
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  console.log(err);
  res.status(500).json({
    success: 0,
    code: err.code,
    message: err.message || 'Something broke!',
  });
});
app.listen(port, (...args) => console.log(`Example app listening on port ${port}!`, ...args));
