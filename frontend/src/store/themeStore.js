import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useThemeStore = create(
  persist(
    (set) => ({
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' }))
    }),
    {
      name: 'booking-theme',
      storage: createJSONStorage(() => localStorage)
    }
  )
);

export { useThemeStore };
