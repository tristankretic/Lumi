import React, { useState } from "react";
import { View, Alert } from "react-native";
import { router } from "expo-router";
import { Page, Title, Copy, Label, Button, Field, s } from "../src/ui";
import { useStore } from "../src/store";
export default function Family() {
  const store = useStore();
  const [email, setEmail] = useState("");
  return (
    <Page>
      <Button title="← Nazaj" secondary onPress={() => router.back()} />
      <Label>DEMONSTRACIJA DOSTOPA</Label>
      <Title>Družina in dostop</Title>
      <Copy>
        Tukaj lahko preizkusiš seznam povabil. E-pošta se ne pošlje in nihče ne
        dobi dejanskega dostopa do spominov.
      </Copy>
      <Field
        label="E-pošta bližnjega"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <Button
        title="Dodaj demonstracijsko povabilo"
        onPress={async () => {
          const value = email.trim().toLowerCase();
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            Alert.alert("Preveri e-pošto");
            return;
          }
          try {
            await store.update({
              invitations: [...new Set([...store.invitations, value])],
            });
            setEmail("");
            Alert.alert("Demo povabilo dodano", "Sporočilo ni bilo poslano.");
          } catch {
            Alert.alert("Shranjevanje ni uspelo");
          }
        }}
      />
      {store.invitations.map((e) => (
        <View key={e} style={s.card}>
          <Copy>{e}</Copy>
          <Label>DEMO · BREZ DOSTOPA</Label>
          <Button
            title="Odstrani demo povabilo"
            secondary
            onPress={() =>
              Alert.alert("Odstrani demo povabilo?", e, [
                { text: "Prekliči" },
                {
                  text: "Odstrani",
                  style: "destructive",
                  onPress: () =>
                    store
                      .update({
                        invitations: store.invitations.filter((v) => v !== e),
                      })
                      .catch(() => Alert.alert("Shranjevanje ni uspelo")),
                },
              ])
            }
          />
        </View>
      ))}
      <View style={s.card}>
        <Label>V PRIHODNJI RAZLIČICI</Label>
        <Copy>
          Lastnik bo izrecno izbral posamezne spomine. Povabljenec bo lahko
          videl samo te spomine, lastnik pa bo lahko dostop preklical. Dostop bo
          preverjal strežnik.
        </Copy>
      </View>
    </Page>
  );
}
