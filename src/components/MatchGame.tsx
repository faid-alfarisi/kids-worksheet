import { useEffect, useRef, useState } from 'react';
import { GestureResponderEvent, LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import type { MatchItem, MatchRound } from '../data/match';
import { ColorDot, Shape } from '../shapes';

type Side = 'L' | 'R';
type Drag = { side: Side; row: number; x: number; y: number };
type Wrong = { l: number; r: number };

const GREEN = '#43A047';
const RED = '#E53935';
const WRONG_MS = 900;

// Posisi horizontal (proporsi lebar area): kotak kiri | titik kiri ... titik kanan | kotak kanan.
// Mode hitung butuh kolom kiri lebih lebar (berisi beberapa benda), kanan cukup angka.
const LAYOUT = {
  normal: { boxL: 0.3, dotL: 0.34, dotR: 0.66, boxR: 0.3 },
  hitung: { boxL: 0.46, dotL: 0.5, dotR: 0.74, boxR: 0.22 },
};

/**
 * Permainan memasangkan: tarik garis lurus dari titik di kiri ke titik di kanan (atau sebaliknya).
 * Benar → garis hijau menetap. Salah → garis merah lalu hilang sendiri, anak bisa coba lagi.
 */
export function MatchGame({ round, color, onShuffle }: { round: MatchRound; color: string; onShuffle: () => void }) {
  const rows = round.left.length;
  const [area, setArea] = useState({ w: 0, h: 0 });
  const [matched, setMatched] = useState<Record<number, number>>({}); // kiri -> kanan
  const [drag, setDrag] = useState<Drag | null>(null);
  const [wrong, setWrong] = useState<Wrong | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const lay = LAYOUT[round.mode === 'hitung' ? 'hitung' : 'normal'];
  const rowH = area.h / rows;
  const cy = (i: number) => rowH * (i + 0.5);
  const dotX = (s: Side) => area.w * (s === 'L' ? lay.dotL : lay.dotR);
  const rightUsed = new Set(Object.values(matched));
  const isUsed = (s: Side, i: number) => (s === 'L' ? i in matched : rightUsed.has(i));
  const done = Object.keys(matched).length === rows;

  const rowAt = (y: number) => Math.max(0, Math.min(rows - 1, Math.floor(y / rowH)));

  const onGrant = (e: GestureResponderEvent) => {
    const { locationX: x, locationY: y } = e.nativeEvent;
    const mid = area.w * ((lay.dotL + lay.dotR) / 2);
    const side: Side = x < mid ? 'L' : 'R';
    const row = rowAt(y);
    if (isUsed(side, row)) return;
    setDrag({ side, row, x, y });
  };

  const onMove = (e: GestureResponderEvent) => {
    if (!drag) return;
    const { locationX: x, locationY: y } = e.nativeEvent;
    setDrag({ ...drag, x, y });
  };

  const onRelease = () => {
    if (!drag) return;
    const { side, row, x, y } = drag;
    setDrag(null);
    // Harus dilepas melewati tengah, di sisi seberang.
    const mid = area.w * ((lay.dotL + lay.dotR) / 2);
    const reachedOther = side === 'L' ? x > mid : x < mid;
    if (!reachedOther) return;
    const target = rowAt(y);
    const otherSide: Side = side === 'L' ? 'R' : 'L';
    if (isUsed(otherSide, target)) return;
    const l = side === 'L' ? row : target;
    const r = side === 'L' ? target : row;
    if (round.answer[l] === r) {
      setMatched((m) => ({ ...m, [l]: r }));
    } else {
      if (timer.current) clearTimeout(timer.current);
      setWrong({ l, r });
      timer.current = setTimeout(() => setWrong(null), WRONG_MS);
    }
  };

  const onLayout = (e: LayoutChangeEvent) => setArea({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height });

  const boxLW = area.w * lay.boxL;
  const boxRW = area.w * lay.boxR;
  const itemSize = Math.min(rowH * 0.8, area.w * 0.3 * 0.92);

  const dotColor = (s: Side, i: number) => {
    if (isUsed(s, i)) return GREEN;
    if (wrong && (s === 'L' ? wrong.l : wrong.r) === i) return RED;
    if (drag && drag.side === s && drag.row === i) return color;
    return '#B0B0B0';
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.prompt}>{round.prompt}</Text>

      <View
        style={[styles.board, { borderColor: color }]}
        onLayout={onLayout}
        onStartShouldSetResponder={() => !done}
        onMoveShouldSetResponder={() => !done}
        onResponderTerminationRequest={() => false}
        onResponderGrant={onGrant}
        onResponderMove={onMove}
        onResponderRelease={onRelease}
        onResponderTerminate={() => setDrag(null)}
      >
        {area.w > 0 && (
          // pointerEvents none: semua sentuhan jatuh ke papan, jadi locationX/Y konsisten.
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            {round.left.map((item, i) => (
              <View key={`l${i}`} style={[styles.cell, { top: rowH * i, height: rowH, width: boxLW, left: 0 }]}>
                <ItemView item={item} size={itemSize} boxW={boxLW} rowH={rowH} />
              </View>
            ))}
            {round.right.map((item, i) => (
              <View key={`r${i}`} style={[styles.cell, { top: rowH * i, height: rowH, width: boxRW, right: 0 }]}>
                <ItemView item={item} size={itemSize} boxW={boxRW} rowH={rowH} />
              </View>
            ))}

            <Svg width={area.w} height={area.h} style={StyleSheet.absoluteFill}>
              {Object.entries(matched).map(([l, r]) => (
                <Line key={l} x1={dotX('L')} y1={cy(+l)} x2={dotX('R')} y2={cy(r)} stroke={GREEN} strokeWidth={6} strokeLinecap="round" />
              ))}
              {wrong && (
                <Line x1={dotX('L')} y1={cy(wrong.l)} x2={dotX('R')} y2={cy(wrong.r)} stroke={RED} strokeWidth={6} strokeLinecap="round" />
              )}
              {drag && (
                <Line x1={dotX(drag.side)} y1={cy(drag.row)} x2={drag.x} y2={drag.y} stroke={color} strokeWidth={6} strokeLinecap="round" strokeDasharray="2 12" />
              )}
            </Svg>

            {(['L', 'R'] as Side[]).map((s) =>
              round.left.map((_, i) => (
                <View
                  key={`${s}${i}`}
                  style={[styles.dot, { left: dotX(s) - DOT_SIZE / 2, top: cy(i) - DOT_SIZE / 2, backgroundColor: dotColor(s, i) }]}
                />
              )),
            )}
          </View>
        )}
      </View>

      {done && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>🎉 Hebat! Semua benar!</Text>
          <Pressable onPress={onShuffle} style={[styles.bigBtn, { backgroundColor: color }]}>
            <Text style={styles.bigBtnText}>🔀 Main lagi</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

function ItemView({ item, size, boxW, rowH }: { item: MatchItem; size: number; boxW: number; rowH: number }) {
  switch (item.type) {
    case 'shape':
      return <Shape kind={item.kind} color={item.color} size={size} silhouette={item.silhouette} />;
    case 'dot':
      return <ColorDot color={item.color} size={size * 0.8} />;
    case 'number':
      return <Text style={[styles.number, { fontSize: size * 0.7 }]}>{item.value}</Text>;
    case 'group': {
      // Maksimal 3 per baris supaya mudah dihitung.
      const perLine = Math.min(item.count, 3);
      const lines = Math.ceil(item.count / 3);
      const s = Math.min((boxW * 0.95) / perLine, (rowH * 0.88) / lines, size * 0.75);
      return (
        <View style={[styles.group, { width: s * perLine }]}>
          {Array.from({ length: item.count }, (_, k) => (
            <Shape key={k} kind={item.kind} size={s} />
          ))}
        </View>
      );
    }
  }
}

const DOT_SIZE = 20;

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 14, gap: 10 },
  prompt: { fontSize: 16, color: '#444', fontWeight: '700', textAlign: 'center' },
  board: { flex: 1, backgroundColor: '#fff', borderRadius: 18, borderWidth: 3 },
  cell: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  dot: { position: 'absolute', width: DOT_SIZE, height: DOT_SIZE, borderRadius: DOT_SIZE / 2, borderWidth: 3, borderColor: '#fff', elevation: 2 },
  number: { fontWeight: '900', color: '#37474F' },
  group: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  banner: { borderRadius: 14, padding: 12, alignItems: 'center', gap: 10, backgroundColor: '#E8F5E9' },
  bannerText: { fontSize: 17, fontWeight: '800', color: '#333' },
  bigBtn: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 14 },
  bigBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});
