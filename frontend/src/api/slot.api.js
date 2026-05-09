import { api } from './axiosInstance.js';

const getSlots = () => api.get('/slots').then((response) => response.data);
const saveSlot = (payload) => api.post('/slots', payload).then((response) => response.data);
const getHolidays = () => api.get('/slots/holidays').then((response) => response.data);
const addHoliday = (payload) => api.post('/slots/holidays', payload).then((response) => response.data);
const deleteHoliday = (id) => api.delete(`/slots/holidays/${id}`).then((response) => response.data);

export { getSlots, saveSlot, getHolidays, addHoliday, deleteHoliday };