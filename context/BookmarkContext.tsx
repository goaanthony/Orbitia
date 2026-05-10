import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchCurrentWeather } from '@/services/api';

export type Bookmark = {
  id: string;
  planet: string;
  title: string;
  location: string;
  temp: string;
  image: string;
  city?: string; // Nom de la ville pour les appels API
  country?: string; // Code pays ISO (ex: FR, US, etc.)
  isCity?: boolean; // true si c'est une vraie ville, false si c'est une planète
};

type BookmarkContextType = {
  bookmarks: Bookmark[];
  addBookmark: (bookmark: Bookmark) => Promise<void>;
  removeBookmark: (id: string) => Promise<void>;
  isBookmarked: (id: string) => boolean;
  refreshWeather: (id: string) => Promise<void>; // Nouveau: rafraîchir la météo
};

const BookmarkContext = createContext<BookmarkContextType>({
  bookmarks: [],
  addBookmark: async () => {},
  removeBookmark: async () => {},
  isBookmarked: () => false,
  refreshWeather: async () => {},
});

const STORAGE_KEY = '@orbitia_bookmarks';

export function BookmarkProvider({ children }: { children: React.ReactNode }) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          const saved = JSON.parse(raw);
          setBookmarks(saved);
        } catch {}
      }
    });
  }, []);

  const addBookmark = async (bookmark: Bookmark) => {
    try {
      // Récupérer la vraie météo si on a un nom de ville
      let bookmarkWithWeather = bookmark;
      if (bookmark.city) {
        const weatherData = await fetchCurrentWeather(bookmark.city);
        if (weatherData?.main?.temp) {
          // Arrondir à un chiffre après la virgule
          const temp = Math.round(weatherData.main.temp * 10) / 10;
          bookmarkWithWeather = {
            ...bookmark,
            temp: `${temp}°C`,
          };
        }
      }

      const updated = [...bookmarks, bookmarkWithWeather];
      setBookmarks(updated);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('[addBookmark] Error:', error);
      // En cas d'erreur, ajouter quand même le bookmark avec la temp statique
      const updated = [...bookmarks, bookmark];
      setBookmarks(updated);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  };

  const removeBookmark = async (id: string) => {
    const updated = bookmarks.filter(b => b.id !== id);
    setBookmarks(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const isBookmarked = (id: string) => bookmarks.some(b => b.id === id);

  const refreshWeather = async (id: string) => {
    const bookmarkIndex = bookmarks.findIndex(b => b.id === id);
    if (bookmarkIndex === -1) return;

    const bookmark = bookmarks[bookmarkIndex];
    try {
      const weatherData = await fetchCurrentWeather(bookmark.city || bookmark.title);
      if (weatherData?.main?.temp) {
        const temp = Math.round(weatherData.main.temp * 10) / 10;
        const updated = [...bookmarks];
        updated[bookmarkIndex] = {
          ...bookmark,
          temp: `${temp}°C`,
        };
        setBookmarks(updated);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
    } catch (error) {
      console.error('[refreshWeather] Error:', error);
    }
  };

  return (
    <BookmarkContext.Provider
      value={{ bookmarks, addBookmark, removeBookmark, isBookmarked, refreshWeather }}
    >
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmark() {
  return useContext(BookmarkContext);
}
