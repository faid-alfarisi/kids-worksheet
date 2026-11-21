import { Image } from 'expo-image';
import { useMemo, useRef, useState } from 'react';
import { LayoutChangeEvent, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import type { Sheet } from '../data/sheets';

const CRAYONS = ['#E53935', '#FB8C00', '#FDD835', '#43A047', '#1E88E5', '#8E24AA', '#6D4C41', '#212121'];
const SIZES = [4, 8, 16];

type Stroke = { d: string; color: string; width: number };

/** Lembar soal + kanvas coret-coret di atasnya (pakai jari). */
export function DrawingSheet({ sheet, color: accent }: { sheet: Sheet; color: string }) {
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [current, setCurrent] = useState<string | null>(null);
  const [crayon, setCrayon] = useState(CRAYONS[0]);
  const [size, setSize] = useState(SIZES[1]);

  // Simpan nilai terbaru di ref agar PanResponder (dibuat sekali) selalu memakai warna/ukuran aktif.
  const pathRef = useRef('');
  const styleRef = useRef({ color: crayon, width: size });
  styleRef.current = { color: crayon, width: size };

  const pan = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: (e) => {
          const { locationX: x, locationY: y } = e.nativeEvent;
          pathRef.current = `M${x.toFixed(1)} ${y.toFixed(1)} l0.1 0.1`;
          setCurrent(pathRef.current);
        },
        onPanResponderMove: (e) => {
          const { locationX: x, locationY: y } = e.nativeEvent;
          pathRef.current += ` L${x.toFixed(1)} ${y.toFixed(1)}`;
          setCurrent(pathRef.current);
        },
        onPanResponderRelease: () => {
          const d = pathRef.current;
          if (d) setStrokes((s) => [...s, { d, ...styleRef.current }]);
          pathRef.current = '';
          setCurrent(null);
        },
      }),
    [],
  );

  // Ukuran gambar menyesuaikan ruang yang ada (contain), kanvas persis di atas gambar.
  const ratio = sheet.w / sheet.h;
  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    const w = Math.min(width - 16, (height - 16) * ratio);
    setBox({ w, h: w / ratio });
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.stage} onLayout={onLayout}>
        {box.w > 0 && (
          <View style={[styles.paper, { width: box.w, height: box.h }]}>
            <Image source={sheet.image} style={StyleSheet.absoluteFill} contentFit="contain" />
            <View style={StyleSheet.absoluteFill} {...pan.panHandlers}>
              {/* pointerEvents none: sentuhan selalu jatuh ke View induk, jadi locationX/Y konsisten */}
              <Svg width={box.w} height={box.h} pointerEvents="none">
                {strokes.map((s, i) => (
                  <Path key={i} d={s.d} stroke={s.color} strokeWidth={s.width} strokeOpacity={0.85} strokeLinecap="round" strokeLinejoin="round" fill="none" />
                ))}
                {current && (
                  <Path d={current} stroke={crayon} strokeWidth={size} strokeOpacity={0.85} strokeLinecap="round" strokeLinejoin="round" fill="none" />
                )}
              </Svg>
            </View>
          </View>
        )}
      </View>

      <View style={styles.toolbar}>
        <View style={styles.colors}>
          {CRAYONS.map((c) => (
            <Pressable key={c} onPress={() => setCrayon(c)} style={[styles.dot, { backgroundColor: c }, crayon === c && styles.dotActive]} />
          ))}
        </View>
        <View style={styles.actions}>
          {SIZES.map((s) => (
            <Pressable key={s} onPress={() => setSize(s)} style={[styles.sizeBtn, size === s && { borderColor: accent }]}>
              <View style={{ width: s + 4, height: s + 4, borderRadius: 20, backgroundColor: crayon }} />
            </Pressable>
          ))}
          <View style={{ flex: 1 }} />
          <ToolButton label="↩️ Batal" onPress={() => setStrokes((s) => s.slice(0, -1))} />
          <ToolButton label="🧽 Hapus" onPress={() => setStrokes([])} />
        </View>
      </View>
    </View>
  );
}

function ToolButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.tool, pressed && { opacity: 0.6 }]}>
      <Text style={styles.toolText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  stage: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  paper: { backgroundColor: '#fff', borderRadius: 6, overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
  toolbar: { backgroundColor: '#fff', paddingHorizontal: 12, paddingTop: 10, gap: 8, borderTopWidth: 1, borderColor: '#eee' },
  colors: { flexDirection: 'row', justifyContent: 'space-between' },
  dot: { width: 34, height: 34, borderRadius: 17, borderWidth: 3, borderColor: '#fff' },
  dotActive: { borderColor: '#333', transform: [{ scale: 1.15 }] },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sizeBtn: { width: 38, height: 38, borderRadius: 12, borderWidth: 2, borderColor: '#eee', alignItems: 'center', justifyContent: 'center' },
  tool: { backgroundColor: '#F3F3F3', paddingHorizontal: 12, paddingVertical: 9, borderRadius: 12 },
  toolText: { fontWeight: '700', fontSize: 14, color: '#333' },
});
