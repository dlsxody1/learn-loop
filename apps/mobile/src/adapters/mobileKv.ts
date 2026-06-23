import AsyncStorage from "@react-native-async-storage/async-storage";
import type { KeyValueStore } from "@learnloop/core";

/** 모바일 key-value 저장소 — AsyncStorage. */
export const mobileKv: KeyValueStore = {
  getItem: (key) => AsyncStorage.getItem(key),
  setItem: (key, value) => AsyncStorage.setItem(key, value),
  removeItem: (key) => AsyncStorage.removeItem(key),
};
