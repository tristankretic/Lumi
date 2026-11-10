import React, { useState } from "react";
import { View, Text, Alert } from "react-native";
import { router } from "expo-router";
import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Page, Label, Title, Copy, Field, Button, s, Icon } from "../../src/ui";
import { useStore } from "../../src/store";
import { supabase } from "../../src/supabase";
export default function Profile() {
  const store = useStore();
  const [name, setName] = useState(store.name);
  async function exportData() {
    try {
      const file = new File(Paths.cache, "lumi-arhiv.json");
      file.create({ overwrite: true });
      file.write(
        JSON.stringify(
          {
            format: "lumi-life-v1",
            exportedAt: new Date().toISOString(),
            name: store.name,
            memories: store.memories,
            draft: store.draft,
            note: "Izvoz vsebuje besedilo in poti do lokalnih priponk, ne pa samih medijskih datotek.",
          },
          null,
          2,
        ),
      );
      if (await Sharing.isAvailableAsync())
        await Sharing.shareAsync(file.uri, {
          mimeType: "application/json",
          dialogTitle: "Izvozi besedilni arhiv LUMI",
        });
      else Alert.alert("Deljenje ni na voljo", "Izvoz poskusi na telefonu.");
    } catch (e) {
      Alert.alert("Izvoz ni uspel", String(e));
    }
  }
  return (
    <Page>
      <Label>TVOJ OSEBNI PROSTOR</Label>
      <Title>Moj profil</Title>
      <View style={[s.card, { alignItems: "center" }]}>
        <Icon name="person-circle-outline" size={70} />
        <Text style={s.heading}>{store.name}</Text>
        <Copy>Lokalni prototip · brez kopije v oblaku</Copy>
      </View>
      <Field label="Kako te pokličemo?" value={name} onChangeText={setName} />
      <Button
        title="Shrani ime"
        onPress={async () => {
          try {
            if (!name.trim()) return;
            await store.update({ name: name.trim() });
            Alert.alert("Shranjeno");
          } catch {
            Alert.alert("Shranjevanje ni uspelo");
          }
        }}
      />
      <Button
        title="Družina in dostop →"
        secondary
        onPress={() => router.push("/family")}
      />
      <Button
        title={`Opomniki: ${store.reminders}`}
        secondary
        onPress={() =>
          Alert.alert(
            "Pogostost opomnikov",
            "Shrani svojo željo. Pošiljanje obvestil v tem prototipu še ni aktivno.",
            [
              ...["Izključeno", "Dnevno", "Tedensko"].map((value) => ({
                text: value,
                onPress: () =>
                  store
                    .update({ reminders: value })
                    .catch(() => Alert.alert("Napaka pri shranjevanju")),
              })),
              { text: "Prekliči", style: "cancel" },
            ],
          )
        }
      />
      <View style={s.card}>
        <Label>ZASEBNOST</Label>
        <Copy>
          Spomini in mediji so shranjeni v prostoru aplikacije na tej napravi.
          Prijava v račun še ne omogoča sinhronizacije. Odstranitev aplikacije
          lahko izbriše lokalni arhiv. Šifriranje od konca do konca ni
          implementirano.
        </Copy>
        <Copy>Jezik: slovenščina · Tema: temna</Copy>
      </View>
      <Button
        title="Izvozi besedila in seznam priponk"
        secondary
        onPress={exportData}
      />
      <Copy>Ta izvoz ne vključuje medijskih datotek.</Copy>
      <Button
        title="LUMI Legacy · predogled"
        secondary
        onPress={() => router.push("/legacy")}
      />
      <Button
        title="Prijava / registracija"
        secondary
        onPress={() => router.push({ pathname: "/", params: { auth: "yes" } })}
      />
      <Button
        title="Odjava računa"
        secondary
        onPress={async () => {
          const result = await supabase?.auth.signOut();
          if (result?.error)
            Alert.alert("Odjava ni uspela", result.error.message);
          else
            Alert.alert(
              "Račun je odjavljen",
              "Lokalni arhiv ostaja na tej napravi.",
            );
        }}
      />
      <Button
        title="Izbriši lokalni arhiv"
        secondary
        onPress={() =>
          Alert.alert(
            "Izbriši lokalne podatke?",
            "Vsi vnosi in osnutek bodo odstranjeni iz arhiva. Datoteke priponk ostanejo v prostoru aplikacije do odstranitve aplikacije. Račun Supabase ne bo izbrisan.",
            [
              { text: "Prekliči" },
              {
                text: "Izbriši",
                style: "destructive",
                onPress: () =>
                  store
                    .update({ memories: [], draft: null, invitations: [] })
                    .catch(() => Alert.alert("Izbris ni uspel")),
              },
            ],
          )
        }
      />
    </Page>
  );
}
