import React, { useState } from "react";
import { View, Text, ActivityIndicator, Alert, Image } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useStore } from "../src/store";
import { Page, Title, Copy, Label, Button, Field, Icon, s } from "../src/ui";
import { supabase } from "../src/supabase";
const steps = [
  [
    "Vsaka zgodba si zasluži, da ostane.",
    "Spomini oblikujejo našo zgodbo. Z LUMI lahko ohraniš tisto, kar ti največ pomeni.",
  ],
  [
    "Ohrani svoj glas.",
    "Posnemi zgodbe, misli in trenutke, ki jih želiš predati prihodnjim generacijam.",
  ],
  [
    "Deli s svojimi bližnjimi.",
    "Sam odločaš, kateri spomini ostanejo zasebni in katere želiš deliti.",
  ],
];
export default function Welcome() {
  const store = useStore();
  const [step, setStep] = useState(0);
  const params=useLocalSearchParams<{auth?:string}>();
  const [auth, setAuth] = useState(params.auth==='yes');
  const [register, setRegister] = useState(false);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  async function enter() {
    try {
      await store.update({
        onboarding: true,
        ...(name.trim() ? { name: name.trim() } : {}),
      });
      router.replace("/(tabs)");
    } catch {
      Alert.alert("Napaka", "Nastavitev ni mogoče shraniti. Poskusi znova.");
    }
  }
  async function login() {
    if (!supabase) {
      Alert.alert(
        "Povezava še ni nastavljena",
        "Za prijavo potrebujemo Supabase. Za zdaj lahko preizkusiš lokalni demo.",
      );
      return;
    }
    if (!email.includes("@") || password.length < 8) {
      Alert.alert("Preveri vnos", "Vnesi e-pošto in geslo z vsaj 8 znaki.");
      return;
    }
    setBusy(true);
    try {
      const result = register
        ? await supabase.auth.signUp({
            email,
            password,
            options: { data: { first_name: name, last_name: surname } },
          })
        : await supabase.auth.signInWithPassword({ email, password });
      if (result.error) throw result.error;
      Alert.alert(
        "Prijava v račun",
        result.data.session
          ? "Račun je prijavljen. Arhiv tega prototipa se še vedno shranjuje samo na tej napravi."
          : "Preveri e-pošto za potrditev računa. Nato se prijavi.",
      );
      if (result.data.session) await enter();
    } catch (e) {
      Alert.alert("Prijava ni uspela", String((e as Error).message));
    } finally {
      setBusy(false);
    }
  }
  if (store.error)
    return (
      <Page>
        <Title>Arhiva ni mogoče odpreti</Title>
        <Copy>{store.error}</Copy>
      </Page>
    );
  if (!store.ready)
    return (
      <Page>
        <ActivityIndicator />
      </Page>
    );
  if (store.onboarding && !auth)
    return (
      <Page>
        <Label>LUMI LIFE</Label>
        <Title>Tvoja zgodba se nadaljuje.</Title>
        <Button
          title="Odpri moj arhiv"
          onPress={() => router.replace("/(tabs)")}
        />
        <Button
          title="Prijava v račun"
          secondary
          onPress={() => setAuth(true)}
        />
      </Page>
    );
  return (
    <Page>
      <Image source={require('../assets/lumi-logo.png')} accessibilityLabel="LUMI — Your Story Lives On" style={{width:180,height:95,alignSelf:'center',resizeMode:'contain'}}/>
      <View style={[s.row, { marginBottom: 20 }]}>
        <Label>LUMI LIFE</Label>
        <Text onPress={enter} style={s.small}>
          Preskoči →
        </Text>
      </View>
      <LinearGradient
        colors={["#393047", "#1B1B21"]}
        style={{
          height: 210,
          borderRadius: 90,
          alignItems: "center",
          justifyContent: "center",
          marginVertical: 20,
        }}
      >
        <Icon
          name={
            step === 0
              ? "book-outline"
              : step === 1
                ? "mic-outline"
                : "people-outline"
          }
          size={82}
        />
      </LinearGradient>
      {auth ? (
        <>
          <Title>
            {register ? "Začni svojo zgodbo." : "Dobrodošel nazaj."}
          </Title>
          {register && (
            <>
              <Field label="Ime" value={name} onChangeText={setName} />
              <Field
                label="Priimek"
                value={surname}
                onChangeText={setSurname}
              />
            </>
          )}
          <Field
            label="E-pošta"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <Field
            label="Geslo"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Button
            disabled={busy}
            title={busy ? "Počakaj …" : register ? "Ustvari račun" : "Prijava"}
            onPress={login}
          />
          <Button
            title={register ? "Že imam račun" : "Ustvari račun"}
            secondary
            onPress={() => setRegister(!register)}
          />
        </>
      ) : (
        <>
          <Label>0{step + 1} / 03 · TVOJA ZAPUŠČINA</Label>
          <Title>{steps[step][0]}</Title>
          <Copy>{steps[step][1]}</Copy>
          <Button
            title={step === 2 ? "Začni svojo zgodbo" : "Nadaljuj →"}
            onPress={() => (step < 2 ? setStep(step + 1) : enter())}
          />
        </>
      )}
      <Button title="Preizkusi lokalni demo" secondary onPress={enter} />
      <Copy>
        Demo vsebuje izmišljene primere. Novi spomini ostanejo na tej napravi,
        brez varnostne kopije v oblaku.
      </Copy>
    </Page>
  );
}
