import { create } from "zustand";

type Theme = 'dark' | 'light' | 'system'
interface ThemeStateProps {
    theme: Theme;
    setTheme: (value: Theme) => void
}

export const useAppTheme = create<ThemeStateProps>((set) => ({
    theme: 'system',
    setTheme: (value) => set({theme: value})
}))