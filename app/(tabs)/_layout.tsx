import { Tabs } from "expo-router";
import { Bookmark, Home, Rocket, Search, User } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const { bottom } = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#000",
          borderTopWidth: 0,
          height: 72,
          paddingBottom: bottom + 40,
        },
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#444",
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => <Home color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ color }) => <Search color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Rocket
              color={focused ? "#000" : color}
              size={22}
              style={
                focused
                  ? {
                      backgroundColor: "#fff",
                      borderRadius: 24,
                      padding: 8,
                      overflow: "hidden",
                    }
                  : undefined
              }
            />
          ),
        }}
      />
      <Tabs.Screen
        name="bookmark"
        options={{
          tabBarIcon: ({ color }) => <Bookmark color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => <User color={color} size={22} />,
        }}
      />
    </Tabs>
  );
}
