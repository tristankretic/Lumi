import { createClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";
const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
// Split sessions because tokens can exceed the per-entry SecureStore limit.
const secureStorage = {
  async getItem(k: string) {
    const count = Number(await SecureStore.getItemAsync(k + "-count"));
    if (!count) return null;
    let result = "";
    for (let i = 0; i < count; i++) {
      const chunk = await SecureStore.getItemAsync(k + "-" + i);
      if (chunk === null) return null;
      result += chunk;
    }
    return result;
  },
  async setItem(k: string, v: string) {
    const count = Math.ceil(v.length / 1500);
    for (let i = 0; i < count; i++)
      await SecureStore.setItemAsync(
        k + "-" + i,
        v.slice(i * 1500, (i + 1) * 1500),
      );
    await SecureStore.setItemAsync(k + "-count", String(count));
  },
  async removeItem(k: string) {
    const count = Number(await SecureStore.getItemAsync(k + "-count"));
    for (let i = 0; i < count; i++)
      await SecureStore.deleteItemAsync(k + "-" + i);
    await SecureStore.deleteItemAsync(k + "-count");
  },
};
export const supabase =
  url && key
    ? createClient(url, key, {
        auth: {
          storage: secureStorage,
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
        },
      })
    : null;
