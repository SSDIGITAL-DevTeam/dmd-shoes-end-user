import axios from "axios";

export const axiosInstance =  axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
  });
export const axiosAuthInstance =  axios.create({
    baseURL:  process.env.NEXT_PUBLIC_AUTH_API_URL,
  });

