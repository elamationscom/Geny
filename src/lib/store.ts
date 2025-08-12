import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Platform, ScheduledPost, SocialAccount, User } from './types';
import { reviveDates } from './utils';

type AppState = {
  user: User | null;
  accounts: SocialAccount[];
  scheduledPosts: ScheduledPost[];
  signIn: (u: User) => void;
  signOut: () => void;
  updateUser: (partial: Partial<User>) => void;
  connectAccount: (platform: Platform, accessToken: string, profileInfo?: SocialAccount['profileInfo']) => void;
  disconnectAccount: (platform: Platform) => void;
  updateAccountToken: (platform: Platform, accessToken: string) => void;
  schedulePost: (input: { platform: Platform; content: string; scheduledAt: Date }) => void;
  bulkSchedulePosts: (inputs: { platform: Platform; content: string; scheduledAt: Date }[]) => void;
  updateScheduledPost: (id: string, partial: Partial<Pick<ScheduledPost, 'content' | 'scheduledAt' | 'status'>>) => void;
  deleteScheduledPost: (id: string) => void;
};

const defaultAccounts: SocialAccount[] = [
  { id: 'ig', platform: 'instagram', name: 'Instagram Account', connected: false },
  { id: 'li', platform: 'linkedin', name: 'LinkedIn Profile', connected: false },
  { id: 'fb', platform: 'facebook', name: 'Facebook Page', connected: false },
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      accounts: defaultAccounts,
      scheduledPosts: [],
      signIn: (u) => set({ user: u }),
      signOut: () => set({ user: null }),
      updateUser: (partial) => {
        const user = get().user;
        if (!user) return;
        set({ user: { ...user, ...partial } });
      },
      connectAccount: (platform, accessToken, profileInfo) =>
        set({
          accounts: get().accounts.map((a) =>
            a.platform === platform 
              ? { ...a, connected: true, accessToken, profileInfo } 
              : a
          ),
        }),
      disconnectAccount: (platform) =>
        set({
          accounts: get().accounts.map((a) =>
            a.platform === platform 
              ? { ...a, connected: false, accessToken: undefined, profileInfo: undefined } 
              : a
          ),
        }),
      updateAccountToken: (platform, accessToken) =>
        set({
          accounts: get().accounts.map((a) =>
            a.platform === platform ? { ...a, accessToken } : a
          ),
        }),
      schedulePost: ({ platform, content, scheduledAt }) =>
        set({
          scheduledPosts: [
            ...get().scheduledPosts,
            { id: crypto.randomUUID(), platform, content, scheduledAt, status: 'scheduled' },
          ],
        }),
      bulkSchedulePosts: (inputs) =>
        set({
          scheduledPosts: [
            ...get().scheduledPosts,
            ...inputs.map((i) => ({ id: crypto.randomUUID(), ...i, status: 'scheduled' as const })),
          ],
        }),
      updateScheduledPost: (id, partial) =>
        set({
          scheduledPosts: get().scheduledPosts.map((p) => (p.id === id ? { ...p, ...partial } : p)),
        }),
      deleteScheduledPost: (id) =>
        set({
          scheduledPosts: get().scheduledPosts.filter((p) => p.id !== id),
        }),
    }),
    {
      name: 'geny-store',
      version: 1,
      partialize: (state) => ({ user: state.user, accounts: state.accounts, scheduledPosts: state.scheduledPosts }),
      merge: (persisted, current) => {
        const merged = { ...current, ...(persisted as any) } as AppState;
        merged.scheduledPosts = reviveDates(merged.scheduledPosts);
        return merged;
      },
    }
  )
);

