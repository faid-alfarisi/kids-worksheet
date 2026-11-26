import { RECOLOR_KINDS, SHAPE_KINDS, shapeDef, type ShapeKind } from '../shapes';

/** Isi satu kotak di kolom kiri/kanan. */
export type MatchItem =
  | { type: 'shape'; kind: ShapeKind; color?: string; silhouette?: boolean }
  | { type: 'group'; kind: ShapeKind; count: number }
  | { type: 'dot'; color: string }
  | { type: 'number'; value: number };

export type MatchMode = 'pasangan' | 'bayangan' | 'warna' | 'hitung';

export type MatchRound = {
  mode: MatchMode;
  prompt: string;
  left: MatchItem[];
  right: MatchItem[];
  /** answer[i] = indeks kanan yang benar untuk baris kiri ke-i */
  answer: number[];
};

export const MATCH_COLORS: { hex: string; family: string }[] = [
  { hex: '#E53935', family: 'warm-red' },
  { hex: '#F48FB1', family: 'warm-red' },
  { hex: '#FFEB3B', family: 'warm-yellow' },
  { hex: '#FB8C00', family: 'warm-yellow' },
  { hex: '#43A047', family: 'green' },
  { hex: '#1E88E5', family: 'blue' },
  { hex: '#8E24AA', family: 'purple' },
  { hex: '#795548', family: 'brown' },
];

/** Ambil `n` warna yang benar-benar kontras (tidak mencampur merah↔pink atau kuning↔oranye dalam satu halaman). */
function sampleDistinctColors(n: number): string[] {
  const out: string[] = [];
  const used = new Set<string>();
  for (const c of shuffle(MATCH_COLORS)) {
    if (used.has(c.family)) continue;
    used.add(c.family);
    out.push(c.hex);
    if (out.length === n) break;
  }
  return out;
}

const PAIRS: [ShapeKind, ShapeKind][] = [
  ['kaos', 'celana'],
  ['mobil', 'rumah'],
  ['kupu', 'bunga'],
  ['pensil', 'buku'],
  ['kelinci', 'wortel'],
  ['payung', 'sepatu'],
];

const ROWS = 4;
// Mode untuk menu Memasangkan. Mode 'hitung' (benda ↔ angka) dipakai di menu Berhitung.
const MODES: MatchMode[] = ['pasangan', 'bayangan', 'warna'];

const pick = <T,>(arr: readonly T[]) => arr[Math.floor(Math.random() * arr.length)];

function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const sample = <T,>(arr: readonly T[], n: number) => shuffle(arr).slice(0, n);

/** Ambil shape acak berbeda; dari tiap grup bayangan mirip (`look`) maksimal satu. */
function sampleDistinctShapes(n: number): ShapeKind[] {
  const out: ShapeKind[] = [];
  const looks = new Set<string>();
  for (const k of shuffle(SHAPE_KINDS)) {
    const look = shapeDef(k).look;
    if (look) {
      if (looks.has(look)) continue;
      looks.add(look);
    }
    out.push(k);
    if (out.length === n) break;
  }
  return out;
}

/** Buat pasangan kiri-kanan sesuai mode. */
function makePairs(mode: MatchMode): { prompt: string; pairs: [MatchItem, MatchItem][] } {
  switch (mode) {
    case 'pasangan': {
      const [a, b] = pick(PAIRS);
      const colors = sampleDistinctColors(ROWS);
      return {
        prompt: `Pasangkan ${shapeDef(a).name} dengan ${shapeDef(b).name} yang warnanya sama!`,
        pairs: colors.map((color) => [
          { type: 'shape', kind: a, color },
          { type: 'shape', kind: b, color },
        ]),
      };
    }
    case 'bayangan': {
      return {
        prompt: 'Tarik garis ke bayangan yang cocok!',
        pairs: sampleDistinctShapes(ROWS).map((kind) => [
          { type: 'shape', kind },
          { type: 'shape', kind, silhouette: true },
        ]),
      };
    }
    case 'warna': {
      const kinds = sample(RECOLOR_KINDS, ROWS);
      const colors = sampleDistinctColors(ROWS);
      return {
        prompt: 'Tarik garis ke warna yang sama!',
        pairs: kinds.map((kind, i) => [
          { type: 'shape', kind, color: colors[i] },
          { type: 'dot', color: colors[i] },
        ]),
      };
    }
    case 'hitung': {
      const counts = sample([1, 2, 3, 4, 5, 6], ROWS);
      const kinds = sample(SHAPE_KINDS.filter((k) => k !== 'rumah'), ROWS);
      return {
        prompt: 'Hitung bendanya, lalu tarik garis ke angkanya!',
        pairs: counts.map((count, i) => [
          { type: 'group', kind: kinds[i], count },
          { type: 'number', value: count },
        ]),
      };
    }
  }
}

/** Soal acak: mode, isi, dan urutan kolom kanan semuanya diacak. */
export function randomRound(previous?: MatchMode): MatchRound {
  return buildRound(pick(MODES.filter((m) => m !== previous)));
}

/** Soal pasangkan jumlah benda dengan angkanya (untuk menu Berhitung). */
export const randomCountMatchRound = () => buildRound('hitung');

function buildRound(mode: MatchMode): MatchRound {
  const { prompt, pairs } = makePairs(mode);
  const order = shuffle(pairs.map((_, i) => i)); // order[i] = posisi kanan untuk pasangan ke-i
  const right: MatchItem[] = [];
  pairs.forEach(([, r], i) => (right[order[i]] = r));
  return { mode, prompt, left: pairs.map(([l]) => l), right, answer: order };
}
