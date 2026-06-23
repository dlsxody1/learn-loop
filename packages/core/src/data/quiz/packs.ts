import type { QuizPack } from "../../types";

/**
 * 학습 묶음(pack) 메타 정보. 점프 학습: 한 묶음을 한 달간 풀고
 * 확인 테스트를 통과하면 다음 묶음이 unlock 된다.
 * 기본 unlocked 값은 첫 팩만 true이며, 실제 잠금 해제 상태는
 * PackCompletion 기록을 합쳐 useQuiz / usePackProgress에서 계산한다.
 */
export const packs: QuizPack[] = [
  {
    id: "pack-1",
    order: 1,
    title: "JS · React 기초",
    description:
      "클로저, 이벤트 루프, 프로토타입, React 렌더링/훅 등 면접 최빈출 기초.",
    unlocked: true,
  },
  {
    id: "pack-2",
    order: 2,
    title: "TS · 성능 · 브라우저",
    description:
      "타입 시스템, 렌더링 성능, 브라우저 동작/네트워크 심화. (준비 중)",
    unlocked: false,
  },
];

export function packById(id: string): QuizPack | undefined {
  return packs.find((p) => p.id === id);
}
