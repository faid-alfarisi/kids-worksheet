// Peta level coding. Simbol:
//   R = robot (start)   * = bintang (tujuan)   # = batu (tidak bisa dilewati)   . = jalan
export type Dir = 'up' | 'down' | 'left' | 'right';

export type Level = { title: string; map: string[] };

export const CODING_LEVELS: Level[] = [
  { title: 'Lurus Saja', map: ['.....', '.....', 'R...*', '.....', '.....'] },
  { title: 'Belok Atas', map: ['....*', '.....', '.....', '.....', 'R....'] },
  { title: 'Hindari Batu', map: ['.....', '.###.', 'R.#.*', '.....', '.....'] },
  { title: 'Labirin Kecil', map: ['R..#*', '.#.#.', '.#...', '.####', '.....'] },
  { title: 'Jalan Memutar', map: ['*..#.', '##.#.', '...#.', '.###.', '....R'] },
  { title: 'Zig-Zag', map: ['R#...', '.#.#.', '.#.#.', '.#.#.', '...#*'] },
];

export type Pos = { r: number; c: number };

export function parseLevel(level: Level) {
  let start: Pos = { r: 0, c: 0 };
  let goal: Pos = { r: 0, c: 0 };
  const rocks = new Set<string>();
  level.map.forEach((row, r) =>
    row.split('').forEach((ch, c) => {
      if (ch === 'R') start = { r, c };
      if (ch === '*') goal = { r, c };
      if (ch === '#') rocks.add(`${r},${c}`);
    }),
  );
  const rows = level.map.length;
  const cols = level.map[0].length;
  return { start, goal, rocks, rows, cols, shortest: shortestPath(start, goal, rocks, rows, cols) };
}

// BFS: jumlah langkah minimum dari robot ke bintang.
function shortestPath(start: Pos, goal: Pos, rocks: Set<string>, rows: number, cols: number) {
  const seen = new Set([`${start.r},${start.c}`]);
  let frontier = [start];
  for (let d = 0; frontier.length; d++) {
    const next: Pos[] = [];
    for (const p of frontier) {
      if (p.r === goal.r && p.c === goal.c) return d;
      for (const m of Object.values(MOVE)) {
        const q = { r: p.r + m.r, c: p.c + m.c };
        const k = `${q.r},${q.c}`;
        if (q.r < 0 || q.c < 0 || q.r >= rows || q.c >= cols || rocks.has(k) || seen.has(k)) continue;
        seen.add(k);
        next.push(q);
      }
    }
    frontier = next;
  }
  return -1;
}

export const MOVE: Record<Dir, Pos> = {
  up: { r: -1, c: 0 },
  down: { r: 1, c: 0 },
  left: { r: 0, c: -1 },
  right: { r: 0, c: 1 },
};

export const ARROW: Record<Dir, string> = { up: '⬆️', down: '⬇️', left: '⬅️', right: '➡️' };
