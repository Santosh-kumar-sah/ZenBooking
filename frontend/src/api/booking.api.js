import { api } from './axiosInstance.js';

const getBookings = ({ page = 1, limit = 10, status, date } = {}) => api.get('/bookings', { params: { page, limit, status, date } }).then((response) => response.data);
const updateBooking = (id, payload) => api.put(`/bookings/${id}`, payload).then((response) => response.data);
const cancelBooking = (id) => api.delete(`/bookings/${id}`).then((response) => response.data);

export { getBookings, updateBooking, cancelBooking };