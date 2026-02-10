'use client';

export default function MapLegend() {
  const items: [string, string][] = [
    ['#ff2d55', 'Active War'],
    ['#ffae00', 'Tension'],
    ['#7b61ff', 'Cyber/Proxy'],
  ];

  return (
    <div className="fixed bottom-[50px] left-1/2 -translate-x-1/2 z-[900] flex gap-4 px-[18px] py-[5px] rounded-full bg-[rgba(10,10,18,0.88)] border border-bdr backdrop-blur-md font-mono text-[8px] uppercase tracking-[1px] text-txt-dim">
      {items.map(([col, label]) => (
        <div key={label} className="flex items-center gap-[5px]">
          <div
            className="w-5 h-0"
            style={{ borderTop: `2px dashed ${col}` }}
          />
          {label}
        </div>
      ))}
    </div>
  );
}
