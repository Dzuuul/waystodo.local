import axios from "axios";

export const API = axios.create({
  baseURL: `https://api.kontenbase.com/query/api/v1/fba8f566-69a9-4186-97cc-a31d3ed4bd48`,
});

export function setAuthorization(token) {
  if (!token) {
    delete API.defaults.headers.common;
    return;
  }
  API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}
