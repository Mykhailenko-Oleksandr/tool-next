import axios from "axios";

const url = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api`
  : "http://localhost:3000/api";

export const nextServer = axios.create({
  baseURL: url,
  withCredentials: true,
});
