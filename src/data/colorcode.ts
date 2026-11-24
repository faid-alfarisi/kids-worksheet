import { CODE_KINDS, type ShapeKind } from '../shapes';

export type CodeColor = { name: string; hex: string };

export type CodeRound = {
  /** Legenda: angka i+1 = colors[i]. */
  colors: CodeColor[];
  /** Benda yang harus diwarnai beserta angkanya (1-based). */
  items: { kind: ShapeKind; number: number }[];
};

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
 * Soal kode warna acak: 3–4 warna di legenda, 6 benda berbeda bentuk,
 * tiap benda punya angka. Pasangan angka-warna juga diacak tiap ronde.
 */
export function randomCodeRound(): CodeRound {
  const k = Math.random() < 0.5 ? 3 : 4;
  const colors = shuffle(CODE_COLORS).slice(0, k);
  // Pastikan semua angka terpakai minimal sekali, sisanya acak.
  const numbers = shuffle([...colors.map((_, i) => i + 1), ...Array.from({ length: ITEMS - k }, () => 1 + Math.floor(Math.random() * k))]);
  const kinds = shuffle(CODE_KINDS).slice(0, ITEMS);
  return { colors, items: kinds.map((kind, i) => ({ kind, number: numbers[i] })) };
}
