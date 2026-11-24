import { SHAPE_KINDS, type ShapeKind } from '../shapes';

export type CompareGoal = 'besar' | 'kecil';

export type CompareRow = {
  kind: ShapeKind;
  /** Skala tiap benda (0..1) dari kiri ke kanan. */
  scales: number[];
  /** Indeks benda yang benar. */
  answer: number;
};

export type CompareRound = { goal: CompareGoal; count: number; prompt: string; rows: CompareRow[] };

const ROWS = 4;
// Selisih ukuran dibuat jelas supaya mudah dibedakan anak.
const SCALES: Record<number, number[]> = { 2: [0.55, 1], 3: [0.45, 0.72, 1] };

const shuffle = <T,>(arr: readonly T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/**
 * Satu halaman berisi beberapa baris dengan pertanyaan yang SAMA
 * (mis. semua "paling besar"), supaya anak tidak bingung.
 */
export function randomCompareRound(previous?: CompareRound): CompareRound {
  // Ganti pertanyaan dari halaman sebelumnya supaya bervariasi.
  const goal: CompareGoal = previous ? (previous.goal === 'besar' ? 'kecil' : 'besar') : Math.random() < 0.5 ? 'besar' : 'kecil';
  const count = Math.random() < 0.35 ? 2 : 3;
  const word = count === 2 ? 'lebih' : 'paling';
  const kinds = shuffle(SHAPE_KINDS).slice(0, ROWS);
  const rows = kinds.map((kind) => {
    const scales = shuffle(SCALES[count]);
    const target = goal === 'besar' ? Math.max(...scales) : Math.min(...scales);
    return { kind, scales, answer: scales.indexOf(target) };
  });
  return { goal, count, prompt: `Tap yang ${word} ${goal}!`, rows };
}
