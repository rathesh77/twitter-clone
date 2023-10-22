import { axiosInstance } from './axios';
import { Manager } from "socket.io-client";

const manager = new Manager(axiosInstance.defaults.baseURL, {
  autoConnect: false,
  secure: false,
  withCredentials: true
})
export const socket = (manager.socket('/'))