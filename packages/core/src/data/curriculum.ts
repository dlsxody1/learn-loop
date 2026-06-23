import type { CurriculumPhase, CurriculumWeek } from "../types";

export const phases: CurriculumPhase[] = [
  { id: "p0", name: "Phase 0", weeks: [1, 2, 3, 4], theme: "FE 기초 심화 — JS/TS 내부 동작 + 코드 품질" },
  { id: "p1", name: "Phase 1", weeks: [5, 6, 7, 8, 9], theme: "React + Next.js SSR + 성능 최적화" },
  { id: "p2", name: "Phase 2", weeks: [10, 11, 12], theme: "테스트 · 인프라 · AI-driven 워크플로우" },
  { id: "p3", name: "Phase 3", weeks: [13, 14, 15, 16], theme: "Android (Kotlin) 기초 + WebView" },
  { id: "p4", name: "Phase 4", weeks: [17, 18, 19, 20], theme: "iOS (Swift) 기초 + WKWebView" },
  { id: "p5", name: "Phase 5", weeks: [21, 22, 23], theme: "하이브리드 / JS 브릿지 (핵심 차별화)" },
  { id: "p6", name: "Phase 6", weeks: [24], theme: "코딩테스트 · 면접 · 포트폴리오" },
];

export const weeks: CurriculumWeek[] = [
  {
    week: 1, title: "JavaScript 엔진 & 런타임",
    goal: "실행 컨텍스트부터 이벤트 루프까지 JS 동작 원리를 설명할 수 있다.",
    items: [
      { text: "실행 컨텍스트, 호이스팅, 스코프 체인, 클로저" },
      { text: "이벤트 루프 / 태스크 큐 / 마이크로태스크 (Promise 동작)" },
      { text: "프로토타입 체인, this 바인딩 4규칙" },
    ],
    deliverable: "JS 동작 원리 정리 노트 + 직접 만든 Promise 폴리필",
  },
  {
    week: 2, title: "TypeScript 심화",
    goal: "제네릭·조건부·매핑드 타입으로 유틸리티 타입을 직접 구현한다.",
    items: [
      { text: "제네릭, 조건부 타입, 매핑드 타입, infer" },
      { text: "유틸리티 타입 구현 (Partial/Pick/Omit/Record)" },
      { text: "타입 내로잉, 판별 유니온, as const" },
    ],
    deliverable: "미니 유틸리티 타입 라이브러리 (테스트 포함)",
  },
  {
    week: 3, title: "코드 품질 4원칙 적용",
    goal: "가독성·예측가능성·응집도·결합도 기준으로 리팩토링한다.",
    items: [
      { text: "가독성: 매직넘버 상수화, 복잡 조건 네이밍" },
      { text: "예측 가능성: 반환 타입 통일, 숨은 사이드이펙트 제거" },
      { text: "응집도/결합도: 도메인 디렉토리, 단일 책임 Hook" },
    ],
    deliverable: "토이 프로젝트 4원칙 리팩토링 Before/After PR",
  },
  {
    week: 4, title: "Git 협업 & 브라우저 기초",
    goal: "PR 단위 협업과 브라우저 렌더링/네트워크 기본을 이해한다.",
    items: [
      { text: "Git Flow, 의미 있는 커밋, PR 쪼개기, 리뷰" },
      { text: "브라우저 렌더링 파이프라인, 리플로우/리페인트" },
      { text: "HTTP 캐싱, CORS, 쿠키/스토리지" },
    ],
    deliverable: "오픈소스 good-first-issue PR 시도",
  },
  {
    week: 5, title: "React 렌더링 모델 심화",
    goal: "렌더/커밋과 메모이제이션 적용 시점을 판단할 수 있다.",
    items: [
      { text: "렌더 vs 커밋, 리컨실리에이션, key의 역할" },
      { text: "useMemo/useCallback/memo — 언제 쓰고 말지" },
      { text: "커스텀 Hook 설계 (단일 관심사 분리)" },
    ],
    deliverable: "리렌더링 시각화 데모 + 최적화 Before/After",
  },
  {
    week: 6, title: "상태관리 & 데이터 페칭",
    goal: "전역 상태를 최소화하고 서버 상태를 TanStack Query로 다룬다.",
    items: [
      { text: "Zustand / Jotai 비교, 전역 상태 최소화" },
      { text: "TanStack Query: 캐싱/동기화/낙관적 업데이트" },
      { text: "React Hook Form + Zod 폼/검증" },
    ],
    deliverable: "일관 패턴의 데이터 레이어",
  },
  {
    week: 7, title: "Next.js App Router & 렌더링 전략",
    goal: "SSR/SSG/ISR/RSC를 상황에 맞게 선택한다.",
    items: [
      { text: "App Router, Server Components, Server Actions" },
      { text: "SSR/SSG/ISR/CSR 선택 기준, 스트리밍" },
      { text: "라우팅, 레이아웃, 메타데이터(SEO)" },
    ],
    deliverable: "App Router 기반 멀티페이지 앱 골격",
  },
  {
    week: 8, title: "성능 최적화 (Core Web Vitals)",
    goal: "LCP/CLS/INP를 측정하고 번들을 200KB 이하로 최적화한다.",
    items: [
      { text: "LCP/CLS/INP 측정 (Lighthouse, Web Vitals)" },
      { text: "코드 스플리팅, 동적 import, 지연 로딩" },
      { text: "이미지(next/image, WebP/AVIF)·폰트 최적화, Tree Shaking" },
    ],
    deliverable: "Lighthouse 성능 90+ 페이지",
  },
  {
    week: 9, title: "Node.js 프론트엔드 서버 (BFF)",
    goal: "BFF로 API 프록시·인증·SSR 데이터 패칭을 구성한다.",
    items: [
      { text: "Route Handlers / 간단한 Node BFF 서버" },
      { text: "API 프록시, 인증 토큰 처리, 에러 핸들링" },
      { text: "SSR 데이터 패칭과 캐싱 전략" },
    ],
    deliverable: "BFF를 갖춘 SSR 대시보드 + Vercel 배포",
  },
  {
    week: 10, title: "테스트 전략",
    goal: "단위·통합·E2E를 피라미드에 맞게 배치한다.",
    items: [
      { text: "Vitest + Testing Library (사용자 관점)" },
      { text: "Playwright E2E (시나리오/셀렉터/CI 연동)" },
      { text: "테스트 피라미드, 무엇을 테스트할지 판단" },
    ],
    deliverable: "E2E + 단위 테스트 커버리지 추가",
  },
  {
    week: 11, title: "Monorepo & CI/CD",
    goal: "Turborepo 구조와 GitHub Actions 파이프라인을 만든다.",
    items: [
      { text: "Turborepo(또는 Nx) 구조, 패키지 분리, 캐싱" },
      { text: "GitHub Actions: lint→test→build→deploy" },
      { text: "ESLint/Prettier, PR 자동 검사" },
    ],
    deliverable: "모노레포 + 자동 배포 파이프라인",
  },
  {
    week: 12, title: "AI-driven 개발 문화",
    goal: "코드·리뷰·테스트·리팩토링에 AI를 체계적으로 활용한다.",
    items: [
      { text: "AI로 코드 작성·리뷰·테스트·리팩토링 워크플로우" },
      { text: "효과적 프롬프트, 컨텍스트 제공, AI 코드 검증" },
      { text: "AI 활용 사례를 면접용 스토리로 정리" },
    ],
    deliverable: "AI 활용 개발 프로세스 회고 문서",
  },
  {
    week: 13, title: "Kotlin 언어",
    goal: "Kotlin 핵심 문법과 코루틴 기초를 익힌다.",
    items: [
      { text: "기본 문법, null 안전성, data class, 확장 함수" },
      { text: "코루틴 기초(비동기), 람다/고차함수" },
    ],
    deliverable: "Kotlin 콘솔 미니 프로젝트",
  },
  {
    week: 14, title: "Android 기초 & 생명주기",
    goal: "Activity/Fragment 생명주기와 Compose UI를 다룬다.",
    items: [
      { text: "Activity/Fragment 생명주기, Intent, 네비게이션" },
      { text: "Jetpack Compose 기본 UI, 상태 관리" },
    ],
    deliverable: "화면 2~3개 Compose 앱",
  },
  {
    week: 15, title: "Android 네트워킹 & 데이터",
    goal: "Retrofit으로 REST를 호출하고 로컬에 저장한다.",
    items: [
      { text: "Retrofit/OkHttp REST 호출, JSON 파싱" },
      { text: "DataStore 로컬 저장, 권한 처리" },
    ],
    deliverable: "API 연동 리스트 화면 앱",
  },
  {
    week: 16, title: "Android WebView",
    goal: "WebView 로딩과 JS 인터페이스 기본을 구성한다.",
    items: [
      { text: "WebView 설정, JS 활성화, 로딩/에러 처리" },
      { text: "addJavascriptInterface 기본, 쿠키/세션 공유" },
    ],
    deliverable: "웹 페이지를 띄우는 WebView 앱",
  },
  {
    week: 17, title: "Swift 언어",
    goal: "옵셔널·프로토콜·async/await 등 Swift 핵심을 익힌다.",
    items: [
      { text: "옵셔널, struct/class, 프로토콜, 클로저" },
      { text: "async/await, 에러 처리" },
    ],
    deliverable: "Swift 플레이그라운드 미니 프로젝트",
  },
  {
    week: 18, title: "iOS 기초 & 생명주기",
    goal: "SwiftUI 상태/네비게이션과 뷰 생명주기를 이해한다.",
    items: [
      { text: "SwiftUI 기본 뷰, @State/@Binding, 네비게이션" },
      { text: "뷰 생명주기, UIKit 개념 비교" },
    ],
    deliverable: "화면 2~3개 SwiftUI 앱",
  },
  {
    week: 19, title: "iOS 네트워킹 & 데이터",
    goal: "URLSession+Codable로 통신하고 안전하게 저장한다.",
    items: [
      { text: "URLSession REST 호출, Codable 파싱" },
      { text: "UserDefaults/Keychain, 권한 처리" },
    ],
    deliverable: "API 연동 리스트 화면 앱",
  },
  {
    week: 20, title: "iOS WKWebView",
    goal: "WKWebView 델리게이트와 메시지 핸들러를 구성한다.",
    items: [
      { text: "WKWebView 설정, 로딩/내비게이션 델리게이트" },
      { text: "WKScriptMessageHandler 기본, 쿠키 공유" },
    ],
    deliverable: "웹 페이지를 띄우는 WKWebView 앱",
  },
  {
    week: 21, title: "JS 브릿지 양방향 통신",
    goal: "Web↔Native 양방향 호출을 추상화한 브릿지를 설계한다.",
    items: [
      { text: "Web→Native 호출 (JavascriptInterface / messageHandler)" },
      { text: "Native→Web 호출 (evaluateJavascript)" },
      { text: "공통 브릿지 인터페이스(이름/파라미터/콜백) 일관성" },
    ],
    deliverable: "플랫폼 추상화 브릿지 SDK 초안",
  },
  {
    week: 22, title: "하이브리드 실전 이슈",
    goal: "토큰 공유·딥링크·WebView 성능 이슈를 해결한다.",
    items: [
      { text: "인증 토큰/세션 공유, 딥링크 처리" },
      { text: "WebView 성능·캐싱, 오프라인, safe area" },
      { text: "원격 디버깅, 플랫폼 분기 최소화" },
    ],
    deliverable: "토큰 공유 + 딥링크 하이브리드 샘플",
  },
  {
    week: 23, title: "캡스톤: 결제·리워드 하이브리드 앱",
    goal: "웹(SSR)+Android+iOS를 공통 브릿지로 통합한 데모를 만든다.",
    items: [
      { text: "Next.js(SSR) 웹뷰 + Android/iOS 셸 + 공통 브릿지" },
      { text: "리워드 적립/광고 노출 LINE Pay 시나리오 1개" },
      { text: "성능 측정 + E2E + GitHub Actions 배포 통합" },
    ],
    deliverable: "포트폴리오 핵심 프로젝트 (통합 데모 + README + 영상)",
  },
  {
    week: 24, title: "코딩테스트 · 면접 · 포트폴리오",
    goal: "전형(코테/면접)을 실전 정렬하고 제출본을 완성한다.",
    items: [
      { text: "알고리즘 코테 루틴화 (자료구조·문자열·구현)" },
      { text: "FE 심화 면접 예상질문 정리" },
      { text: "포트폴리오/이력서를 JD 키워드에 매핑" },
      { text: "영어 1분 자기소개 + 기술 설명 1개" },
    ],
    deliverable: "제출용 이력서·포트폴리오 + 면접 Q&A 노트",
  },
];

export function phaseOfWeek(week: number): CurriculumPhase | undefined {
  return phases.find((p) => p.weeks.includes(week));
}
