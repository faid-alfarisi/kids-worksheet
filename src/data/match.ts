import { SHAPE_KINDS, SHAPE_NAMES, type ShapeKind } from '../components/shapes';

/** Isi satu kotak di kolom kiri/kanan. */
export type MatchItem =
  | { type: 'shape'; kind: ShapeKind; color: string; silhouette?: boolean }
  | { type: 'group'; kind: ShapeKind; color: string; count: number }
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

export const MATCH_COLORS = ['#EF5350', '#FFA726', '#FFEE58', '#66BB6A', '#42A5F5', '#AB47BC', '#F06292', '#8D6E63'];

const PAIRS: [ShapeKind, ShapeKind][] = [
  ['kaos', 'celana'],
  ['mobil', 'rumah'],
  ['kupu', 'bunga'],
];

const ROWS = 4;
const MODES: MatchMode[] = ['pasangan', 'bayangan', 'warna', 'hitung'];

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

/** Buat pasangan kiri-kanan sesuai mode. */
function makePairs(mode: MatchMode): { prompt: string; pairs: [MatchItem, MatchItem][] } {
  switch (mode) {
    case 'pasangan': {
      const [a, b] = pick(PAIRS);
      const colors = sample(MATCH_COLORS, ROWS);
      return {
        prompt: `Pasangkan ${SHAPE_NAMES[a]} dengan ${SHAPE_NAMES[b]} yang warnanya sama!`,
        pairs: colors.map((color) => [
          { type: 'shape', kind: a, color },
          { type: 'shape', kind: b, color },
        ]),
      };
    }
    case 'bayangan': {
      const kinds = sample(SHAPE_KINDS, ROWS);
      return {
        prompt: 'Tarik garis ke bayangan yang cocok!',
        pairs: kinds.map((kind) => {
          const color = pick(MATCH_COLORS);
          return [
            { type: 'shape', kind, color },
            { type: 'shape', kind, color, silhouette: true },
          ];
        }),
      };
    }
    case 'warna': {
      const kinds = sample(SHAPE_KINDS, ROWS);
      const colors = sample(MATCH_COLORS, ROWS);
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
      const kinds = sample(SHAPE_KINDS.filter((k) => k !== 'celana' && k !== 'rumah'), ROWS);
      return {
        prompt: 'Hitung bendanya, lalu tarik garis ke angkanya!',
        pairs: counts.map((count, i) => [
          { type: 'group', kind: kinds[i], color: pick(MATCH_COLORS), count },
          { type: 'number', value: count },
        ]),
      };
    }
  }
}

/** Soal acak: mode, isi, dan urutan kolom kanan semuanya diacak. */
export function randomRound(previous?: MatchMode): MatchRound {
  const mode = pick(MODES.filter((m) => m !== previous));
  const { prompt, pairs } = makePairs(mode);
  const order = shuffle(pairs.map((_, i) => i)); // order[i] = posisi kanan untuk pasangan ke-i
  const right: MatchItem[] = [];
  pairs.forEach(([, r], i) => (right[order[i]] = r));
  return { mode, prompt, left: pairs.map(([l]) => l), right, answer: order };
}
