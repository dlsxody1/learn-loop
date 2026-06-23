import { buildAlarmIcs } from "@learnloop/core";

/** 코어의 순수 ICS 텍스트를 Blob으로 만들어 다운로드시킨다(웹 전용 부수효과). */
export function downloadAlarmIcs(): void {
  const ics = buildAlarmIcs();
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "learnloop-study-alarm.ics";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
