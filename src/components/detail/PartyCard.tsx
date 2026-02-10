'use client';

interface PartyCardProps {
  flag: string;
  name: string;
  role: string;
}

export default function PartyCard({ flag, name, role }: PartyCardProps) {
  const roleLabel =
    role === 'aggressor'
      ? 'Aggressor'
      : role === 'target'
        ? 'Target'
        : role === 'supporter'
          ? 'Supporter'
          : 'Allied';

  const roleColor =
    role === 'aggressor'
      ? '#ff2d55'
      : role === 'target'
        ? '#ffae00'
        : '#00e5ff';

  const roleBg =
    role === 'aggressor'
      ? 'rgba(255,45,85,0.12)'
      : role === 'target'
        ? 'rgba(255,174,0,0.1)'
        : 'rgba(0,229,255,0.08)';

  return (
    <div className="flex items-center gap-[9px] px-[11px] py-[9px] bg-bg-2 rounded-[9px] border border-bdr">
      <span className="text-base w-6 text-center">{flag}</span>
      <span className="text-xs font-medium flex-1">{name}</span>
      <span
        className="text-[8px] uppercase tracking-[1px] font-mono px-[7px] py-[2px] rounded"
        style={{ background: roleBg, color: roleColor }}
      >
        {roleLabel}
      </span>
    </div>
  );
}
