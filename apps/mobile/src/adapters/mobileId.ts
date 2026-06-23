import * as Crypto from "expo-crypto";
import type { IdGen } from "@learnloop/core";

/** 모바일 ID 생성기 — expo-crypto. */
export const mobileIdGen: IdGen = {
  newId: () => Crypto.randomUUID(),
};
