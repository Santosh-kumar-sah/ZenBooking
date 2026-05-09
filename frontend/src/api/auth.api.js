import { api } from './axiosInstance.js';

const loginOwner = ({ email, password }) => api.post('/auth/login', { email, password }).then((response) => response.data);
const registerOwner = ({ name, email, password, businessName, businessType }) => api.post('/auth/register', { name, email, password, businessName, businessType }).then((response) => response.data);
const refreshToken = () => api.post('/auth/refresh').then((response) => response.data);
const getMe = () => api.get('/auth/me').then((response) => response.data);
const updateMe = (payload) => api.patch('/auth/me', payload).then((response) => response.data);

export { loginOwner, registerOwner, refreshToken, getMe, updateMe };