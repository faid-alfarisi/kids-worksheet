import { useEffect, useRef, useState } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native';
import { type CountProblem, MAX_NUMBER, type Term } from '../data/counting';
import { Shape, type ShapeKind } from '../shapes';

const WRONG_MS = 700;
const GREEN = '#43A047';
const RED = '#E53935';

type Round = { mode: string; prompt: string; problems: CountProblem[] };

/**
 * Berhitung isi kotak: pilih angka di bawah, lalu tap kotak jawaban.
 * Benar → angka tetap di kotak. Salah → ✕ merah sebentar, kotak kosong lagi.
 * Setelah tap kotak, pilihan angka dilepas (harus pilih lagi). Angka di pemilih tidak berkurang.
 */
export function CountGame({ round, color: accent, onShuffle }: { round: Round; color: string; onShuffle: () => void }) {
  const [area, setArea] = useState({ w: 0, h: 0 });
  const [picked, setPicked] = useState<number | null>(null);
  const [filled, setFilled] = useState<Record<number, boolean>>({});
  const [wrong, setWrong] = useState<number | null>(null);
  const [hint, setHint] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const flash = (fn: () => void) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(fn, WRONG_MS);
  };

  const done = Object.keys(filled).length === round.problems.length;

  const tapBox = (i: number) => {
    if (filled[i]) return;
    if (picked === null) {
      setHint(true);
      flash(() => setHint(false));
      return;
    }
    if (picked === round.problems[i].answer) {
      setFilled((f) => ({ ...f, [i]: true }));
      setWrong(null);
    } else {
      setWrong(i);
      flash(() => setWrong(null));
    }
    setPicked(null);
  };

  const onLayout = (e: LayoutChangeEvent) => setArea({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height });

  // Soal angka saja: 2 kolom. Soal bergambar: 1 kolom (butuh ruang lebar).
  const hasGroups = round.problems.some((p) => p.terms.some((t) => t.type === 'group'));
  const cols = hasGroups ? 1 : 2;
  const rows = Math.ceil(round.problems.length / cols);
  const cellW = area.w / cols;
  const cellH = area.h / rows;
  const boxSize = Math.min(cellH * 0.62, hasGroups ? 64 : 48);

  return (
    <View style={styles.wrap}>
      <Text style={styles.prompt}>{round.prompt}</Text>

      <View style={[styles.board, { borderColor: accent }]}>
        <View style={styles.grid} onLayout={onLayout}>
          {area.w > 0 &&
            round.problems.map((p, i) => {
              const state = filled[i] ? 'ok' : wrong === i ? 'bad' : 'empty';
              return (
                <View key={i} style={[styles.cell, { width: cellW, height: cellH }, i >= cols && styles.divider]}>
                  <ProblemTerms terms={p.terms} cellW={cellW - boxSize - 40} cellH={cellH} />
                  <Text style={styles.sym}>=</Text>
                  <Pressable
                    onPress={() => tapBox(i)}
                    style={[
                      styles.box,
                      { width: boxSize, height: boxSize, borderColor: state === 'ok' ? GREEN : state === 'bad' ? RED : picked !== null ? accent : '#B0BEC5' },
                      state === 'ok' && { backgroundColor: '#E8F5E9' },
                    ]}
                  >
                    <Text style={[styles.boxText, { fontSize: boxSize * 0.55 }, state === 'ok' && { color: GREEN }, state === 'bad' && { color: RED }]}>
                      {state === 'ok' ? p.answer : state === 'bad' ? '✕' : ''}
                    </Text>
                  </Pressable>
                </View>
              );
            })}
        </View>
      </View>

      {done ? (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>🎉 Hebat! Semua benar!</Text>
          <Pressable onPress={onShuffle} style={[styles.bigBtn, { backgroundColor: accent }]}>
            <Text style={styles.bigBtnText}>🔀 Main lagi</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.pickerWrap}>
          <Text style={[styles.pickerLabel, hint && { color: RED }]}>{hint ? 'Pilih angkanya dulu di sini 👇' : 'Pilih angka, lalu tap kotaknya'}</Text>
          {[
            [0, 1, 2, 3, 4, 5],
            [6, 7, 8, 9, MAX_NUMBER],
          ].map((line) => (
            <View key={line[0]} style={styles.pickerRow}>
              {line.map((n) => (
                <Pressable
                  key={n}
                  onPress={() => setPicked(picked === n ? null : n)}
                  style={[styles.key, { borderColor: accent }, picked === n && { backgroundColor: accent, transform: [{ scale: 1.12 }] }]}
                >
                  <Text style={[styles.keyText, { color: picked === n ? '#fff' : accent }]}>{n}</Text>
                </Pressable>
              ))}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

/** Suku-suku soal: angka besar atau kumpulan benda kecil dengan tanda + / −. */
function ProblemTerms({ terms, cellW, cellH }: { terms: Term[]; cellW: number; cellH: number }) {
  const groups = terms.filter((t) => t.type === 'group').length;
  const ops = terms.length - groups;
  const groupW = groups ? (cellW - ops * 24) / groups : 0;
  const groupH = cellH * 0.86;
  // Semua kelompok dalam satu soal memakai ukuran benda yang SAMA, supaya tidak menyesatkan.
  const size = Math.min(
    ...terms.map((t) => (t.type === 'group' ? fitGroup(t.count, groupW, groupH).s : Infinity)),
  );
  return (
    <View style={styles.terms}>
      {terms.map((t, k) =>
        t.type === 'num' ? (
          <Text key={k} style={styles.num}>
            {t.value}
          </Text>
        ) : t.type === 'op' ? (
          <Text key={k} style={styles.sym}>
            {t.op}
          </Text>
        ) : (
          <Group key={k} kind={t.kind} count={t.count} size={size} w={groupW} h={groupH} />
        ),
      )}
    </View>
  );
}

/** Susunan terbaik (berapa per baris) supaya `count` benda muat di w×h sebesar mungkin (maks. 72). */
function fitGroup(count: number, w: number, h: number) {
  let best = { per: 1, s: 0 };
  for (let per = 1; per <= count; per++) {
    const s = Math.min(w / per, h / Math.ceil(count / per));
    if (s > best.s) best = { per, s };
  }
  return { per: best.per, s: Math.min(best.s, 72) };
}

/** Kumpulan benda yang sama dengan ukuran benda `size`. */
function Group({ kind, count, size, w, h }: { kind: ShapeKind; count: number; size: number; w: number; h: number }) {
  // Dengan ukuran yang sudah disamakan, cari jumlah per baris yang paling sedikit tapi muat.
  const per = Math.max(1, Math.min(count, Math.floor(w / size)));
  const lines = Math.ceil(count / per);
  const s = lines * size > h ? h / lines : size;
  return (
    <View style={[styles.group, { width: s * per }]}>
      {Array.from({ length: count }, (_, i) => (
        <Shape key={i} kind={kind} size={s * 0.94} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 14, gap: 10 },
  prompt: { fontSize: 18, color: '#444', fontWeight: '800', textAlign: 'center' },
  board: { flex: 1, backgroundColor: '#fff', borderRadius: 18, borderWidth: 3, overflow: 'hidden' },
  grid: { flex: 1, flexDirection: 'row', flexWrap: 'wrap' },
  cell: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingHorizontal: 4 },
  divider: { borderTopWidth: 1, borderColor: '#EEE' },
  terms: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, flexShrink: 1 },
  num: { fontSize: 28, fontWeight: '900', color: '#37474F' },
  sym: { fontSize: 24, fontWeight: '900', color: '#78909C' },
  group: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  box: { borderWidth: 3, borderRadius: 12, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },
  boxText: { fontWeight: '900', color: '#37474F', includeFontPadding: false },
  pickerWrap: { gap: 8, alignItems: 'center' },
  pickerLabel: { fontSize: 14, fontWeight: '700', color: '#666' },
  pickerRow: { flexDirection: 'row', gap: 8 },
  key: { width: 46, height: 46, borderRadius: 23, borderWidth: 3, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  keyText: { fontSize: 20, fontWeight: '900' },
  banner: { borderRadius: 14, padding: 12, alignItems: 'center', gap: 10, backgroundColor: '#E8F5E9' },
  bannerText: { fontSize: 17, fontWeight: '800', color: '#333' },
  bigBtn: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 14 },
  bigBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});
