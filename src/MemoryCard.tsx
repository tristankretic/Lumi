import React from "react";
import { Pressable, View, Text, Image } from "react-native";
import { router } from "expo-router";
import { Memory } from "./data";
import { Icon, s, colors } from "./ui";
export function MemoryCard({ memory: m }: { memory: Memory }) {
  const image = m.media.find((x) => x.type === "image");
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={m.title}
      onPress={() =>
        router.push({ pathname: "/memory/[id]", params: { id: m.id } })
      }
      style={[s.card, s.row]}
    >
      {image ? (
        <Image
          source={{ uri: image.uri }}
          style={{ width: 58, height: 64, borderRadius: 12 }}
        />
      ) : (
        <View
          style={{ backgroundColor: "#302A3D", padding: 16, borderRadius: 16 }}
        >
          <Icon
            name={
              m.media[0]?.type === "audio"
                ? "mic-outline"
                : m.media[0]?.type === "video"
                  ? "videocam-outline"
                  : "document-text-outline"
            }
          />
        </View>
      )}
      <View style={{ flex: 1, gap: 6 }}>
        <Text style={[s.heading, { fontSize: 16 }]}>{m.title}</Text>
        <Text style={s.small}>
          {m.category} · {m.date}
        </Text>
        <Text style={[s.small, { color: colors.accent }]}>
          {m.sample ? "IZMIŠLJEN PRIMER" : "SAMO NA TEJ NAPRAVI"}{" "}
          {m.favorite ? "· ♥" : ""}
        </Text>
      </View>
      <Icon name="chevron-forward" size={17} />
    </Pressable>
  );
}
