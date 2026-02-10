'use client';

interface StatRowProps {
  label: string;
  value: string;
  color: string;
}

export default function StatRow({ label, value, color }: StatRowProps) {
  return (
    <div className="flex justify-between py-1.5">
      <span className="text-[11.5px] text-txt-mid">{label}</span>
      <span className="text-xs font-medium font-mono" style={{ color }}>
        {value}
      </span>
    </div>
  );
}
