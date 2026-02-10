export function tagColor(tag: string): string {
  switch (tag) {
    case 'war': return '#ff2d55';
    case 'tension': return '#ffae00';
    case 'cyber': return '#7b61ff';
    default: return '#00e5ff';
  }
}

export function tagDashArray(tag: string): string {
  switch (tag) {
    case 'war': return '12 8';
    case 'tension': return '6 12';
    case 'cyber': return '4 8';
    default: return '12 8';
  }
}

export function severityColor(sev: number): string {
  if (sev > 80) return '#ff2d55';
  if (sev > 60) return '#ffae00';
  return '#00e5ff';
}

export function severityDotColor(severity: string): string {
  switch (severity) {
    case 'critical': return '#ff2d55';
    case 'high': return '#ffae00';
    case 'medium': return '#7b61ff';
    default: return '#555568';
  }
}

export function getArcPoints(
  start: [number, number],
  end: [number, number],
  n = 50
): [number, number][] {
  const pts: [number, number][] = [];
  const midLat = (start[0] + end[0]) / 2;
  const midLng = (start[1] + end[1]) / 2;
  const d = Math.sqrt((end[0] - start[0]) ** 2 + (end[1] - start[1]) ** 2);
  const dx = end[1] - start[1];
  const dy = -(end[0] - start[0]);
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const off = Math.min(d * 0.25, 15);
  const cLat = midLat + (dy / len) * off * 0.3;
  const cLng = midLng + (dx / len) * off;

  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const lat = (1 - t) * (1 - t) * start[0] + 2 * (1 - t) * t * cLat + t * t * end[0];
    const lng = (1 - t) * (1 - t) * start[1] + 2 * (1 - t) * t * cLng + t * t * end[1];
    pts.push([lat, lng]);
  }
  return pts;
}