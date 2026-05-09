import { api } from './axiosInstance.js';

const getBusinessPage = (ownerId) => api.get(`/public/${ownerId}`).then((response) => response.data);
const createBooking = (payload) => api.post('/public/book', payload).then((response) => response.data);
const sendPublicChatMessage = ({ ownerId, message, conversationHistory, role = 'customer' }) => api.post(`/ai/public/${ownerId}/chat`, { message, conversationHistory, role }).then((response) => response.data);

export { getBusinessPage, createBooking, sendPublicChatMessage };