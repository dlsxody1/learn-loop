import { registerSW } from "virtual:pwa-register";

/**
 * 서비스 워커 등록. autoUpdate 전략이라 새 버전이 받아지면 즉시 적용한다.
 * 새 버전 감지 시 가벼운 안내 토스트만 띄우고(블로킹 X), 다음 로드에서 반영된다.
 */
export function registerPwa(): void {
  if (import.meta.env.DEV) return; // dev에서는 SW 등록 생략(HMR 충돌 방지)

  registerSW({
    immediate: true,
    onNeedRefresh() {
      toast("새 버전이 적용되었습니다. 새로고침하면 반영됩니다.");
    },
    onOfflineReady() {
      toast("오프라인에서도 사용할 수 있어요.");
    },
  });
}

/** 의존성 없는 초경량 토스트 — 3초 후 자동 소멸. */
function toast(message: string): void {
  const el = document.createElement("div");
  el.textContent = message;
  el.setAttribute("role", "status");
  el.style.cssText = [
    "position:fixed",
    "left:50%",
    "bottom:calc(env(safe-area-inset-bottom) + 84px)",
    "transform:translateX(-50%)",
    "z-index:50",
    "max-width:90vw",
    "padding:10px 16px",
    "border-radius:11px",
    "background:#1d1d1f",
    "color:#fff",
    "font-size:14px",
    "letter-spacing:-0.224px",
    "box-shadow:0 6px 20px rgba(0,0,0,0.18)",
  ].join(";");
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}
