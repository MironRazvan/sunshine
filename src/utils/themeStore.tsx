import { create } from "zustand";

interface Theme {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

const useThemeStore = create<Theme>((set) => ({
    theme: localStorage.getItem('theme') as 'light' | 'dark' || 'light',
    toggleTheme: () => {
        set((state) => {
            const newTheme = state.theme === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            return { theme: state.theme === 'light' ? 'dark' : 'light' };
        })
    }
}));

export default useThemeStore;
