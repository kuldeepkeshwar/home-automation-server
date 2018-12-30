import axios from 'axios';

export async function fetchBoards() {
  const response = await axios.get('/api/devices');

  return response.data.data;
}
export async function setPin(id, pin, status) {
  const response = await axios.post(`/api/devices/${id}/pins/${pin}`, {
    status,
  });
  return response.data.data;
}
