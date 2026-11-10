import React, { useState, useEffect, useRef } from "react";
import { View, Text, ScrollView, Pressable, Alert, Image } from "react-native";
import {
  router,
  useLocalSearchParams,
  useNavigation,
  usePreventRemove,
} from "expo-router";
import * as Picker from "expo-image-picker";
import { File, Paths, Directory } from "expo-file-system";
import { Page, Title, Copy, Label, Button, Field, s, colors } from "../src/ui";
import { useStore } from "../src/store";
import { categories, questions, Memory, Media } from "../src/data";
import { Recorder, AudioPreview, VideoPreview } from "../src/media";
import { validMemoryDate } from "../src/validation.mjs";
export default function Create() {
  const p = useLocalSearchParams<{
    type?: string;
    question?: string;
    id?: string;
    draft?: string;
  }>();
  const store = useStore();
  const existing = store.memories.find((m) => m.id === p.id);
  const base = existing || (p.draft ? store.draft : null);
  const q = p.question !== undefined ? Number(p.question) : base?.question;
  const [title, setTitle] = useState(base?.title || "");
  const [content, setContent] = useState(base?.content || "");
  const [category, setCategory] = useState(
    base?.category ||
      (q !== undefined ? categories[Math.floor(q / 3)] : categories[0]),
  );
  const [date, setDate] = useState(
    base?.date || new Date().toISOString().slice(0, 10),
  );
  const [media, setMedia] = useState<Media[]>(base?.media || []);
  const [recording, setRecording] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [studio, setStudio] = useState(p.type === "audio");
  const navigation = useNavigation();
  const leaving = useRef(false);
  const draft = { title, content, category, date, media, question: q };
  const latest = useRef(draft);
  latest.current = draft;
  useEffect(() => {
    const t = setTimeout(() => {
      if (!leaving.current && (title || content || media.length))
        store
          .update({ draft })
          .then(() => setStatus("Osnutek shranjen na napravi"))
          .catch(() => setStatus("Osnutek ni shranjen. Poskusi znova."));
    }, 650);
    return () => clearTimeout(t);
  }, [title, content, category, date, media]);
  const [canLeave, setCanLeave] = useState(false);
  usePreventRemove(
    !canLeave && (recording || !!title || !!content || media.length > 0),
    ({ repeat }) => {
      if (leaving.current) {
        setCanLeave(true);
        repeat();
        return;
      }
      if (recording) {
        Alert.alert(
          "Snemanje je aktivno",
          "Najprej ustavi posnetek, da ga lahko ohraniš.",
        );
        return;
      }
      store
        .update({ draft: latest.current })
        .then(() => {
          setCanLeave(true);
          repeat();
        })
        .catch(() =>
          Alert.alert(
            "Osnutek ni shranjen",
            "Ostani na tem zaslonu in poskusi znova.",
          ),
        );
    },
  );
  async function preserve(m: Media) {
    const dir = new Directory(Paths.document, "memories");
    dir.create({ idempotent: true, intermediates: true });
    const source = new File(m.uri);
    const ext = source.extension || ".bin";
    const file = new File(
      dir,
      `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`,
    );
    source.copy(file);
    const next = [...media, { ...m, uri: file.uri }];
    await store.update({ draft: { ...latest.current, media: next } });
    setMedia(next);
  }
  async function pick(kind: "image" | "video", camera = false) {
    try {
      const permission = camera
        ? await Picker.requestCameraPermissionsAsync()
        : await Picker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          "Dostop ni dovoljen",
          "Dostop lahko omogočiš v nastavitvah telefona.",
        );
        return;
      }
      const options = {
        mediaTypes:
          kind === "image" ? (["images"] as const) : (["videos"] as const),
        quality: 0.8,
      };
      const result = camera
        ? await Picker.launchCameraAsync({
            ...options,
            mediaTypes: [...options.mediaTypes],
          })
        : await Picker.launchImageLibraryAsync({
            ...options,
            mediaTypes: [...options.mediaTypes],
          });
      if (!result.canceled)
        await preserve({ uri: result.assets[0].uri, type: kind });
    } catch (e) {
      Alert.alert("Vsebine ni mogoče dodati", String(e));
    }
  }
  async function save() {
    if (!title.trim()) {
      Alert.alert("Dodaj naslov", "Vsak spomin potrebuje naslov.");
      return;
    }
    if (!content.trim() && !media.length) {
      Alert.alert(
        "Dodaj vsebino",
        "Napiši zgodbo ali dodaj posnetek oziroma fotografijo.",
      );
      return;
    }
    if (!validMemoryDate(date)) {
      Alert.alert("Preveri datum", "Uporabi LLLL-MM-DD ali samo letnico LLLL.");
      return;
    }
    setBusy(true);
    try {
      const m: Memory = {
        ...draft,
        id:
          existing?.id ||
          `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        title: title.trim(),
        created: existing?.created || new Date().toISOString(),
        precision: date.length === 4 ? "year" : "day",
        favorite: existing?.favorite || false,
        sample: false,
      };
      leaving.current = true;
      await store.save(m);
      await store.update({draft:null});
      Alert.alert("Tvoj spomin je shranjen.", "Shranjeno na tej napravi.");
      router.back();
    } catch (e) {
      leaving.current = false;
      Alert.alert(
        "Shranjevanje ni uspelo",
        "Vsebina ostaja v obrazcu. Poskusi znova.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <Page>
      <View style={s.row}>
        <Label>NOVO POGLAVJE</Label>
        <Text style={s.copy} onPress={() => router.back()}>
          Zapri ×
        </Text>
      </View>
      <Title>{existing ? "Uredi spomin" : "Ohrani ta trenutek."}</Title>
      {q !== undefined && (
        <View style={s.card}>
          <Copy>{questions[q]}</Copy>
        </View>
      )}
      <Field
        label="Naslov spomina"
        value={title}
        onChangeText={setTitle}
        placeholder="Kako se začne tvoja zgodba?"
      />
      <Field
        label="Tvoja zgodba / opis"
        value={content}
        onChangeText={setContent}
        multiline
        placeholder="Spomnim se …"
      />
      <Label>Kategorija</Label>
      <ScrollView horizontal contentContainerStyle={{ gap: 8 }}>
        {categories.map((c) => (
          <Pressable
            key={c}
            style={[
              s.chip,
              category === c && {
                borderColor: colors.accent,
                backgroundColor: "#302A3D",
              },
            ]}
            onPress={() => setCategory(c)}
          >
            <Text style={s.chipText}>{c}</Text>
          </Pressable>
        ))}
      </ScrollView>
      <Field
        label="Datum spomina · LLLL-MM-DD ali letnica"
        value={date}
        onChangeText={setDate}
      />
      {studio && <Recorder onRecorded={preserve} onActive={setRecording} />}
      <Button
        title={studio ? "Skrij studio" : "Posnemi zgodbo"}
        disabled={recording}
        secondary
        onPress={() => setStudio(!studio)}
      />
      <View style={s.row}>
        <View style={{ flex: 1 }}>
          <Button title="Fotografija" secondary onPress={() => pick("image")} />
        </View>
        <View style={{ flex: 1 }}>
          <Button title="Video" secondary onPress={() => pick("video")} />
        </View>
      </View>
      <Button
        title="Fotografiraj s kamero"
        secondary
        onPress={() => pick("image", true)}
      />
      {media.map((m, i) => (
        <View key={m.uri} style={{ gap: 10 }}>
          {m.type === "image" ? (
            <Image
              source={{ uri: m.uri }}
              style={{ height: 230, borderRadius: 18 }}
            />
          ) : m.type === "audio" ? (
            <AudioPreview uri={m.uri} />
          ) : (
            <VideoPreview uri={m.uri} />
          )}
          <Button
            title="Odstrani priponko iz osnutka"
            secondary
            onPress={() =>
              Alert.alert(
                "Odstrani priponko?",
                "Priponka bo odstranjena iz tega obrazca.",
                [
                  { text: "Prekliči" },
                  {
                    text: "Odstrani",
                    style: "destructive",
                    onPress: () => setMedia(media.filter((_, j) => i !== j)),
                  },
                ],
              )
            }
          />
        </View>
      ))}
      <Copy>🔒 Zasebno · Samo na tej napravi</Copy>
      <Button
        disabled={busy || recording}
        title={busy ? "Shranjujem …" : "Shrani spomin"}
        onPress={save}
      />
      <Text accessibilityLiveRegion="polite" style={s.small}>
        {status}
      </Text>
    </Page>
  );
}
