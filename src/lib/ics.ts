/**
 * 매일 학습 알람용 ICS(iCalendar) 텍스트 생성 + 다운로드.
 * 아침 09:00 / 저녁 22:00 KST 매일 반복 이벤트에 정시 VALARM을 단다.
 * iOS/Android 기본 캘린더 앱이 잠금화면 알림으로 띄워준다.
 */

interface AlarmEvent {
  uid: string;
  summary: string;
  description: string;
  hour: number; // KST 기준 시
  minute: number;
}

const TZID = "Asia/Seoul";

const EVENTS: AlarmEvent[] = [
  {
    uid: "learnloop-morning@learnloop.app",
    summary: "LearnLoop 아침 학습 🌅",
    description: "아침 퀴즈를 풀고 하루를 시작하세요.",
    hour: 9,
    minute: 0,
  },
  {
    uid: "learnloop-evening@learnloop.app",
    summary: "LearnLoop 저녁 학습 🌙",
    description: "저녁 퀴즈로 오늘 학습을 복습하세요.",
    hour: 22,
    minute: 0,
  },
];

const pad = (n: number) => String(n).padStart(2, "0");

/** 오늘 날짜(로컬)를 기준으로 YYYYMMDD를 만든다. */
function todayYmd(now: Date): string {
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
}

/** Asia/Seoul VTIMEZONE 블록 (KST 고정 +09:00, DST 없음). */
const VTIMEZONE = [
  "BEGIN:VTIMEZONE",
  `TZID:${TZID}`,
  "BEGIN:STANDARD",
  "DTSTART:19700101T000000",
  "TZOFFSETFROM:+0900",
  "TZOFFSETTO:+0900",
  "TZNAME:KST",
  "END:STANDARD",
  "END:VTIMEZONE",
].join("\r\n");

function vevent(e: AlarmEvent, ymd: string): string {
  const start = `${ymd}T${pad(e.hour)}${pad(e.minute)}00`;
  return [
    "BEGIN:VEVENT",
    `UID:${e.uid}`,
    `DTSTART;TZID=${TZID}:${start}`,
    `DURATION:PT15M`,
    "RRULE:FREQ=DAILY",
    `SUMMARY:${e.summary}`,
    `DESCRIPTION:${e.description}`,
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "TRIGGER:-PT0M",
    `DESCRIPTION:${e.summary}`,
    "END:VALARM",
    "END:VEVENT",
  ].join("\r\n");
}

/** 전체 ICS 텍스트 생성 (순수 함수). */
export function buildAlarmIcs(now: Date = new Date()): string {
  const ymd = todayYmd(now);
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//LearnLoop//Daily Study Alarm//KO",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    VTIMEZONE,
    ...EVENTS.map((e) => vevent(e, ymd)),
    "END:VCALENDAR",
  ].join("\r\n");
}

/** ICS를 Blob으로 만들어 다운로드시킨다. */
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
