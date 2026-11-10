import React from "react";
import { View, Text, Alert } from "react-native";
import {
  useAudioRecorder,
  useAudioRecorderState,
  useAudioPlayer,
  useAudioPlayerStatus,
  RecordingPresets,
  AudioModule,
  setAudioModeAsync,
} from "expo-audio";
import { useVideoPlayer, VideoView } from "expo-video";
import { Media } from "./data";
import { Button, Copy, Label, s } from "./ui";
export function AudioPreview({ uri }: { uri: string }) {
  const player = useAudioPlayer(uri);
  const status = useAudioPlayerStatus(player);
  return (
    <View style={s.card}>
      <Label>IZVIRNI POSNETEK</Label>
      <Button
        secondary
        title={status.playing ? "Začasno ustavi" : "Predvajaj posnetek"}
        onPress={() => {
          if (status.playing) player.pause();
          else {
            if (status.didJustFinish) player.seekTo(0);
            player.play();
          }
        }}
      />
    </View>
  );
}
export function VideoPreview({ uri }: { uri: string }) {
  const player = useVideoPlayer(uri);
  return (
    <VideoView
      player={player}
      style={{ height: 230, borderRadius: 18 }}
      nativeControls
    />
  );
}
export function Recorder({
  onRecorded,
  onActive,
}: {
  onRecorded: (m: Media) => Promise<void>;
  onActive: (b: boolean) => void;
}) {
  const recorder = useAudioRecorder({
    ...RecordingPresets.HIGH_QUALITY,
    directory: "document",
    isMeteringEnabled: true,
  });
  const state = useAudioRecorderState(recorder, 150);
  const [started, setStarted] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  async function start() {
    try {
      const p = await AudioModule.requestRecordingPermissionsAsync();
      if (!p.granted) {
        Alert.alert(
          "Mikrofon je izključen",
          "Dovoli dostop do mikrofona v nastavitvah telefona ali napiši zgodbo.",
        );
        return;
      }
      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });
      await recorder.prepareToRecordAsync();
      recorder.record();
      setStarted(true);
      onActive(true);
    } catch (e) {
      Alert.alert("Snemanje ni uspelo", String(e));
    }
  }
  async function stop() {
    setBusy(true);
    try {
      await recorder.stop();
      const uri = recorder.uri;
      if (!uri) throw Error("Posnetek nima datoteke.");
      await onRecorded({ uri, type: "audio" });
      setStarted(false);
      onActive(false);
      await setAudioModeAsync({ allowsRecording: false });
    } catch (e) {
      Alert.alert("Posnetek še ni potrjen", String(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <View style={[s.card, { alignItems: "center", paddingVertical: 28 }]}>
      <Label>
        {state.isRecording
          ? "● SNEMANJE POTEKA"
          : started
            ? "SNEMANJE JE PREKINJENO"
            : "TVOJ GLAS. TVOJA ZGODBA."}
      </Label>
      <Text style={[s.title, { fontSize: 44, margin: 10 }]}>
        {Math.floor(state.durationMillis / 60000)
          .toString()
          .padStart(2, "0")}
        :
        {Math.floor((state.durationMillis / 1000) % 60)
          .toString()
          .padStart(2, "0")}
      </Text>
      <View
        style={{
          height: 45,
          flexDirection: "row",
          alignItems: "center",
          gap: 5,
          marginBottom: 14,
        }}
      >
        {Array.from({ length: 23 }, (_, i) => (
          <View
            key={i}
            style={{
              width: 4,
              borderRadius: 4,
              backgroundColor: "#B8A4E3",
              height: state.isRecording
                ? 8 +
                  Math.abs(Math.sin(i * 2 + state.durationMillis / 300)) *
                    Math.max(6, 45 + (state.metering ?? -40))
                : 5,
            }}
          />
        ))}
      </View>
      {!started ? (
        <Button title="◉  Začni snemanje" onPress={start} />
      ) : (
        <>
          <Button
            title={state.isRecording ? "Premor" : "Nadaljuj snemanje"}
            secondary
            onPress={() =>
              state.isRecording ? recorder.pause() : recorder.record()
            }
          />
          <Button
            disabled={busy}
            title={
              busy ? "Shranjujem posnetek …" : "Ustavi in uporabi posnetek"
            }
            onPress={stop}
          />
        </>
      )}
      <Copy>Snemaj v svojem tempu.</Copy>
    </View>
  );
}
