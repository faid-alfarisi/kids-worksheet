import { useEffect, useRef, useState } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native';
import type { CompareRound } from '../data/compare';
import { Shape } from '../shapes';

const GREEN = '#43A047';
const RED = '#E53935';
const WRONG_MS = 900;

/**
 * Perbandingan ukuran: tiap baris berisi benda yang sama dengan ukuran berbeda.
 * Tap yang benar → dilingkari hijau. Salah → lingkaran merah lalu hilang, boleh coba lagi.
 */
export function CompareGame({ round, color, onDone }: { round: CompareRound; color: string; onDone?: () => void }) {
  const [area, setArea] = useState({ w: 0, h: 0 });
  const [solved, setSolved] = useState<Record<number, boolean>>({});
  const [wrong, setWrong] = useState<{ row: number; idx: number } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const rows = round.rows.length;
  const done = Object.keys(solved).length === rows;

  useEffect(() => {
    if (done) onDone?.();
  }, [done, onDone]);

  const tap = (row: number, idx: number) => {
    if (solved[row]) return;
    if (round.rows[row].answer === idx) {
      setSolved((s) => ({ ...s, [row]: true }));
      setWrong(null);
    } else {
      if (timer.current) clearTimeout(timer.current);
      setWrong({ row, idx });
      timer.current = setTimeout(() => setWrong(null), WRONG_MS);
    }
  };

  const onLayout = (e: LayoutChangeEvent) => setArea({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height });

  const rowH = area.h / rows;
  const cellW = area.w / round.count;
  const maxSize = Math.min(rowH * 0.82, cellW * 0.82);
  const isBig = round.goal === 'besar';

  return (
    <View style={styles.wrap}>
      <View style={[styles.question, { backgroundColor: done ? GREEN : color }]}>
        <Text style={styles.questionIcon}>{done ? '🎉' : isBig ? '🐘' : '🐭'}</Text>
        <Text style={styles.questionText}>{done ? 'Hebat! Semua benar!' : round.prompt}</Text>
      </View>

      <View style={[styles.board, { borderColor: done ? GREEN : color }]} onLayout={onLayout}>
        {area.w > 0 &&
          round.rows.map((r, i) => (
            <View key={i} style={[styles.row, { height: rowH }, i > 0 && styles.divider]}>
              {r.scales.map((scale, k) => {
                const size = maxSize * scale;
                const ok = solved[i] && r.answer === k;
                const bad = wrong?.row === i && wrong.idx === k;
                const ring = ok ? GREEN : bad ? RED : null;
                const ringSize = size + 18;
                return (
                  <Pressable key={k} onPress={() => tap(i, k)} disabled={!!solved[i]} style={[styles.cell, { width: cellW }]}>
                    <View style={[styles.ring, { width: ringSize, height: ringSize, borderRadius: ringSize / 2, borderColor: ring ?? 'transparent', backgroundColor: ring ? `${ring}1A` : 'transparent' }]}>
                      <Shape kind={r.kind} size={size} />
                    </View>
                  </Pressable>
                );
              })}
            </View>
          ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 14, gap: 10 },
  question: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, borderRadius: 16, paddingVertical: 10 },
  questionIcon: { fontSize: 28 },
  questionText: { color: '#fff', fontSize: 22, fontWeight: '900' },
  board: { flex: 1, backgroundColor: '#fff', borderRadius: 18, borderWidth: 3, overflow: 'hidden' },
  row: { flexDirection: 'row' },
  divider: { borderTopWidth: 2, borderColor: '#EEE', borderStyle: 'dashed' },
  cell: { alignItems: 'center', justifyContent: 'center' },
  ring: { borderWidth: 5, alignItems: 'center', justifyContent: 'center' },
  banner: { borderRadius: 14, padding: 12, alignItems: 'center', gap: 10, backgroundColor: '#E8F5E9' },
  bannerText: { fontSize: 17, fontWeight: '800', color: '#333' },
  bigBtn: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 14 },
  bigBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});
