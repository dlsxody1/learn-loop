import type { ChecklistState, Solution } from "@/types";
import { getDeviceId, supabase } from "./supabase";

/**
 * 저장소 추상화. Supabase가 설정돼 있으면 DB를, 아니면 localStorage를 쓴다.
 * 두 구현은 동일한 인터페이스(StorageBackend)를 만족한다 — 예측 가능성.
 */
export interface StorageBackend {
  listSolutions(): Promise<Solution[]>;
  saveSolution(s: Solution): Promise<void>;
  deleteSolution(id: string): Promise<void>;
  getChecklist(): Promise<ChecklistState>;
  setChecklistItem(key: string, done: boolean): Promise<void>;
}

// ── localStorage 구현 ──────────────────────────────────────
const SOLUTIONS_KEY = "line-prep:solutions";
const CHECKLIST_KEY = "line-prep:checklist";

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

const localBackend: StorageBackend = {
  async listSolutions() {
    return readJson<Solution[]>(SOLUTIONS_KEY, []).sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
  },
  async saveSolution(s) {
    const all = readJson<Solution[]>(SOLUTIONS_KEY, []);
    const next = [s, ...all.filter((x) => x.id !== s.id)];
    localStorage.setItem(SOLUTIONS_KEY, JSON.stringify(next));
  },
  async deleteSolution(id) {
    const all = readJson<Solution[]>(SOLUTIONS_KEY, []);
    localStorage.setItem(SOLUTIONS_KEY, JSON.stringify(all.filter((x) => x.id !== id)));
  },
  async getChecklist() {
    return readJson<ChecklistState>(CHECKLIST_KEY, {});
  },
  async setChecklistItem(key, done) {
    const state = readJson<ChecklistState>(CHECKLIST_KEY, {});
    state[key] = done;
    localStorage.setItem(CHECKLIST_KEY, JSON.stringify(state));
  },
};

// ── Supabase 구현 ─────────────────────────────────────────
const supabaseBackend: StorageBackend = {
  async listSolutions() {
    const device = getDeviceId();
    const { data, error } = await supabase!
      .from("solutions")
      .select("*")
      .eq("device_id", device)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map(rowToSolution);
  },
  async saveSolution(s) {
    const device = getDeviceId();
    const { error } = await supabase!.from("solutions").upsert({
      id: s.id,
      device_id: device,
      problem_id: s.problemId,
      problem_title: s.problemTitle,
      category: s.category,
      week: s.week,
      language: s.language,
      code: s.code,
      notes: s.notes,
      created_at: s.createdAt,
    });
    if (error) throw error;
  },
  async deleteSolution(id) {
    const { error } = await supabase!.from("solutions").delete().eq("id", id);
    if (error) throw error;
  },
  async getChecklist() {
    const device = getDeviceId();
    const { data, error } = await supabase!
      .from("checklist")
      .select("item_key, done")
      .eq("device_id", device);
    if (error) throw error;
    const state: ChecklistState = {};
    for (const row of data ?? []) state[row.item_key] = row.done;
    return state;
  },
  async setChecklistItem(key, done) {
    const device = getDeviceId();
    const { error } = await supabase!
      .from("checklist")
      .upsert(
        { device_id: device, item_key: key, done },
        { onConflict: "device_id,item_key" },
      );
    if (error) throw error;
  },
};

interface SolutionRow {
  id: string;
  problem_id: string;
  problem_title: string;
  category: Solution["category"];
  week: number;
  language: string;
  code: string;
  notes: string;
  created_at: string;
}

function rowToSolution(r: SolutionRow): Solution {
  return {
    id: r.id,
    problemId: r.problem_id,
    problemTitle: r.problem_title,
    category: r.category,
    week: r.week,
    language: r.language,
    code: r.code,
    notes: r.notes,
    createdAt: r.created_at,
  };
}

export const storage: StorageBackend = supabase ? supabaseBackend : localBackend;
