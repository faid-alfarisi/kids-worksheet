import { CODE_KINDS, MULTI_CODE_KINDS, shapeDef, shapeGroupCount, type ShapeKind } from '../shapes';

export type CodeColor = { name: string; hex: string; /** Grup warna mirip; maks. 1 warna per grup dalam satu soal. */ family: string };

export type CodeRound = {
  /** Legenda: angka i+1 = colors[i]. */
  colors: CodeColor[];
} & (
  | {
      /** 6 benda (shape) berbeda, tiap benda punya 1 angka (1-based). */
      type: 'shapes';
      items: { kind: ShapeKind; number: number }[];
    }
  | {
      /** 1 shape besar dengan beberapa bagian bernomor (multi-warna). */
      type: 'bigShape';
      kind: ShapeKind;
    }
);

/** Angka yang harus diwarnai untuk tiap target (tiap benda atau tiap bagian bernomor pada shape besar). */
export function roundNumbers(round: CodeRound): number[] {
  if (round.type === 'shapes') return round.items.map((it) => it.number);
  const els = shapeDef(round.kind).els ?? [];
  return els.filter((e) => e.n && e.at).map((e) => e.n!);
}

/**
 * Warna yang cerah & kontras untuk anak.
 * Warna yang berdekatan (merah↔pink, kuning↔oranye) diberi `family` sama
 * sehingga tidak pernah muncul bersamaan dalam satu soal.
 */
export const CODE_COLORS: CodeColor[] = [
  { name: 'merah', hex: '#E53935', family: 'warm-red' },
  { name: 'pink', hex: '#F48FB1', family: 'warm-red' },
  { name: 'kuning', hex: '#FFEB3B', family: 'warm-yellow' },
  { name: 'oranye', hex: '#FB8C00', family: 'warm-yellow' },
  { name: 'hijau', hex: '#43A047', family: 'green' },
  { name: 'biru', hex: '#1E88E5', family: 'blue' },
  { name: 'ungu', hex: '#8E24AA', family: 'purple' },
  { name: 'cokelat', hex: '#795548', family: 'brown' },
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

/** Pilih `n` warna yang benar-benar kontras (maks. 1 warna per `family`). */
function pickDistinctColors(n: number): CodeColor[] {
  const out: CodeColor[] = [];
  const used = new Set<string>();
  for (const c of shuffle(CODE_COLORS)) {
    if (used.has(c.family)) continue;
    used.add(c.family);
    out.push(c);
    if (out.length === n) break;
  }
  return out;
}

/**
 * Soal kode warna acak. Kadang berupa 6 shape kecil (1 warna per shape),
 * kadang berupa 1 shape besar multi-warna (payung, bunga, rumah, kapal, mobil, kereta, bebek, dll.).
 */
export function randomCodeRound(previous?: CodeRound): CodeRound {
  if (Math.random() < 0.5) {
    const last = previous?.type === 'bigShape' ? previous.kind : undefined;
    const kind = shuffle(MULTI_CODE_KINDS.filter((k) => k !== last))[0];
    const colors = pickDistinctColors(shapeGroupCount(kind));
    return { type: 'bigShape', kind, colors };
  }
  const k = Math.random() < 0.5 ? 3 : 4;
  const colors = pickDistinctColors(k);
  // Pastikan semua angka terpakai minimal sekali, sisanya acak.
  const numbers = shuffle([...colors.map((_, i) => i + 1), ...Array.from({ length: ITEMS - k }, () => 1 + Math.floor(Math.random() * k))]);
  const kinds = shuffle(CODE_KINDS).slice(0, ITEMS);
  return { type: 'shapes', colors, items: kinds.map((kind, i) => ({ kind, number: numbers[i] })) };
}
