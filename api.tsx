import axios, { AxiosInstance } from 'axios';

export function API(token?: string): AxiosInstance {
  return axios.create({
    baseURL: 'http://192.168.86.8:8080/api/v1',
    // headers: { Authorization: `Bearer xxx` },
  });
}
