import { Ionicons } from "@expo/vector-icons";
import { Tabs, useSegments } from "expo-router";
import { View } from "react-native";

export default function TabsLayout() {
  const segments = useSegments();

  /**
   * segments examples:
   * ["(tabs)", "home"] → home/index → SHOW tabs
   * ["(tabs)", "home", "deposit"] → HIDE tabs
   * ["(tabs)", "profile"] → SHOW tabs
   */

  const hideTabs =
    (segments[1] === "home" && segments.length > 2) ||
    (segments[1] === "profile" && segments.length > 2) ||
    (segments[1] === "settings" && segments.length > 2);

  return (
    <View style={{ flex: 1, backgroundColor: "#020617" }}>
      <Tabs
        screenOptions={{
          headerShown: false,

          tabBarActiveTintColor: "#38bdf8",
          tabBarInactiveTintColor: "#64748b",

          // Keep space for tab bar to avoid white flash
          tabBarStyle: hideTabs
            ? {
                backgroundColor: "#020617", // same as screen
                height: 64, // same height as normal tab
                borderTopWidth: 0,
              }
            : {
                backgroundColor: "#020617",
                borderTopColor: "#0f172a",
                borderTopWidth: 1,
                height: 64,
                paddingBottom: 8,
                paddingTop: 6,
              },

          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "600",
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-outline" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="settings"
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>

      {/* This dummy view will sit on top of the tab bar when it is "hidden" */}
      {hideTabs && (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 64, // same height as tab bar
            backgroundColor: "#020617", // same as screen
          }}
        />
      )}
    </View>
  );
}
