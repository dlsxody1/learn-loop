import type { Problem } from "@/types";

/**
 * 주차별 문제 은행. 매주 알고리즘 1 + 프론트엔드 개념 1을 기본으로 한다.
 * 알고리즘은 JS/TS 풀이를 가정. 개념 문제는 글/코드로 답을 적는다.
 */
export const problems: Problem[] = [
  // ── Week 1 ──────────────────────────────────────────────
  {
    id: "w1-algo", week: 1, category: "algorithm", difficulty: "easy",
    title: "두 수의 합 (Two Sum)",
    prompt:
      "정수 배열 nums와 목표값 target이 주어진다. 더해서 target이 되는 두 원소의 인덱스를 반환하라. 시간복잡도 O(n)으로 풀어보라.",
    starter: "function twoSum(nums: number[], target: number): [number, number] {\n  // TODO\n}\n",
    tags: ["해시맵", "코딩테스트"],
    hint: "값→인덱스 해시맵을 만들며 target - num이 이미 있는지 확인하면 한 번의 순회로 O(n).",
  },
  {
    id: "w1-fe", week: 1, category: "fe-concept", difficulty: "medium",
    title: "이벤트 루프 출력 순서",
    prompt:
      "console.log('A'); setTimeout(()=>log('B')); Promise.resolve().then(()=>log('C')); console.log('D'); 의 출력 순서와 그 이유를 콜스택/마이크로태스크/매크로태스크로 설명하라.",
    tags: ["이벤트 루프", "Promise", "면접"],
    hint: "동기(A,D) → 마이크로태스크(C) → 매크로태스크(B). 순서: A D C B.",
  },
  // ── Week 2 ──────────────────────────────────────────────
  {
    id: "w2-algo", week: 2, category: "algorithm", difficulty: "easy",
    title: "유효한 괄호 (Valid Parentheses)",
    prompt: "'()[]{}' 같은 괄호 문자열이 올바르게 짝지어졌는지 스택으로 판별하라.",
    starter: "function isValid(s: string): boolean {\n  // TODO\n}\n",
    tags: ["스택", "코딩테스트"],
    hint: "여는 괄호는 push, 닫는 괄호는 top과 매칭 확인 후 pop. 끝에 스택이 비어야 유효.",
  },
  {
    id: "w2-fe", week: 2, category: "fe-concept", difficulty: "hard",
    title: "유틸리티 타입 직접 구현",
    prompt:
      "TypeScript에서 내장 Pick<T,K>와 Omit<T,K>를 직접 구현하라. 매핑드 타입과 keyof/extends를 사용한다.",
    starter:
      "type MyPick<T, K extends keyof T> = /* TODO */;\ntype MyOmit<T, K extends keyof T> = /* TODO */;\n",
    tags: ["TypeScript", "매핑드 타입"],
    hint: "MyPick = { [P in K]: T[P] }. MyOmit = MyPick<T, Exclude<keyof T, K>>.",
  },
  // ── Week 3 ──────────────────────────────────────────────
  {
    id: "w3-algo", week: 3, category: "algorithm", difficulty: "medium",
    title: "가장 긴 중복 없는 부분 문자열",
    prompt: "문자열에서 중복 문자가 없는 가장 긴 부분 문자열의 길이를 슬라이딩 윈도우로 구하라.",
    starter: "function lengthOfLongestSubstring(s: string): number {\n  // TODO\n}\n",
    tags: ["슬라이딩 윈도우", "투 포인터"],
    hint: "left 포인터와 마지막 등장 인덱스 맵을 유지하며 중복 시 left를 점프.",
  },
  {
    id: "w3-fe", week: 3, category: "fe-concept", difficulty: "medium",
    title: "리팩토링: 복잡한 조건에 이름 붙이기",
    prompt:
      "if (user.age >= 19 && user.verified && !user.banned && cart.total >= 30000) {...} 를 가독성 4원칙에 따라 의미 있는 boolean 변수로 분해하라.",
    starter:
      "const canCheckout = /* TODO: isAdult && isVerified && ... */;\nif (canCheckout) {\n}\n",
    tags: ["코드 품질", "가독성"],
    hint: "isAdult, isVerifiedUser, isActiveAccount, isFreeShippingEligible 등으로 명명 후 조합.",
  },
  // ── Week 4 ──────────────────────────────────────────────
  {
    id: "w4-algo", week: 4, category: "algorithm", difficulty: "medium",
    title: "이진 탐색",
    prompt: "정렬된 배열에서 target의 인덱스를 O(log n)에 찾고, 없으면 -1을 반환하라.",
    starter: "function search(nums: number[], target: number): number {\n  // TODO\n}\n",
    tags: ["이진 탐색", "코딩테스트"],
    hint: "lo/hi 포인터, mid = (lo+hi)>>1. 오버플로 걱정 없는 JS지만 습관적으로 lo+((hi-lo)>>1).",
  },
  {
    id: "w4-fe", week: 4, category: "fe-concept", difficulty: "medium",
    title: "리플로우 vs 리페인트",
    prompt:
      "리플로우(reflow)와 리페인트(repaint)의 차이를 설명하고, 리플로우를 유발하는 속성 3가지와 이를 줄이는 기법 2가지를 적어라.",
    tags: ["브라우저 렌더링", "성능", "면접"],
    hint: "레이아웃 변경(width/top/font-size)=리플로우, 색상 변경=리페인트. transform/opacity는 합성만. 배치 변경·DocumentFragment·읽기/쓰기 분리.",
  },
  // ── Week 5 ──────────────────────────────────────────────
  {
    id: "w5-algo", week: 5, category: "algorithm", difficulty: "medium",
    title: "배열 회전",
    prompt: "정수 배열을 오른쪽으로 k칸 회전하라. 추가 배열 없이 O(1) 공간으로 해보라(뒤집기 3번).",
    starter: "function rotate(nums: number[], k: number): void {\n  // TODO (in-place)\n}\n",
    tags: ["배열", "투 포인터"],
    hint: "k %= n 후 전체 뒤집기 → 앞 k개 뒤집기 → 나머지 뒤집기.",
  },
  {
    id: "w5-fe", week: 5, category: "fe-concept", difficulty: "hard",
    title: "useMemo가 오히려 손해인 경우",
    prompt:
      "useMemo/useCallback이 성능에 도움이 되지 않거나 오히려 해로운 상황을 예시와 함께 2가지 설명하라.",
    tags: ["React", "렌더링 최적화", "면접"],
    hint: "계산이 가벼울 때(메모이제이션 비용>이득), 의존성이 매 렌더 바뀔 때. memo 안 된 자식에 useCallback 전달 시 무의미.",
  },
  // ── Week 6 ──────────────────────────────────────────────
  {
    id: "w6-algo", week: 6, category: "algorithm", difficulty: "medium",
    title: "애너그램 그룹화",
    prompt: "문자열 배열을 애너그램끼리 묶어 2차원 배열로 반환하라.",
    starter: "function groupAnagrams(strs: string[]): string[][] {\n  // TODO\n}\n",
    tags: ["해시맵", "정렬"],
    hint: "정렬한 문자열을 키로 하는 Map<string, string[]>에 그룹화.",
  },
  {
    id: "w6-fe", week: 6, category: "fe-concept", difficulty: "medium",
    title: "서버 상태 vs 클라이언트 상태",
    prompt:
      "서버 상태(TanStack Query)와 클라이언트 상태(Jotai/useState)를 구분하는 기준을 설명하고, 폼 입력값을 전역 atom에 두면 안 되는 이유를 적어라.",
    tags: ["상태관리", "TanStack Query", "면접"],
    hint: "서버 소유·캐시·동기화 필요=서버 상태. 입력값을 atom에 두면 키 입력마다 리렌더(제어 컴포넌트화). RHF가 출처.",
  },
  // ── Week 7 ──────────────────────────────────────────────
  {
    id: "w7-algo", week: 7, category: "algorithm", difficulty: "medium",
    title: "구간 병합 (Merge Intervals)",
    prompt: "겹치는 구간들을 병합하여 반환하라. 예: [[1,3],[2,6],[8,10]] → [[1,6],[8,10]].",
    starter: "function merge(intervals: number[][]): number[][] {\n  // TODO\n}\n",
    tags: ["정렬", "그리디"],
    hint: "시작점 기준 정렬 후, 직전 구간의 end와 현재 start를 비교하며 병합.",
  },
  {
    id: "w7-fe", week: 7, category: "fe-concept", difficulty: "hard",
    title: "SSR / SSG / ISR / CSR 선택",
    prompt:
      "각 렌더링 전략의 장단점과, '대규모 트래픽 광고/리워드 페이지'에 어떤 전략을 왜 택할지 설명하라.",
    tags: ["Next.js", "SSR", "면접"],
    hint: "정적+자주 안 바뀜=SSG, 주기적=ISR, 요청별 개인화=SSR, 인터랙션 무거움=CSR. 광고 노출 카운팅은 캐시+엣지 고려.",
  },
  // ── Week 8 ──────────────────────────────────────────────
  {
    id: "w8-algo", week: 8, category: "algorithm", difficulty: "medium",
    title: "최대 부분합 (Kadane)",
    prompt: "연속 부분 배열의 최대 합을 O(n)에 구하라.",
    starter: "function maxSubArray(nums: number[]): number {\n  // TODO\n}\n",
    tags: ["DP", "코딩테스트"],
    hint: "cur = max(num, cur+num), best = max(best, cur).",
  },
  {
    id: "w8-fe", week: 8, category: "fe-concept", difficulty: "hard",
    title: "CLS를 줄이는 방법",
    prompt:
      "Cumulative Layout Shift가 발생하는 흔한 원인 3가지와 각각의 해결책을 적어라. 목표 CLS < 0.1.",
    tags: ["Core Web Vitals", "성능", "면접"],
    hint: "이미지 width/height 미지정→aspect-ratio, 웹폰트 FOIT→font-display:swap+size-adjust, 동적 삽입 광고→공간 예약.",
  },
  // ── Week 9 ──────────────────────────────────────────────
  {
    id: "w9-algo", week: 9, category: "algorithm", difficulty: "medium",
    title: "LRU 캐시 설계",
    prompt: "get/put이 O(1)인 LRU 캐시를 구현하라. (Map의 삽입 순서 활용 가능)",
    starter: "class LRUCache {\n  constructor(capacity: number) {}\n  get(key: number): number { return -1; }\n  put(key: number, value: number): void {}\n}\n",
    tags: ["해시맵", "연결 리스트", "설계"],
    hint: "JS Map은 삽입 순서 유지 → get 시 delete 후 재삽입, 초과 시 첫 키 제거.",
  },
  {
    id: "w9-fe", week: 9, category: "fe-concept", difficulty: "medium",
    title: "BFF 패턴이 필요한 이유",
    prompt:
      "Backend-for-Frontend 패턴이 해결하는 문제(인증 토큰 은닉, 응답 가공, CORS 등)를 설명하고 SPA 직접 호출 대비 장점을 적어라.",
    tags: ["Node.js", "아키텍처", "면접"],
    hint: "토큰을 httpOnly로 서버 보관, 여러 API 조합/가공, 클라 번들 축소, CORS 우회, SSR 데이터 패칭.",
  },
  // ── Week 10 ─────────────────────────────────────────────
  {
    id: "w10-algo", week: 10, category: "algorithm", difficulty: "easy",
    title: "디바운스 구현",
    prompt: "함수 호출을 delay만큼 지연시키고 연속 호출 시 마지막 것만 실행하는 debounce를 구현하라.",
    starter: "function debounce<T extends (...a: any[]) => void>(fn: T, delay: number): T {\n  // TODO\n}\n",
    tags: ["클로저", "타이머"],
    hint: "클로저로 timer 보관, 호출 시 clearTimeout 후 setTimeout 재설정.",
  },
  {
    id: "w10-fe", week: 10, category: "fe-concept", difficulty: "medium",
    title: "테스트 피라미드 & E2E 범위",
    prompt:
      "단위/통합/E2E 비율을 어떻게 가져갈지, 그리고 Playwright E2E로는 무엇을 검증하고 무엇을 검증하지 말아야 하는지 설명하라.",
    tags: ["테스트", "Playwright", "면접"],
    hint: "단위 多·E2E 少. E2E는 핵심 사용자 플로우(로그인→결제)만. 세부 로직/엣지케이스는 단위로.",
  },
  // ── Week 11 ─────────────────────────────────────────────
  {
    id: "w11-algo", week: 11, category: "algorithm", difficulty: "medium",
    title: "위상 정렬 (빌드 순서)",
    prompt: "모듈 의존성 그래프가 주어질 때 빌드 가능한 순서를 위상 정렬로 반환하라. 사이클이면 빈 배열.",
    starter: "function buildOrder(n: number, deps: [number, number][]): number[] {\n  // TODO\n}\n",
    tags: ["그래프", "BFS", "위상정렬"],
    hint: "진입차수 계산 → 0인 노드부터 큐 → 인접 노드 차수 감소. 처리 수 < n이면 사이클.",
  },
  {
    id: "w11-fe", week: 11, category: "fe-concept", difficulty: "medium",
    title: "Monorepo 캐싱의 원리",
    prompt:
      "Turborepo/Nx의 태스크 캐싱이 어떻게 동작하는지(입력 해시→출력 캐시) 설명하고, CI 시간을 줄이는 이유를 적어라.",
    tags: ["Monorepo", "CI/CD", "면접"],
    hint: "입력(소스+의존성+설정) 해시가 같으면 이전 출력 재사용. 변경된 패키지만 재빌드(affected).",
  },
  // ── Week 12 ─────────────────────────────────────────────
  {
    id: "w12-algo", week: 12, category: "algorithm", difficulty: "medium",
    title: "깊은 복사 (Deep Clone)",
    prompt: "중첩 객체/배열/순환 참조를 안전하게 처리하는 deepClone을 구현하라.",
    starter: "function deepClone<T>(value: T, seen = new WeakMap()): T {\n  // TODO\n}\n",
    tags: ["재귀", "WeakMap"],
    hint: "원시값 즉시 반환, WeakMap으로 순환 참조 방지, 배열/객체 분기 재귀.",
  },
  {
    id: "w12-fe", week: 12, category: "fe-concept", difficulty: "medium",
    title: "AI 생성 코드 검증 루틴",
    prompt:
      "AI가 생성한 코드를 머지하기 전 반드시 거치는 검증 단계를 본인 워크플로우로 정리하라(타입·테스트·리뷰 관점).",
    tags: ["AI-driven", "코드 리뷰"],
    hint: "타입체크→단위테스트→의도·엣지케이스 직접 검토→보안(입력검증)→diff 리뷰. 면접 답변 소재로 정리.",
  },
  // ── Week 13 ─────────────────────────────────────────────
  {
    id: "w13-algo", week: 13, category: "algorithm", difficulty: "easy",
    title: "피보나치 (메모이제이션)",
    prompt: "n번째 피보나치를 메모이제이션으로 O(n)에 구하라. (Kotlin로도 작성해보기)",
    starter: "function fib(n: number, memo = new Map<number, number>()): number {\n  // TODO\n}\n",
    tags: ["DP", "재귀"],
    hint: "memo에 캐시. Kotlin은 mutableMapOf로 동일 패턴.",
  },
  {
    id: "w13-fe", week: 13, category: "fe-concept", difficulty: "easy",
    title: "Kotlin null 안전성",
    prompt:
      "Kotlin의 ?., ?:, !!, let의 차이를 설명하고, Java 대비 NPE를 어떻게 줄이는지 적어라.",
    tags: ["Kotlin", "Native"],
    hint: "?.=안전 호출, ?:=엘비스 기본값, !!=강제 언랩(위험), x?.let{}=non-null일 때 블록 실행.",
  },
  // ── Week 14 ─────────────────────────────────────────────
  {
    id: "w14-algo", week: 14, category: "algorithm", difficulty: "medium",
    title: "트리 레벨 순회 (BFS)",
    prompt: "이진 트리를 레벨별로 묶어 2차원 배열로 반환하라.",
    starter: "function levelOrder(root: TreeNode | null): number[][] {\n  // TODO\n}\n",
    tags: ["트리", "BFS", "큐"],
    hint: "큐에 노드, 각 레벨 크기만큼 반복하며 자식 push.",
  },
  {
    id: "w14-fe", week: 14, category: "fe-concept", difficulty: "medium",
    title: "Activity 생명주기 vs React 마운트",
    prompt:
      "Android Activity 생명주기(onCreate~onDestroy)를 React 컴포넌트 마운트/언마운트/리렌더와 대응시켜 설명하라.",
    tags: ["Android", "Native", "면접"],
    hint: "onCreate≈mount, onResume/onPause≈visibility, onDestroy≈unmount. 회전 시 재생성 vs React state 보존 차이.",
  },
  // ── Week 15 ─────────────────────────────────────────────
  {
    id: "w15-algo", week: 15, category: "algorithm", difficulty: "medium",
    title: "JSON 평탄화 (Flatten)",
    prompt: "중첩 객체를 'a.b.c' 형태의 단일 깊이 객체로 평탄화하라.",
    starter: "function flatten(obj: Record<string, any>, prefix = ''): Record<string, any> {\n  // TODO\n}\n",
    tags: ["재귀", "객체"],
    hint: "값이 객체면 prefix 이어 재귀, 아니면 결과에 할당.",
  },
  {
    id: "w15-fe", week: 15, category: "fe-concept", difficulty: "easy",
    title: "REST 통신 에러 처리 계층",
    prompt:
      "네트워크 호출에서 발생할 수 있는 에러 유형(타임아웃, 4xx, 5xx, 파싱)별 처리 전략을 클라이언트 관점으로 정리하라.",
    tags: ["네트워크", "에러 처리"],
    hint: "타임아웃=재시도/취소, 401=토큰 갱신, 4xx=사용자 안내, 5xx=백오프 재시도+토스트, 파싱=스키마 검증(zod).",
  },
  // ── Week 16 ─────────────────────────────────────────────
  {
    id: "w16-algo", week: 16, category: "algorithm", difficulty: "medium",
    title: "쿼리스트링 파서",
    prompt: "'?a=1&b=2&a=3' 같은 쿼리스트링을 객체로 파싱하라(중복 키는 배열).",
    starter: "function parseQuery(qs: string): Record<string, string | string[]> {\n  // TODO\n}\n",
    tags: ["문자열", "파싱"],
    hint: "? 제거→&로 split→=로 분리→decodeURIComponent→중복 키 배열화.",
  },
  {
    id: "w16-fe", week: 16, category: "fe-concept", difficulty: "hard",
    title: "WebView에 쿠키/세션 공유하기",
    prompt:
      "네이티브 앱이 보유한 로그인 세션을 WebView 내 웹 페이지에 안전하게 전달하는 방법과 보안 주의점을 설명하라.",
    tags: ["WebView", "하이브리드", "보안"],
    hint: "CookieManager로 도메인 쿠키 주입 or 브릿지로 토큰 전달. httpOnly·https·도메인 검증, 토큰 평문 노출 방지.",
  },
  // ── Week 17 ─────────────────────────────────────────────
  {
    id: "w17-algo", week: 17, category: "algorithm", difficulty: "medium",
    title: "계단 오르기 (DP)",
    prompt: "한 번에 1 또는 2칸 오를 때 n칸 계단을 오르는 경우의 수를 구하라.",
    starter: "function climbStairs(n: number): number {\n  // TODO\n}\n",
    tags: ["DP", "피보나치"],
    hint: "dp[n] = dp[n-1] + dp[n-2]. 두 변수로 O(1) 공간.",
  },
  {
    id: "w17-fe", week: 17, category: "fe-concept", difficulty: "medium",
    title: "Swift 옵셔널 vs TS의 null/undefined",
    prompt:
      "Swift Optional(?)과 TypeScript의 null/undefined·옵셔널 체이닝을 비교하고, 강제 언래핑의 위험을 설명하라.",
    tags: ["Swift", "Native", "면접"],
    hint: "Swift Optional은 enum(.some/.none). guard let/if let=안전 언랩. !는 nil이면 크래시. TS ?.와 유사하나 타입 강제.",
  },
  // ── Week 18 ─────────────────────────────────────────────
  {
    id: "w18-algo", week: 18, category: "algorithm", difficulty: "medium",
    title: "이벤트 emitter 구현",
    prompt: "on/off/emit을 지원하는 간단한 이벤트 emitter를 구현하라.",
    starter: "class EventEmitter {\n  on(e: string, fn: Function): void {}\n  off(e: string, fn: Function): void {}\n  emit(e: string, ...args: any[]): void {}\n}\n",
    tags: ["설계", "옵저버 패턴"],
    hint: "Map<string, Set<Function>>로 핸들러 관리. emit 시 복사본 순회로 안전하게.",
  },
  {
    id: "w18-fe", week: 18, category: "fe-concept", difficulty: "medium",
    title: "SwiftUI @State vs React useState",
    prompt:
      "SwiftUI의 @State/@Binding/@ObservedObject를 React의 useState/props/외부 스토어와 대응시켜 설명하라.",
    tags: ["SwiftUI", "Native", "면접"],
    hint: "@State≈useState(뷰 소유), @Binding≈상태+setter props 전달, @ObservedObject≈외부 스토어 구독.",
  },
  // ── Week 19 ─────────────────────────────────────────────
  {
    id: "w19-algo", week: 19, category: "algorithm", difficulty: "medium",
    title: "재시도 with 지수 백오프",
    prompt: "실패 시 지수적으로 간격을 늘려 최대 n회 재시도하는 비동기 retry 함수를 구현하라.",
    starter: "async function retry<T>(fn: () => Promise<T>, retries: number, base = 200): Promise<T> {\n  // TODO\n}\n",
    tags: ["비동기", "네트워크"],
    hint: "for 루프 + try/catch, 실패 시 await sleep(base * 2**i), 마지막엔 throw.",
  },
  {
    id: "w19-fe", week: 19, category: "fe-concept", difficulty: "medium",
    title: "토큰 안전 저장: Keychain vs localStorage",
    prompt:
      "iOS Keychain, Android Keystore, 웹 localStorage/쿠키의 보안 특성을 비교하고 토큰 저장 위치 권고안을 적어라.",
    tags: ["보안", "Native", "면접"],
    hint: "Keychain/Keystore=OS 암호화 저장(권장). 웹 localStorage=XSS 취약, httpOnly 쿠키=XSS 안전하나 CSRF 대비 필요.",
  },
  // ── Week 20 ─────────────────────────────────────────────
  {
    id: "w20-algo", week: 20, category: "algorithm", difficulty: "hard",
    title: "Promise.all 직접 구현",
    prompt: "입력 Promise 배열이 모두 성공하면 결과 배열을, 하나라도 실패하면 즉시 reject하는 promiseAll을 구현하라.",
    starter: "function promiseAll<T>(promises: Promise<T>[]): Promise<T[]> {\n  // TODO\n}\n",
    tags: ["Promise", "비동기"],
    hint: "결과 배열+카운터, 각 index에 결과 저장, 카운터==length면 resolve, 하나라도 catch면 reject.",
  },
  {
    id: "w20-fe", week: 20, category: "fe-concept", difficulty: "hard",
    title: "WKScriptMessageHandler 통신 흐름",
    prompt:
      "iOS WKWebView에서 웹→네이티브 메시지가 전달되는 전체 흐름(JS의 window.webkit.messageHandlers → 네이티브 핸들러)을 설명하라.",
    tags: ["WKWebView", "하이브리드", "면접"],
    hint: "WKUserContentController에 핸들러 등록 → JS가 messageHandlers.<name>.postMessage(payload) → didReceive로 수신.",
  },
  // ── Week 21 ─────────────────────────────────────────────
  {
    id: "w21-algo", week: 21, category: "algorithm", difficulty: "hard",
    title: "양방향 RPC 메시지 매칭",
    prompt:
      "Web↔Native 브릿지에서 요청에 고유 id를 부여하고, 응답이 오면 대기 중인 Promise를 resolve하는 RPC 디스패처를 구현하라.",
    starter: "class Bridge {\n  private pending = new Map<string, (v: any) => void>();\n  call(method: string, params: any): Promise<any> { /* TODO */ return Promise.reject(); }\n  onMessage(id: string, result: any): void { /* TODO */ }\n}\n",
    tags: ["설계", "하이브리드", "Promise"],
    hint: "call: id 생성→pending.set(id, resolve)→네이티브 전송. onMessage: pending.get(id) 호출 후 delete.",
  },
  {
    id: "w21-fe", week: 21, category: "fe-concept", difficulty: "hard",
    title: "브릿지 인터페이스를 플랫폼 추상화하기",
    prompt:
      "Android(JavascriptInterface)와 iOS(messageHandler)의 호출 방식 차이를 하나의 공통 JS API로 추상화하는 설계를 제시하라.",
    tags: ["하이브리드", "아키텍처", "예측가능성"],
    hint: "공통 postToNative(method, params) 래퍼가 플랫폼 감지 후 분기. 콜백/Promise 반환 형태 통일(예측가능성).",
  },
  // ── Week 22 ─────────────────────────────────────────────
  {
    id: "w22-algo", week: 22, category: "algorithm", difficulty: "medium",
    title: "딥링크 라우트 매칭",
    prompt:
      "'/pay/reward/:id' 같은 패턴과 실제 경로 '/pay/reward/42'를 매칭해 params를 추출하는 매처를 구현하라.",
    starter: "function matchRoute(pattern: string, path: string): Record<string, string> | null {\n  // TODO\n}\n",
    tags: ["문자열", "라우팅", "하이브리드"],
    hint: "둘 다 / 로 split, 길이 비교, :로 시작하면 params에 저장, 아니면 동일성 확인.",
  },
  {
    id: "w22-fe", week: 22, category: "fe-concept", difficulty: "hard",
    title: "WebView 성능 체감 개선",
    prompt:
      "하이브리드 앱에서 WebView 첫 로딩 체감 속도를 높이는 기법 4가지를 적어라(프리로드/캐시/스플래시/리소스 번들 등).",
    tags: ["WebView", "성능", "면접"],
    hint: "WebView 워밍업(프리로드), 정적 리소스 앱 번들 동봉, 서비스워커 캐시, 스켈레톤/스플래시로 체감 단축, 코드 스플리팅.",
  },
  // ── Week 23 ─────────────────────────────────────────────
  {
    id: "w23-algo", week: 23, category: "algorithm", difficulty: "hard",
    title: "이벤트 throttle (rAF 기반)",
    prompt: "스크롤/리워드 노출 추적처럼 고빈도 이벤트를 requestAnimationFrame 기반으로 throttle하는 함수를 구현하라.",
    starter: "function rafThrottle<T extends (...a: any[]) => void>(fn: T): T {\n  // TODO\n}\n",
    tags: ["성능", "타이머", "rAF"],
    hint: "ticking 플래그, rAF 안에서 fn 실행 후 플래그 해제. 프레임당 1회.",
  },
  {
    id: "w23-fe", week: 23, category: "fe-concept", difficulty: "hard",
    title: "캡스톤 아키텍처 설명",
    prompt:
      "결제·리워드 하이브리드 캡스톤의 아키텍처(웹 SSR + 네이티브 셸 + 공통 브릿지 + BFF)를 면접에서 3분 안에 설명할 스크립트를 작성하라.",
    tags: ["아키텍처", "포트폴리오", "면접"],
    hint: "문제→선택한 구조→트레이드오프(왜 WebView/왜 SSR)→성과(LCP, 코드 재사용률) 순으로 스토리화.",
  },
  // ── Week 24 ─────────────────────────────────────────────
  {
    id: "w24-algo", week: 24, category: "algorithm", difficulty: "hard",
    title: "동시성 제한 비동기 풀",
    prompt: "최대 동시 실행 수 limit을 지키며 작업 큐를 처리하는 asyncPool을 구현하라.",
    starter: "async function asyncPool<T, R>(limit: number, items: T[], fn: (t: T) => Promise<R>): Promise<R[]> {\n  // TODO\n}\n",
    tags: ["비동기", "동시성", "설계"],
    hint: "실행 중 Promise 집합 유지, limit 도달 시 Promise.race로 하나 완료 대기 후 다음 투입.",
  },
  {
    id: "w24-fe", week: 24, category: "fe-concept", difficulty: "medium",
    title: "영어 1분 자기소개 스크립트",
    prompt:
      "LINE Pay Hybrid Engineer 면접용 영어 1분 자기소개를 작성하라. FE 강점 + 하이브리드 경험 + AI-driven 개발을 포함.",
    tags: ["면접", "글로벌", "커뮤니케이션"],
    hint: "Background → core strength(FE+architecture) → hybrid/native project → how you use AI in dev → why LINE Pay.",
  },
];

export function problemsOfWeek(week: number): Problem[] {
  return problems.filter((p) => p.week === week);
}
