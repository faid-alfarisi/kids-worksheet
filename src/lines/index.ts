/**
 * Koleksi pola garis untuk latihan menggaris (dipakai sebagai garis putus-putus).
 * Setiap pola menghasilkan path SVG dari x = a sampai x = b di sekitar tinggi y,
 * dengan tinggi gelombang `amp`. Jumlah gelombang disesuaikan supaya pas di panjangnya.
 *
 * Tambah pola baru: tambahkan fungsi di LINE_PATTERNS.
 */
type Pattern = (a: number, b: number, y: number, amp: number) => string;

const f = (n: number) => n.toFixed(1);

/** Bagi panjang a..b jadi beberapa potongan dengan lebar kira-kira `size`. */
function steps(a: number, b: number, size: number) {
  const n = Math.max(1, Math.round((b - a) / size));
  return { n, w: (b - a) / n };
}

export const LINE_PATTERNS: Record<string, Pattern> = {
  /** ———— */
  lurus: (a, b, y) => `M${f(a)} ${f(y)} L${f(b)} ${f(y)}`,

  /** ∿∿∿ naik-turun halus */
  gelombang: (a, b, y, amp) => {
    const { n, w } = steps(a, b, 22);
    let d = `M${f(a)} ${f(y)}`;
    for (let i = 0; i < n; i++) {
      const x = a + i * w;
      const up = i % 2 === 0 ? -1 : 1;
      d += ` Q${f(x + w / 2)} ${f(y + up * amp * 2)} ${f(x + w)} ${f(y)}`;
    }
    return d;
  },

  /** /\/\/\ */
  zigzag: (a, b, y, amp) => {
    const { n, w } = steps(a, b, 22);
    let d = `M${f(a)} ${f(y + amp)}`;
    for (let i = 1; i <= n; i++) d += ` L${f(a + i * w)} ${f(y + (i % 2 ? -amp : amp))}`;
    return d;
  },

  /** ⌒⌒⌒ busur-busur ke atas */
  lengkung: (a, b, y, amp) => {
    const { n, w } = steps(a, b, 30);
    let d = `M${f(a)} ${f(y + amp * 0.6)}`;
    for (let i = 0; i < n; i++) {
      const x = a + i * w;
      d += ` Q${f(x + w / 2)} ${f(y - amp * 2.2)} ${f(x + w)} ${f(y + amp * 0.6)}`;
    }
    return d;
  },

  /** ⌣⌣⌣ busur-busur ke bawah (mangkuk) */
  mangkuk: (a, b, y, amp) => {
    const { n, w } = steps(a, b, 30);
    let d = `M${f(a)} ${f(y - amp * 0.6)}`;
    for (let i = 0; i < n; i++) {
      const x = a + i * w;
      d += ` Q${f(x + w / 2)} ${f(y + amp * 2.2)} ${f(x + w)} ${f(y - amp * 0.6)}`;
    }
    return d;
  },

  /** ⊓⊔⊓⊔ seperti benteng */
  kotak: (a, b, y, amp) => {
    const { n, w } = steps(a, b, 18);
    let d = `M${f(a)} ${f(y + amp)}`;
    for (let i = 0; i < n; i++) {
      const yy = i % 2 === 0 ? y - amp : y + amp;
      d += ` L${f(a + i * w)} ${f(yy)} L${f(a + (i + 1) * w)} ${f(yy)}`;
    }
    return d;
  },

  /** /|/|/| seperti gigi gergaji */
  gergaji: (a, b, y, amp) => {
    const { n, w } = steps(a, b, 28);
    let d = `M${f(a)} ${f(y + amp)}`;
    for (let i = 0; i < n; i++) {
      const x = a + (i + 1) * w;
      d += ` L${f(x)} ${f(y - amp)} L${f(x)} ${f(y + amp)}`;
    }
    return d;
  },
};

export type LineKind = keyof typeof LINE_PATTERNS;
export const LINE_KINDS = Object.keys(LINE_PATTERNS) as LineKind[];

/** Path garis putus-putus dari pola tertentu. */
export const linePath = (kind: LineKind, a: number, b: number, y: number, amp = 10) => LINE_PATTERNS[kind](a, b, y, amp);
