import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const initialState = { token: null, refreshToken: null, owner: null };

const useAuthStore = create(
  persist(
    (set) => ({
      ...initialState,
      setAuth: ({ token = null, refreshToken = null, owner = null }) => set({ token, refreshToken, owner }),
      updateOwner: (ownerData) => set((state) => ({ owner: { ...(state.owner || {}), ...(ownerData || {}) } })),
      logout: () => {
        localStorage.clear();
        set(initialState);
      }
    }),
    {
      name: 'booking-auth',
      storage: createJSONStorage(() => localStorage)
    }
  )
);

export { useAuthStore };