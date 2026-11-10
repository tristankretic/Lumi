import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ColorValue,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
export const colors = {
  bg: "#111114",
  panel: "#1B1B21",
  card: "#24242C",
  text: "#F5F1EB",
  muted: "#A7A4AF",
  accent: "#B8A4E3",
  border: "#34343E",
};
export function Label({ children }: { children: React.ReactNode }) {
  return <Text style={s.label}>{children}</Text>;
}
export function Title({ children }: { children: React.ReactNode }) {
  return <Text style={s.title}>{children}</Text>;
}
export function Copy({ children }: { children: React.ReactNode }) {
  return <Text style={s.copy}>{children}</Text>;
}
export function Button({
  title,
  onPress,
  secondary = false,
  disabled = false,
}: {
  title: string;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        s.button,
        secondary && s.secondary,
        { opacity: disabled ? 0.4 : pressed ? 0.7 : 1 },
      ]}
    >
      <Text style={[s.buttonText, secondary && { color: colors.text }]}>
        {title}
      </Text>
    </Pressable>
  );
}
export function Page({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaView style={s.safe} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={s.page}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
export function Field({
  label,
  value,
  onChangeText,
  multiline = false,
  secureTextEntry = false,
  placeholder = "",
  keyboardType = "default",
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  multiline?: boolean;
  secureTextEntry?: boolean;
  placeholder?: string;
  keyboardType?: "default" | "email-address" | "numeric";
}) {
  return (
    <View style={{ gap: 8 }}>
      <Label>{label}</Label>
      <TextInput
        accessibilityLabel={label}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        multiline={multiline}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={keyboardType === "email-address" ? "none" : "sentences"}
        style={[
          s.input,
          multiline && { minHeight: 150, textAlignVertical: "top" },
        ]}
      />
    </View>
  );
}
export function Icon({
  name,
  size = 24,
  color = colors.accent,
}: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  size?: number;
  color?: ColorValue;
}) {
  return (
    <Ionicons
      name={name}
      size={size}
      color={color as React.ComponentProps<typeof Ionicons>["color"]}
    />
  );
}
export const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  page: { padding: 24, paddingBottom: 40, gap: 22 },
  label: {
    color: colors.accent,
    fontSize: 11,
    letterSpacing: 1.8,
    fontFamily: "Inter_500Medium",
    textTransform: "uppercase",
  },
  title: {
    color: colors.text,
    fontSize: 32,
    lineHeight: 40,
    fontFamily: "Manrope_600SemiBold",
  },
  copy: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 24,
    fontFamily: "Inter_400Regular",
  },
  button: {
    minHeight: 54,
    borderRadius: 18,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
  },
  secondary: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonText: {
    color: colors.bg,
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
    color: colors.text,
    backgroundColor: colors.panel,
    fontFamily: "Inter_400Regular",
    fontSize: 16,
  },
  card: {
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    padding: 22,
    gap: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  heading: {
    fontFamily: "Manrope_600SemiBold",
    color: colors.text,
    fontSize: 20,
  },
  small: {
    color: colors.muted,
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    lineHeight: 19,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipText: { fontFamily: "Inter_500Medium", fontSize: 12, color: colors.text },
});
