import axios from "axios";

const apiRequest = axios.create({
    baseURL: "/api",   // relative, goes through Vite proxy to backend
    withCredentials: true,
})

export default apiRequest;