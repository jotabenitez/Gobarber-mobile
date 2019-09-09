import axios from 'axios';

const api = axios.create({
  baseURL: 'http://10.42.0.79:3333',
});

export default api;
