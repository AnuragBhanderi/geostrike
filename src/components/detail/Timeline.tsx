'use client';

import type { TimelineEvent } from '@/lib/types';

interface TimelineProps {
  events: TimelineEvent[];
}

export default function Timeline({ events }: TimelineProps) {
  return (
    <div className="relative pl-4">
      <div className="absolute left-[3px] top-0 bottom-0 w-[1px] bg-bdr-light" />
      {events.map((ev, i) => (
        <div key={i} className="relative pb-3">
          <div
            className="absolute -left-4 top-1 w-[7px] h-[7px] rounded-full border-[1.5px] border-accent-red"
            style={{
              background: i === events.length - 1 ? '#ff2d55' : '#07070d',
            }}
          />
          <div className="text-[9.5px] text-txt-dim font-mono mb-[1px]">
            {ev.date}
          </div>
          <div className="text-[11.5px] text-txt-mid leading-[1.5]">
            {ev.description}
          </div>
        </div>
      ))}
    </div>
  );
}
