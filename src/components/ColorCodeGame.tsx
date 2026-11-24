import { useEffect, useRef, useState } from 'react';
import { Animated, LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native';
import { type CodeRound } from '../data/colorcode';
import { Shape, shapeDef, type ShapeKind } from '../shapes';

const WRONG_MS = 700;
const BLANK = '#FFFFFF';

/**
 * Coding kode warna: legenda angka→warna di atas, benda berangka di tengah, pilihan warna di bawah.
 * Pilih warna lalu tap benda. Benar → warna menempel, angka hilang.
 * Salah → "tet tot": angka jadi ✕ merah sebentar (benda bergoyang), lalu kembali jadi angka.
 */
export function ColorCodeGame({ round, color: accent, onShuffle }: { round: CodeRound; color: string; onShuffle: () => void }) {
  const [area, setArea] = useState({ w: 0, h: 0 });
  const [picked, setPicked] = useState<number | null>(null); // indeks warna terpilih
  const [painted, setPainted] = useState<Record<number, boolean>>({});
  const [wrong, setWrong] = useState<number | null>(null);
  const [hint, setHint] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const done = Object.keys(painted).length === round.items.length;

  const flash = (fn: () => void) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(fn, WRONG_MS);
  };

  const tapItem = (i: number) => {
    if (painted[i]) return;
    if (picked === null) {
      setHint(true);
      flash(() => setHint(false));
      return;
    }
    if (round.items[i].number === picked + 1) {
      setPainted((p) => ({ ...p, [i]: true }));
      setWrong(null);
    } else {
      setWrong(i);
      flash(() => setWrong(null));
    }
  };

  const onLayout = (e: LayoutChangeEvent) => setArea({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height });
  const cols = 2;
  const rows = Math.ceil(round.items.length / cols);
  const size = Math.min(area.w / cols, area.h / rows) * 0.82;

  return (
    <View style={styles.wrap}>
      {/* Legenda kode */}
      <View style={[styles.legend, { borderColor: accent }]}>
        {round.colors.map((c, i) => (
          <View key={c.hex} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: c.hex }]}>
              <Text style={styles.legendNum}>{i + 1}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={[styles.board, { borderColor: accent }]}>
        {/* Diukur di dalam border supaya 2 kolom pas. */}
        <View style={styles.grid} onLayout={onLayout}>
        {area.w > 0 &&
          round.items.map((item, i) => (
            <View key={i} style={[styles.cell, { width: area.w / cols, height: area.h / rows }]}>
              <CodeItem
                kind={item.kind}
                number={item.number}
                fill={painted[i] ? round.colors[item.number - 1].hex : null}
                wrong={wrong === i}
                size={size}
                onPress={() => tapItem(i)}
              />
            </View>
          ))}
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
          <Text style={[styles.pickerLabel, hint && styles.hint]}>{hint ? 'Pilih warnanya dulu di sini 👇' : 'Pilih warna, lalu tap gambarnya'}</Text>
          {/* Pilihan warna tanpa angka, urutannya beda dari legenda, supaya anak tetap membaca kodenya. */}
          <View style={styles.picker}>
            {round.colors
              .map((c, i) => ({ c, i }))
              .sort((a, b) => a.c.hex.localeCompare(b.c.hex))
              .map(({ c, i }) => (
                <Pressable
                  key={c.hex}
                  onPress={() => setPicked(i)}
                  accessibilityLabel={`Warna ${c.name}`}
                  style={[styles.swatch, { backgroundColor: c.hex }, picked === i && styles.swatchActive]}
                />
              ))}
          </View>
        </View>
      )}
    </View>
  );
}

/** Satu benda berangka. Bergoyang sebentar saat jawaban salah. */
function CodeItem({ kind, number, fill, wrong, size, onPress }: { kind: ShapeKind; number: number; fill: string | null; wrong: boolean; size: number; onPress: () => void }) {
  const [shake] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (!wrong) return;
    Animated.sequence(
      [8, -8, 6, -6, 0].map((v) => Animated.timing(shake, { toValue: v, duration: 60, useNativeDriver: true })),
    ).start();
  }, [wrong, shake]);

  const pos = shapeDef(kind).code ?? { x: 50, y: 55 };
  const badge = size * 0.24;

  return (
    <Pressable onPress={onPress} disabled={!!fill}>
      <Animated.View style={{ width: size, height: size, transform: [{ translateX: shake }] }}>
        <Shape kind={kind} color={fill ?? BLANK} size={size} />
        {!fill && (
          <View
            pointerEvents="none"
            style={[styles.badge, { width: badge, height: badge, left: (pos.x / 100) * size - badge / 2, top: (pos.y / 100) * size - badge / 2 }]}
          >
            <Text style={[styles.badgeText, { fontSize: badge * 0.8 }, wrong && styles.badgeWrong]}>{wrong ? '✕' : number}</Text>
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 14, gap: 10 },
  legend: { flexDirection: 'row', justifyContent: 'center', gap: 14, backgroundColor: '#fff', borderRadius: 16, borderWidth: 3, paddingVertical: 10 },
  legendItem: { alignItems: 'center' },
  legendDot: { width: 48, height: 48, borderRadius: 24, borderWidth: 3, borderColor: '#3A3A3A', alignItems: 'center', justifyContent: 'center' },
  legendNum: { fontSize: 24, fontWeight: '900', color: '#fff', textShadowColor: '#000', textShadowRadius: 3, textShadowOffset: { width: 0, height: 1 } },
  board: { flex: 1, backgroundColor: '#fff', borderRadius: 18, borderWidth: 3, overflow: 'hidden' },
  grid: { flex: 1, flexDirection: 'row', flexWrap: 'wrap' },
  cell: { alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  badgeText: { fontWeight: '900', color: '#37474F', includeFontPadding: false },
  badgeWrong: { color: '#E53935', transform: [{ scale: 1.5 }] },
  pickerWrap: { gap: 6, alignItems: 'center' },
  pickerLabel: { fontSize: 14, fontWeight: '700', color: '#666' },
  hint: { color: '#E53935' },
  picker: { flexDirection: 'row', gap: 14, justifyContent: 'center' },
  swatch: { width: 54, height: 54, borderRadius: 27, borderWidth: 3, borderColor: '#fff', elevation: 3 },
  swatchActive: { borderColor: '#333', transform: [{ scale: 1.18 }] },
  banner: { borderRadius: 14, padding: 12, alignItems: 'center', gap: 10, backgroundColor: '#E8F5E9' },
  bannerText: { fontSize: 17, fontWeight: '800', color: '#333' },
  bigBtn: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 14 },
  bigBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});
