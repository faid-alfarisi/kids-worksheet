import { DRAWING_IDS, DRAWINGS, type DrawingId, groupCount } from '../drawings';
import { CODE_KINDS, type ShapeKind } from '../shapes';

export type CodeColor = { name: string; hex: string };

export type CodeRound = {
  /** Legenda: angka i+1 = colors[i]. */
  colors: CodeColor[];
} & (
  | {
      /** Beberapa benda (shape) berbeda, tiap benda punya angka (1-based). */
      type: 'shapes';
      items: { kind: ShapeKind; number: number }[];
    }
  | {
      /** Satu gambar besar; angka tiap bagian = nomor kelompoknya. */
      type: 'drawing';
      id: DrawingId;
    }
);

/** Angka yang harus diwarnai untuk tiap target (benda atau bagian gambar). */
export const roundNumbers = (round: CodeRound) =>
  round.type === 'shapes' ? round.items.map((it) => it.number) : DRAWINGS[round.id].regions.map((r) => r.n);

export const CODE_COLORS: CodeColor[] = [
  { name: 'merah', hex: '#EF5350' },
  { name: 'biru', hex: '#42A5F5' },
  { name: 'kuning', hex: '#FFEE58' },
  { name: 'hijau', hex: '#66BB6A' },
  { name: 'ungu', hex: '#AB47BC' },
  { name: 'oranye', hex: '#FFA726' },
  { name: 'pink', hex: '#F06292' },
  { name: 'cokelat', hex: '#8D6E63' },
];

const ITEMS = 6;

const shuffle = <T,>(arr: readonly T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/**
 * Soal kode warna acak. Kadang berupa 6 benda berbeda bentuk, kadang satu gambar besar.
 * Pasangan angka-warna diacak tiap ronde, jadi gambar yang sama pun kodenya berbeda.
 */
export function randomCodeRound(previous?: CodeRound): CodeRound {
  if (Math.random() < 0.45) {
    const last = previous?.type === 'drawing' ? previous.id : undefined;
    const id = shuffle(DRAWING_IDS.filter((d) => d !== last))[0];
    const colors = shuffle(CODE_COLORS).slice(0, groupCount(DRAWINGS[id]));
    return { type: 'drawing', id, colors };
  }
  const k = Math.random() < 0.5 ? 3 : 4;
  const colors = shuffle(CODE_COLORS).slice(0, k);
  // Pastikan semua angka terpakai minimal sekali, sisanya acak.
  const numbers = shuffle([...colors.map((_, i) => i + 1), ...Array.from({ length: ITEMS - k }, () => 1 + Math.floor(Math.random() * k))]);
  const kinds = shuffle(CODE_KINDS).slice(0, ITEMS);
  return { type: 'shapes', colors, items: kinds.map((kind, i) => ({ kind, number: numbers[i] })) };
}
