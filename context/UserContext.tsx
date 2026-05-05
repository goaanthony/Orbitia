import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type UserProfile = {
  name: string;
  avatar: string;
  bio: string;
};

const DEFAULT_PROFILE: UserProfile = {
  name: 'Arthur',
  avatar: 'https://i.pravatar.cc/150?img=3',
  bio: 'Space explorer & stargazer',
};

type UserContextType = {
  profile: UserProfile;
  updateProfile: (partial: Partial<UserProfile>) => Promise<void>;
};

const UserContext = createContext<UserContextType>({
  profile: DEFAULT_PROFILE,
  updateProfile: async () => {},
});

const STORAGE_KEY = '@spaced_user_profile';

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          const saved = JSON.parse(raw);
          setProfile({ ...DEFAULT_PROFILE, ...saved });
        } catch {}
      }
    });
  }, []);

  const updateProfile = async (partial: Partial<UserProfile>) => {
    const updated = { ...profile, ...partial };
    setProfile(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  return (
    <UserContext.Provider value={{ profile, updateProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}