import axios from "axios";

export const nextServer = axios.create({
  baseURL: `${process.env.NEXT_API_URL}/api` || "http://localhost:3000",
  withCredentials: true,
});
