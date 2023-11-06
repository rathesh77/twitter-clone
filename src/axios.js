import axios from 'axios'

const instance = axios.create({
  withCredentials: true,
  baseURL: 'http://'+window.location.host.split(':')[0] + ':' + process.env['REACT_APP_BACKEND_PORT']
})

export {instance as axiosInstance}