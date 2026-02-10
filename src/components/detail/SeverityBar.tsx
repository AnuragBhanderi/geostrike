'use client';

import { severityColor } from '@/lib/utils';

interface SeverityBarProps {
  value: number;
}

export default function SeverityBar({ value }: SeverityBarProps) {
  const color = severityColor(value);

  return (
    <div className="h-1 bg-bg-3 rounded-sm mt-1.5 overflow-hidden">
      <div
        className="h-full rounded-sm transition-[width] duration-[800ms] ease-[cubic-bezier(.22,1,.36,1)]"
        style={{ width: `${value}%`, background: color }}
      />
    </div>
  );
}
