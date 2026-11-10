import React, { createContext, useContext, useEffect, useState } from "react";
import Storage from "expo-sqlite/kv-store";
import { Memory, samples } from "./data";
type State = {
  memories: Memory[];
  draft: Partial<Memory> | null;
  name: string;
  onboarding: boolean;
  reminders: string;
  invitations: string[];
};
const initial: State = {
  memories: samples,
  draft: null,
  name: "Prijatelj",
  onboarding: false,
  reminders: "Izključeno",
  invitations: [],
};
type Store = State & {
  ready: boolean;
  error: string;
  update: (next: Partial<State>) => Promise<void>;
  save: (memory: Memory) => Promise<void>;
  remove: (id: string) => Promise<void>;
};
const Context = createContext<Store>(null!);
export function Provider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(initial);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    Storage.getItem("lumi-v1")
      .then((raw) => {
        if (raw) setState(JSON.parse(raw));
        setReady(true);
      })
      .catch(() =>
        setError(
          "Lokalnega arhiva ni mogoče odpreti. Ponovno zaženi aplikacijo.",
        ),
      );
  }, []);
  const ref = React.useRef(state);
  ref.current = state;
  const queue = React.useRef(Promise.resolve());
  const update = (next: Partial<State>) => {
    const task = queue.current
      .catch(() => {})
      .then(async () => {
        const value = { ...ref.current, ...next };
        await Storage.setItem("lumi-v1", JSON.stringify(value));
        ref.current = value;
        setState(value);
      });
    queue.current = task;
    return task;
  };
  return (
    <Context.Provider
      value={{
        ...state,
        ready,
        error,
        update,
        save: async (m) =>
          update({
            memories: [m, ...ref.current.memories.filter((x) => x.id !== m.id)],
          }),
        remove: async (id) =>
          update({ memories: ref.current.memories.filter((m) => m.id !== id) }),
      }}
    >
      {children}
    </Context.Provider>
  );
}
export const useStore = () => useContext(Context);
