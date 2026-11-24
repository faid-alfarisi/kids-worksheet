import { Image } from 'expo-image';
import { useRef, useState } from 'react';
import { LayoutChangeEvent, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import type { Sheet } from '../data/sheets';
import { DrawingArt, type DrawingDef } from '../drawings';

// Dua baris krayon: warna cerah di atas, warna lembut/netral di bawah (putih bisa jadi penghapus).
const CRAYON_ROWS = [
  ['#E53935', '#FB8C00', '#FDD835', '#C0CA33', '#43A047', '#26C6DA', '#1E88E5', '#8E24AA'],
  ['#EC407A', '#F8BBD0', '#FFCC80', '#A1887F', '#6D4C41', '#9E9E9E', '#212121', '#FFFFFF'],
];
const CRAYONS = CRAYON_ROWS.flat();
const SIZES = [5, 12, 24];

type Stroke = { d: string; color: string; width: number };

/**
 * Kanvas coret-coret (pakai jari) di atas lembar soal (`sheet`, gambar) atau gambar besar (`art`, drawing).
 * Untuk drawing, garis tepinya digambar DI ATAS coretan supaya garis tetap rapi saat diwarnai.
 */
export function DrawingSheet({ sheet, art, color: accent }: { sheet?: Sheet; art?: DrawingDef; color: string }) {
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [current, setCurrent] = useState<string | null>(null);
  const [crayon, setCrayon] = useState(CRAYONS[0]);
  const [size, setSize] = useState(SIZES[1]);

  // Warna/ukuran aktif juga disimpan di ref (diubah di handler tombol) agar PanResponder yang dibuat sekali selalu memakai nilai terbaru.
  const pathRef = useRef('');
  const styleRef = useRef({ color: crayon, width: size });
  const pickCrayon = (c: string) => {
    styleRef.current = { ...styleRef.current, color: c };
    setCrayon(c);
  };
  const pickSize = (w: number) => {
    styleRef.current = { ...styleRef.current, width: w };
    setSize(w);
  };

  // PanResponder hanya menyimpan callback; ref dibaca saat disentuh, bukan saat render.
  // eslint-disable-next-line react-hooks/refs
  const [pan] = useState(() =>
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
  );

  // Ukuran gambar menyesuaikan ruang yang ada (contain), kanvas persis di atas gambar.
  const ratio = art || !sheet ? 1 : sheet.w / sheet.h;
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
            {art ? (
              <DrawingArt def={art} size={box.w} layer="fill" />
            ) : (
              sheet && <Image source={sheet.image} style={StyleSheet.absoluteFill} contentFit="contain" />
            )}
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
            {art && (
              <View style={StyleSheet.absoluteFill} pointerEvents="none">
                <DrawingArt def={art} size={box.w} layer="line" />
              </View>
            )}
          </View>
        )}
      </View>

      <View style={styles.toolbar}>
        {CRAYON_ROWS.map((row) => (
          <View key={row[0]} style={styles.colors}>
            {row.map((c) => (
              <Pressable
                key={c}
                onPress={() => pickCrayon(c)}
                style={[styles.dot, { backgroundColor: c }, c === '#FFFFFF' && styles.dotWhite, crayon === c && styles.dotActive]}
              />
            ))}
          </View>
        ))}
        <View style={styles.actions}>
          {SIZES.map((s) => (
            <Pressable key={s} onPress={() => pickSize(s)} style={[styles.sizeBtn, size === s && { borderColor: accent }]}>
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
  dotWhite: { borderColor: '#DDD' },
  dotActive: { borderColor: '#333', transform: [{ scale: 1.15 }] },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sizeBtn: { width: 38, height: 38, borderRadius: 12, borderWidth: 2, borderColor: '#eee', alignItems: 'center', justifyContent: 'center' },
  tool: { backgroundColor: '#F3F3F3', paddingHorizontal: 12, paddingVertical: 9, borderRadius: 12 },
  toolText: { fontWeight: '700', fontSize: 14, color: '#333' },
});
