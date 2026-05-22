import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type Language = 'en' | 'ko' | 'hi';
export type AuthMethod = 'email' | 'google' | 'phone' | 'admin';

export interface KCubeUser {
  id: string;
  fullName: string;
  email?: string;
  phone?: string;
  referralCode?: string;
  role?: 'admin' | 'member' | 'manager' | 'guest';
  method: AuthMethod;
}

interface AppState {
  user: KCubeUser | null;
  language: Language;
  points: number;
  completedActions: string[];
  token: string | null;
  refreshToken: string | null;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  signIn: (user: KCubeUser, token?: string | null, refreshToken?: string | null, points?: number) => void;
  signOut: () => void;
  awardPoints: (actionId: string, points: number) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      language: 'en',
      points: 0,
      completedActions: [],
      token: null,
      refreshToken: null,
      setLanguage: (language) => set({ language }),
      toggleLanguage: () =>
        set({
          language: get().language === 'en' ? 'ko' : get().language === 'ko' ? 'hi' : 'en',
        }),
      signIn: (user, token = null, refreshToken = null, serverPoints) =>
        set((state) => {
          const hasWelcomeBonus = state.completedActions.includes('welcome-bonus');

          return {
            user,
            token,
            refreshToken,
            points: typeof serverPoints === 'number' ? serverPoints : hasWelcomeBonus ? state.points : state.points + 250,
            completedActions: hasWelcomeBonus
              ? state.completedActions
              : [...state.completedActions, 'welcome-bonus'],
          };
        }),
      signOut: () => set({ user: null, token: null, refreshToken: null, points: 0, completedActions: [] }),
      awardPoints: (actionId, points) =>
        set((state) => {
          if (!state.user) {
            return state;
          }

          if (state.completedActions.includes(actionId)) {
            return state;
          }

          return {
            points: state.points + points,
            completedActions: [...state.completedActions, actionId],
          };
        }),
    }),
    {
      name: 'kcube-app-state',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        language: state.language,
        points: state.points,
        completedActions: state.completedActions,
        token: state.token,
        refreshToken: state.refreshToken,
      }),
    },
  ),
);
