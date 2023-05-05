import axios from 'axios';
import { parseCookies } from 'nookies';

const cookies = parseCookies();

const Axios = axios.create({
  baseURL: 'http://192.168.18.100:3001',
  headers: {
    Authorization: 'Bearer ' + cookies?.token,
  },
});

export { Axios };