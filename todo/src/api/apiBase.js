import axios from 'axios';

const BaseURL = process.env.REACT_APP_API_BASE_URL
const AuthURL = process.env.REACT_APP_BACKEND_AUTH_URL

export const api = axios.create({
    baseURL: BaseURL
})

export const authApi = axios.create({
    baseURL: AuthURL
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})