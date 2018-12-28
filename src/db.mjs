import Hubdb from 'hubdb';

const token = process.env.GITHUB_TOKEN;
const db = Hubdb({
  token,
  username: 'kuldeepkeshwar',
  repo: 'home-automation-server',
  branch: 'db',
});
// eslint-disable-next-line no-underscore-dangle
const _devices = {};
function buildCache() {
  return new Promise((resolve, reject) => {
    db.list((err, result) => {
      if (err || !result) {
        console.log('error while building cache', err);
        reject(err || result);
      } else {
        result.forEach(({ path, data }) => {
          _devices[path] = { id: path, ...data };
        });
        console.log('cache done!!');
        resolve(_devices);
      }
    });
  });
}
const cache = buildCache();

function add(data) {
  return new Promise((resolve, reject) => {
    db.add(data, (err, res) => {
      if (err || !res) {
        reject(err || res);
      } else {
        console.log({ res });
        const device = { ...data, id: res.content.path };
        _devices[device.id] = device;
        resolve(device);
      }
    });
  });
}
function updateById(id, data) {
  return new Promise((resolve, reject) => {
    db.update(id, data, (err) => {
      if (err) {
        reject(err);
      } else {
        const device = { ...data, id };
        _devices[device.id] = device;
        resolve(device);
      }
    });
  });
}

async function getById(id) {
  const devices = await cache;
  return devices[id];
}
async function findAll() {
  const devices = await cache;
  return devices;
}

export default {
  add,
  findAll,
  updateById,
  getById,
};
