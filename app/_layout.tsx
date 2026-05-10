import { BookmarkProvider } from '@/context/BookmarkContext';
import { UserProvider } from '@/context/UserContext';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

SplashScreen.preventAutoHideAsync();

function AppSplash({ onDone }: { onDone: () => void }) {
  const opacity = useState(new Animated.Value(0))[0];
  const scale = useState(new Animated.Value(0.8))[0];
  const textOpacity = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start(() => {
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          Animated.timing(opacity, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }).start(() => onDone());
        }, 1200);
      });
    });
  }, []);

  return (
    <Animated.View style={[styles.splash, { opacity }]}>
      <View style={[styles.ring, styles.ring1]} />
      <View style={[styles.ring, styles.ring2]} />
      <View style={[styles.ring, styles.ring3]} />

      <Animated.View style={{ transform: [{ scale }] }}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoEmoji}>🪐</Text>
        </View>
      </Animated.View>

      <Text style={styles.appName}>SPACED</Text>

      <Animated.Text style={[styles.tagline, { opacity: textOpacity }]}>
        Explore the universe
      </Animated.Text>

      <Animated.View style={[styles.dotRow, { opacity: textOpacity }]}>
        <View style={styles.dot} />
        <View style={[styles.dot, styles.dotActive]} />
        <View style={styles.dot} />
      </Animated.View>
    </Animated.View>
  );
}

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  if (showSplash) {
    return (
      <UserProvider>
        <BookmarkProvider>
          <AppSplash onDone={() => setShowSplash(false)} />
        </BookmarkProvider>
      </UserProvider>
    );
  }

  return (
    <UserProvider>
      <BookmarkProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>
      </BookmarkProvider>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  ring: {
    position: 'absolute',
    borderRadius: 1000,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderStyle: 'dashed',
  },
  ring1: { width: 220, height: 220 },
  ring2: { width: 300, height: 300 },
  ring3: { width: 380, height: 380 },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(230, 243, 88, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(230, 243, 88, 0.3)',
  },
  logoEmoji: {
    fontSize: 44,
  },
  appName: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 8,
    marginTop: 8,
  },
  tagline: {
    color: '#9CA3AF',
    fontSize: 13,
    letterSpacing: 1.5,
  },
  dotRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 24,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  dotActive: {
    backgroundColor: '#E6F358',
    width: 16,
  },
});