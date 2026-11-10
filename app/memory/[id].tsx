import React from "react";
import { Image, Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Page, Label, Title, Copy, Button } from "../../src/ui";
import { useStore } from "../../src/store";
import { AudioPreview, VideoPreview } from "../../src/media";
export default function Details() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const store = useStore();
  const m = store.memories.find((x) => x.id === id);
  if (!m)
    return (
      <Page>
        <Title>Spomina ni v arhivu.</Title>
        <Button title="Nazaj" onPress={() => router.back()} />
      </Page>
    );
  async function favorite() {
    try {
      await store.save({ ...m!, favorite: !m!.favorite });
    } catch {
      Alert.alert("Sprememba ni shranjena", "Poskusi znova.");
    }
  }
  return (
    <Page>
      <Button title="← Nazaj" secondary onPress={() => router.back()} />
      <Label>
        {m.sample
          ? "IZMIŠLJEN DEMONSTRACIJSKI PRIMER"
          : "ZASEBNO · NA TEJ NAPRAVI"}
      </Label>
      <Title>{m.title}</Title>
      <Copy>
        {m.category} · {m.date} {m.precision === "year" ? "(približno)" : ""}
      </Copy>
      <Copy>{m.content}</Copy>
      {m.media.map((x) =>
        x.type === "image" ? (
          <Image
            key={x.uri}
            source={{ uri: x.uri }}
            style={{ height: 280, borderRadius: 22 }}
          />
        ) : x.type === "audio" ? (
          <AudioPreview key={x.uri} uri={x.uri} />
        ) : (
          <VideoPreview key={x.uri} uri={x.uri} />
        ),
      )}
      <Copy>Dodano {m.created.slice(0, 10)}</Copy>
      <Button
        title={
          m.favorite
            ? "♥ Odstrani iz priljubljenih"
            : "♡ Dodaj med priljubljene"
        }
        secondary
        onPress={favorite}
      />
      <Button
        title="Uredi spomin"
        secondary
        onPress={() =>
          router.push({ pathname: "/create", params: { id: m.id } })
        }
      />
      <Button
        title="Družinski dostop"
        secondary
        onPress={() => router.push("/family")}
      />
      <Button
        title="Izbriši spomin"
        secondary
        onPress={() =>
          Alert.alert(
            "Izbriši spomin?",
            "Izbris vnosa iz lokalnega arhiva ni mogoče razveljaviti.",
            [
              { text: "Prekliči" },
              {
                text: "Izbriši",
                style: "destructive",
                onPress: async () => {
                  try {
                    await store.remove(m.id);
                    router.back();
                  } catch {
                    Alert.alert("Izbris ni uspel", "Poskusi znova.");
                  }
                },
              },
            ],
          )
        }
      />
    </Page>
  );
}
