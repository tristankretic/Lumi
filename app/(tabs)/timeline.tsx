import React from "react";
import { View, Text } from "react-native";
import { Page, Title, Copy, Label, s } from "../../src/ui";
import { useStore } from "../../src/store";
import { MemoryCard } from "../../src/MemoryCard";
export default function Timeline() {
  const { memories } = useStore();
  return (
    <Page>
      <Label>POGLAVJA TVOJEGA ŽIVLJENJA</Label>
      <Title>Moja življenjska pot</Title>
      <Copy>Zgodba nastaja spomin za spominom.</Copy>
      {[...memories]
        .sort((a, b) => a.date.localeCompare(b.date))
        .map((m) => (
          <View
            key={m.id}
            style={{
              borderLeftWidth: 1,
              borderColor: "#65537C",
              paddingLeft: 18,
              gap: 14,
              paddingBottom: 10,
            }}
          >
            <Text style={[s.heading, { color: "#B8A4E3" }]}>
              ● {m.date.slice(0, 4)}{" "}
              {m.precision === "year" ? "· približno" : ""}
            </Text>
            <MemoryCard memory={m} />
          </View>
        ))}
    </Page>
  );
}
