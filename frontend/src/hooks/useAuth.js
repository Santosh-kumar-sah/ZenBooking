import { useAuthStore } from '../store/authStore.js';

const useAuth = (selector) => useAuthStore(selector);

export { useAuth };