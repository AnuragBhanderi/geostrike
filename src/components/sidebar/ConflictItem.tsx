'use client';

import type { Conflict } from '@/lib/types';
import { tagColor, severityDotColor } from '@/lib/utils';

interface ConflictItemProps {
  conflict: Conflict;
  isActive: boolean;
  onClick: () => void;
}

export default function ConflictItem({ conflict, isActive, onClick }: ConflictItemProps) {
  const col = tagColor(conflict.tag);
  const dotColor = severityDotColor(conflict.severity);

  return (
    <div
      onClick={onClick}
      className="flex gap-[11px] px-[18px] py-[13px] border-b border-bdr cursor-pointer transition-all duration-200"
      style={{
        borderLeft: isActive ? '2px solid #00e5ff' : '2px solid transparent',
        background: isActive ? 'rgba(0,229,255,0.03)' : 'transparent',
      }}
    >
      <div
        className="w-[6px] h-[6px] rounded-full mt-[6px] flex-shrink-0"
        style={{
          background: dotColor,
          boxShadow:
            conflict.severity === 'critical'
              ? '0 0 6px rgba(255,45,85,0.35)'
              : conflict.severity === 'high'
                ? '0 0 6px rgba(255,174,0,0.3)'
                : 'none',
        }}
      />
      <div className="flex-1 min-w-0">
        <div className="font-display text-[12.5px] font-semibold mb-[2px] whitespace-nowrap overflow-hidden text-ellipsis">
          {conflict.aggressor.flag} {conflict.aggressor.name}{' '}
          <span className="text-accent-red text-[10px] mx-1">&rarr;</span>{' '}
          {conflict.target.flag} {conflict.target.name}
        </div>
        <div className="text-[9.5px] text-txt-dim uppercase tracking-[1px] font-mono mb-1">
          {conflict.type}
        </div>
        <div className="text-[11px] text-txt-mid leading-[1.5] line-clamp-2">
          {conflict.description}
        </div>
        <div className="flex gap-[5px] mt-[6px]">
          <span
            className="text-[8px] px-[7px] py-[2px] rounded font-mono tracking-[0.5px] uppercase"
            style={{ background: `${col}1e`, color: col }}
          >
            {conflict.tag}
          </span>
          <span className="text-[8px] px-[7px] py-[2px] rounded font-mono bg-[rgba(255,255,255,0.04)] text-txt-dim uppercase">
            {conflict.severity}
          </span>
        </div>
      </div>
    </div>
  );
}
