import React from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { Page, Title, Copy, Label, Button, s } from "../src/ui";
export default function Legacy() {
  return (
    <Page>
      <Button title="← Nazaj" secondary onPress={() => router.back()} />
      <Label>LUMI LEGACY · PRIHODNOST</Label>
      <Title>Spomini odprejo pogovor.</Title>
      <Copy>
        Statična demonstracija z izmišljenim virom. Ta zaslon ne uporablja AI-ja
        ali tvojih spominov.
      </Copy>
      <View style={[s.card, { marginLeft: 28 }]}>
        <Copy>Kako je bilo, ko si bil mlad?</Copy>
      </View>
      <View style={[s.card, { borderColor: "#65537C", marginRight: 20 }]}>
        <Copy>
          V izmišljenem vzorčnem arhivu je zgodba o prvem šolskem dnevu.
        </Copy>
        <Label>IZMIŠLJEN VIR · MOJ PRVI ŠOLSKI DAN</Label>
      </View>
      <Copy>
        Prihodnja različica bo odgovarjala izključno na podlagi izvirnih virov
        in z izrecnim dovoljenjem uporabnika.
      </Copy>
    </Page>
  );
}
