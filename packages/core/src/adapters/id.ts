/**
 * 플랫폼 독립 ID 생성기. 웹은 crypto.randomUUID, 모바일은 expo-crypto가 구현한다.
 */
export interface IdGen {
  newId(): string;
}
