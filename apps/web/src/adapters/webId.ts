import type { IdGen } from "@learnloop/core";

/** 웹 ID 생성기 — crypto.randomUUID. */
export const webIdGen: IdGen = {
  newId: () => crypto.randomUUID(),
};
