import React from "react";
import { Text, View, Pressable } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Page, Title, Copy, Label, Button, Icon, s } from "../../src/ui";
import { useStore } from "../../src/store";
import { questions } from "../../src/data";
import { MemoryCard } from "../../src/MemoryCard";
export default function Home() {
  const store = useStore();
  const own = store.memories.filter((m) => !m.sample);
  const answered = own.map((m) => m.question);
  const q = questions.findIndex((_, i) => !answered.includes(i));
  return (
    <Page>
      <View style={s.row}>
        <Label>LUMI LIFE</Label>
        <Pressable
          accessibilityLabel="Moj profil"
          onPress={() => router.push("/(tabs)/profile")}
        >
          <Icon name="person-circle-outline" size={38} />
        </Pressable>
      </View>
      <Title>
        Dobrodošel nazaj,{"\n"}
        {store.name}.
      </Title>
      <Copy>Vsak spomin je del tvoje zgodbe.</Copy>
      <LinearGradient
        colors={["#463858", "#282231"]}
        style={[s.card, { borderColor: "#6D5B88", padding: 26 }]}
      >
        <Label>TRENUTEK ZASE · DANAŠNJE VPRAŠANJE</Label>
        <Text
          style={[
            s.title,
            { fontSize: 25, lineHeight: 34, marginVertical: 12 },
          ]}
        >
          {q < 0 ? "Kaj želiš ohraniti danes?" : questions[q]}
        </Text>
        <Button
          title="Odgovori na vprašanje →"
          onPress={() =>
            router.push({
              pathname: "/create",
              params: { question: q < 0 ? undefined : q },
            })
          }
        />
      </LinearGradient>
      <View style={s.row}>
        <View style={{ flex: 1 }}>
          <Button
            title="◉  Posnemi zgodbo"
            secondary
            onPress={() =>
              router.push({ pathname: "/create", params: { type: "audio" } })
            }
          />
        </View>
        <View style={{ flex: 1 }}>
          <Button
            title="＋  Dodaj spomin"
            secondary
            onPress={() => router.push("/create")}
          />
        </View>
      </View>
      {store.draft && (
        <Button
          title="Nadaljuj shranjeni osnutek"
          secondary
          onPress={() =>
            router.push({ pathname: "/create", params: { draft: "yes" } })
          }
        />
      )}
      <View style={[s.row, { paddingVertical: 10 }]}>
        {[
          own.length,
          own.filter((m) => m.media.some((x) => x.type === "audio")).length,
          own.filter((m) => m.media.some((x) => x.type === "image")).length,
          own.filter((m) => m.question !== undefined).length,
        ].map((n, i) => (
          <View key={i} style={{ alignItems: "center", gap: 7 }}>
            <Text style={s.heading}>{n}</Text>
            <Text style={s.small}>
              {["Spomini", "Posnetki", "Fotografije", "Odgovori"][i]}
            </Text>
          </View>
        ))}
      </View>
      <View style={s.row}>
        <Text style={s.heading}>Zadnji spomini</Text>
        <Text style={s.small} onPress={() => router.push("/(tabs)/archive")}>
          Poglej vse →
        </Text>
      </View>
      {store.memories.slice(0, 3).map((m) => (
        <MemoryCard key={m.id} memory={m} />
      ))}
      <Copy>»Nekatere trenutke začutiš znova, ko jih poveš na glas.«</Copy>
    </Page>
  );
}
