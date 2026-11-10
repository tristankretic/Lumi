import React, { useState } from "react";
import { ScrollView, Pressable, Text } from "react-native";
import { Page, Title, Copy, Field, s, colors } from "../../src/ui";
import { useStore } from "../../src/store";
import { MemoryCard } from "../../src/MemoryCard";
export default function Archive() {
  const { memories } = useStore();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Vse");
  const filters = [
    "Vse",
    "Glas",
    "Fotografije",
    "Video",
    "Zgodbe",
    "Priljubljeno",
  ];
  const visible = memories.filter(
    (m) =>
      (m.title + " " + m.content + " " + m.category)
        .toLocaleLowerCase()
        .includes(search.toLocaleLowerCase()) &&
      (filter === "Vse" ||
        (filter === "Priljubljeno" && m.favorite) ||
        (filter === "Zgodbe" && !m.media.length) ||
        m.media.some(
          (x) =>
            x.type ===
            { Glas: "audio", Fotografije: "image", Video: "video" }[filter],
        )),
  );
  return (
    <Page>
      <Title>Moji spomini</Title>
      <Copy>Majhni trenutki. Tvoja velika zgodba.</Copy>
      <Field
        label="Poišči spomin"
        value={search}
        onChangeText={setSearch}
        placeholder="Naslov, beseda ali kategorija …"
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8 }}
      >
        {filters.map((f) => (
          <Pressable
            key={f}
            onPress={() => setFilter(f)}
            style={[
              s.chip,
              filter === f && {
                backgroundColor: "#393047",
                borderColor: colors.accent,
              },
            ]}
          >
            <Text style={s.chipText}>{f}</Text>
          </Pressable>
        ))}
      </ScrollView>
      {visible.map((m) => (
        <MemoryCard key={m.id} memory={m} />
      ))}
      {!visible.length && (
        <Copy>Tu še ni spominov. Dodaj prvega ali spremeni iskanje.</Copy>
      )}
    </Page>
  );
}
