import { SHAPE_KINDS, type ShapeKind } from '../shapes';
import { type MatchRound, randomCountMatchRound } from './match';

/** Satu suku dalam soal: angka, kumpulan benda, atau tanda operasi. */
export type Term = { type: 'num'; value: number } | { type: 'group'; kind: ShapeKind; count: number } | { type: 'op'; op: '+' | '−' };

/** Satu soal: suku-suku di kiri, lalu "= [kotak]" dengan jawaban `answer`. */
export type CountProblem = { terms: Term[]; answer: number };

export type CountMode = 'tambah' | 'kurang' | 'hitung' | 'tambahGambar' | 'kurangGambar' | 'pasangkan';

export type CountRound =
  | { mode: Exclude<CountMode, 'pasangkan'>; prompt: string; problems: CountProblem[] }
  | { mode: 'pasangkan'; match: MatchRound };

/** Angka di pemilih (dan batas semua jawaban). */
export const MAX_NUMBER = 10;

const MODES: CountMode[] = ['tambah', 'kurang', 'hitung', 'tambahGambar', 'kurangGambar', 'pasangkan'];

const rand = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));
const pick = <T,>(arr: readonly T[]) => arr[Math.floor(Math.random() * arr.length)];
const shuffle = <T,>(arr: readonly T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/** Buat `n` soal unik dengan fungsi pembuat `make` (dicoba ulang kalau kembar). */
function unique(n: number, make: () => CountProblem): CountProblem[] {
  const seen = new Set<string>();
  const out: CountProblem[] = [];
  for (let tries = 0; out.length < n && tries < 200; tries++) {
    const p = make();
    const key = JSON.stringify(p.terms);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(p);
  }
  return out;
}

const num = (value: number): Term => ({ type: 'num', value });
const op = (o: '+' | '−'): Term => ({ type: 'op', op: o });
const group = (kind: ShapeKind, count: number): Term => ({ type: 'group', kind, count });

// Shape yang enak dihitung (bukan garasi yang besar & kotak).
const COUNTABLE = SHAPE_KINDS.filter((k) => k !== 'rumah');

/** Lembar acak; jenisnya dibuat beda dari lembar sebelumnya. Satu lembar = satu jenis soal. */
export function randomCountRound(previous?: CountMode): CountRound {
  const mode = pick(MODES.filter((m) => m !== previous));
  switch (mode) {
    case 'pasangkan':
      return { mode, match: randomCountMatchRound() };
    case 'tambah':
      return {
        mode,
        prompt: 'Ayo jumlahkan!',
        problems: unique(6, () => {
          const a = rand(0, 9);
          const b = rand(a === 0 ? 1 : 0, MAX_NUMBER - a);
          return { terms: [num(a), op('+'), num(b)], answer: a + b };
        }),
      };
    case 'kurang':
      return {
        mode,
        prompt: 'Ayo kurangkan!',
        problems: unique(6, () => {
          const a = rand(1, MAX_NUMBER);
          const b = rand(0, a);
          return { terms: [num(a), op('−'), num(b)], answer: a - b };
        }),
      };
    case 'hitung': {
      const kinds = shuffle(COUNTABLE);
      const counts = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      return {
        mode,
        prompt: 'Hitung bendanya, isi angkanya!',
        problems: [0, 1, 2, 3].map((i) => ({ terms: [group(kinds[i], counts[i])], answer: counts[i] })),
      };
    }
    case 'tambahGambar': {
      const kinds = shuffle(COUNTABLE);
      return {
        mode,
        prompt: 'Hitung, lalu jumlahkan!',
        problems: [0, 1, 2, 3].map((i) => {
          const a = rand(1, 5);
          const b = rand(1, Math.min(5, MAX_NUMBER - a));
          return { terms: [group(kinds[i], a), op('+'), group(kinds[i], b)], answer: a + b };
        }),
      };
    }
    case 'kurangGambar': {
      const kinds = shuffle(COUNTABLE);
      return {
        mode,
        prompt: 'Hitung, lalu kurangkan!',
        problems: [0, 1, 2, 3].map((i) => {
          const a = rand(2, 6);
          const b = rand(1, a - 1);
          return { terms: [group(kinds[i], a), op('−'), group(kinds[i], b)], answer: a - b };
        }),
      };
    }
  }
}
