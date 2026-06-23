interface ProgressBarProps {
  value: number; // 0~100
  label?: string;
}

export function ProgressBar({ value, label }: ProgressBarProps) {
  return (
    <div>
      {label && (
        <div className="mb-2 flex items-baseline justify-between">
          <span className="text-[14px] text-ink-48">{label}</span>
          <span className="text-[14px] text-ink">{value}%</span>
        </div>
      )}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-divider">
        <div
          className="h-full rounded-full bg-action transition-[width] duration-500 ease-out"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
