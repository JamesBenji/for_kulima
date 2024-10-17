import { create } from "zustand";

type Theme = 'dark' | 'light' | 'system'

type Roles = 'district_admin' | 'parish_admin' | 'field_agent' | 'ministry_admin'
interface ThemeStateProps {
    theme: Theme;
    setTheme: (value: Theme) => void

}

interface iAdminDetails{
    admin_details: AdminType | null;
    setAdminDetails: (value: AdminType | null) => void
    role: Roles | null
    setRole: (value: Roles) => void
}

export const useAppTheme = create<ThemeStateProps>((set) => ({
    theme: 'system',
    setTheme: (value) => set({theme: value})
}))

export const useAdminDetails = create<iAdminDetails>((set, state) => (
    {
        admin_details: null,
        setAdminDetails: value => set({...state, admin_details: value}),
        
        role: null,
        setRole: (value) => set({...state, role: value})
    }
))