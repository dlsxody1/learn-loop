import type { KeyValueStore } from "@learnloop/core";

/** 웹 key-value 저장소 — localStorage 래퍼(async 인터페이스 충족). */
export const webKv: KeyValueStore = {
  async getItem(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  async setItem(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* 저장 실패(프라이빗 모드 등)는 무시 */
    }
  },
  async removeItem(key) {
    try {
      localStorage.removeItem(key);
    } catch {
      /* noop */
    }
  },
};
