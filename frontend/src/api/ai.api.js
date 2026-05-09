import { api } from './axiosInstance.js';

const sendChatMessage = ({ message, ownerId, conversationHistory, role = 'owner' }) => api.post('/ai/chat', { message, ownerId, conversationHistory, role }).then((response) => response.data);
const getInsights = () => api.get('/ai/insights').then((response) => response.data);
const regenerateReminder = (bookingId) => api.post(`/ai/reminder/${bookingId}`).then((response) => response.data);

export { sendChatMessage, getInsights, regenerateReminder };