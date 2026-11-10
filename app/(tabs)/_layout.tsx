import React from "react";
import { Tabs } from "expo-router";
import { Icon, colors } from "../../src/ui";
export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.panel,
          borderTopColor: colors.border,
          height: 84,
          paddingTop: 10,
          paddingBottom: 20,
        },
        tabBarLabelStyle: { fontSize: 10 },
      }}
    >
      {(["index", "archive", "add", "timeline", "profile"] as const).map(
        (name, i) => (
          <Tabs.Screen
            key={name}
            name={name}
            options={{
              title: ["Domov", "Arhiv", "Dodaj", "Časovnica", "Profil"][i],
              tabBarIcon: ({ color }) => (
                <Icon
                  name={
                    (
                      [
                        "home-outline",
                        "albums-outline",
                        "add-circle",
                        "git-branch-outline",
                        "person-outline",
                      ] as const
                    )[i]
                  }
                  color={color}
                  size={i === 2 ? 38 : 23}
                />
              ),
            }}
          />
        ),
      )}
    </Tabs>
  );
}
