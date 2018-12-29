import firebase from 'firebase-admin';

const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY;

firebase.initializeApp({
  credential: firebase.credential.cert({
    projectId: 'home-automation-35818',
    clientEmail,
    privateKey,
  }),
  databaseURL: 'https://home-automation-35818.firebaseio.com',
});
const database = firebase.database();

const devices = database.ref('devices');
function add(data) {
  return new Promise((resolve, reject) => {
    try {
      const id = devices.push().key;
      const device = { ...data, id };
      devices.child(`${id}`).set(device);
      resolve(device);
    } catch (err) {
      reject(err);
    }
  });
}
function updateById(id, data) {
  return new Promise((resolve, reject) => {
    try {
      const device = { ...data, id };
      devices.child(`${id}`).update(device);
      resolve(device);
    } catch (err) {
      reject(err);
    }
  });
}

async function getById(id) {
  const snapshot = await devices.child(`${id}`).once('value');
  return snapshot.val();
}
async function findAll() {
  const snapshot = await devices.once('value');
  return snapshot.val();
}
export default {
  add,
  findAll,
  updateById,
  getById,
};
