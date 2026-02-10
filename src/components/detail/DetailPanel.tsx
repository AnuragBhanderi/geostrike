'use client';

import { X } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import StatRow from './StatRow';
import SeverityBar from './SeverityBar';
import PartyCard from './PartyCard';
import Timeline from './Timeline';

export default function DetailPanel() {
  const detailOpen = useAppStore((s) => s.detailOpen);
  const activeConflictId = useAppStore((s) => s.activeConflictId);
  const closeDetail = useAppStore((s) => s.closeDetail);
  const conflicts = useAppStore((s) => s.conflicts);

  const conflict = conflicts.find((c) => c.id === activeConflictId);

  return (
    <div
      className="fixed top-[52px] right-0 bottom-10 w-[420px] z-[900] bg-[rgba(10,10,18,0.92)] border-l border-bdr backdrop-blur-xl overflow-y-auto transition-transform duration-[400ms] ease-[cubic-bezier(.22,1,.36,1)]"
      style={{
        transform: detailOpen ? 'translateX(0)' : 'translateX(100%)',
      }}
    >
      {/* Close button */}
      <button
        onClick={closeDetail}
        className="sticky top-0 z-[2] float-right m-[10px] w-7 h-7 border border-bdr rounded-lg bg-bg-2 text-txt-dim cursor-pointer flex items-center justify-center hover:text-accent-cyan hover:border-accent-cyan/50 transition-colors"
      >
        <X size={14} />
      </button>

      {conflict && (
        <div>
          {/* Header */}
          <div className="px-5 pt-[18px] pb-[18px] border-b border-bdr">
            <h2 className="font-display text-[17px] font-bold mb-[2px] leading-[1.4]">
              {conflict.aggressor.flag} {conflict.aggressor.name} &rarr;{' '}
              {conflict.target.flag} {conflict.target.name}
            </h2>
            <div className="text-[10px] text-txt-dim font-mono tracking-[1px] uppercase">
              {conflict.type} &bull; {conflict.severity}
            </div>
          </div>

          {/* Overview */}
          <div className="px-5 py-4 border-b border-bdr">
            <h3 className="font-display text-[9.5px] font-semibold tracking-[2.5px] uppercase text-txt-dim mb-2.5">
              Overview
            </h3>
            <p className="text-xs leading-[1.7] text-txt-mid">
              {conflict.description}
            </p>
          </div>

          {/* Key Statistics */}
          <div className="px-5 py-4 border-b border-bdr">
            <h3 className="font-display text-[9.5px] font-semibold tracking-[2.5px] uppercase text-txt-dim mb-2.5">
              Key Statistics
            </h3>
            <StatRow
              label="Casualties"
              value={conflict.stats.casualties}
              color="#ff2d55"
            />
            <StatRow
              label="Displaced"
              value={conflict.stats.displaced}
              color="#ffae00"
            />
            <StatRow
              label="Severity"
              value={`${conflict.stats.severityIndex}/100`}
              color="#00e5ff"
            />
            <SeverityBar value={conflict.stats.severityIndex} />
          </div>

          {/* Involved Parties */}
          <div className="px-5 py-4 border-b border-bdr">
            <h3 className="font-display text-[9.5px] font-semibold tracking-[2.5px] uppercase text-txt-dim mb-2.5">
              Involved Parties
            </h3>
            <div className="flex flex-col gap-[7px]">
              <PartyCard
                flag={conflict.aggressor.flag}
                name={conflict.aggressor.name}
                role="aggressor"
              />
              <PartyCard
                flag={conflict.target.flag}
                name={conflict.target.name}
                role="target"
              />
              {conflict.allies.map((ally, i) => (
                <PartyCard
                  key={i}
                  flag={ally.flag}
                  name={ally.name}
                  role={ally.role}
                />
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="px-5 py-4">
            <h3 className="font-display text-[9.5px] font-semibold tracking-[2.5px] uppercase text-txt-dim mb-2.5">
              Timeline
            </h3>
            <Timeline events={conflict.timeline} />
          </div>
        </div>
      )}
    </div>
  );
}
