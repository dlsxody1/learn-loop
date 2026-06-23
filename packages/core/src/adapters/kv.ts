/**
 * 플랫폼 독립 key-value 저장소. 웹은 localStorage, 모바일은 AsyncStorage가 구현한다.
 * RN AsyncStorage가 비동기라 인터페이스를 async로 통일한다.
 */
export interface KeyValueStore {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}
