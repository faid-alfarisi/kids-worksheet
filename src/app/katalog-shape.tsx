import { Stack } from 'expo-router';
import { type ComponentRef, memo, useCallback, useRef, useState } from 'react';
import {
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  SectionList,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Shape, SHAPE_GROUPS, SHAPE_KINDS, shapeDef, shapeGroupCount, type ShapeKind } from '../shapes';

const MODE_SIZE = 66;
const MODES = ['Warna', 'Putus-putus', 'Garis', 'Bayangan'] as const;

type Row = { kind: ShapeKind; seq: number; category: string };
type Section = { title: string; count: number; isFirst: boolean; data: Row[] };

const ALL_ROWS: Row[] = [];
const SECTIONS: Section[] = (() => {
  let seq = 0;
  return Object.entries(SHAPE_GROUPS).map(([title, shapes], idx) => {
    const kinds = Object.keys(shapes) as ShapeKind[];
    const data = kinds.map((kind) => {
      const row = { kind, seq: ++seq, category: title };
      ALL_ROWS.push(row);
      return row;
    });
    return { title, count: kinds.length, isFirst: idx === 0, data };
  });
})();

const ShapeCard = memo(function ShapeCard({
  row,
  onPress,
}: {
  row: Row;
  onPress: (index: number) => void;
}) {
  const def = shapeDef(row.kind);
  return (
    <Pressable
      onPress={() => onPress(row.seq - 1)}
      style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
    >
      <View style={styles.itemHeader}>
        <View style={styles.titleRow}>
          <Text style={styles.seq}>#{row.seq}</Text>
          <Text style={styles.name}>{def.name}</Text>
        </View>
        <View style={styles.colorTag}>
          <View style={[styles.colorDot, { backgroundColor: def.color }]} />
          <Text style={styles.label}>{row.kind}</Text>
        </View>
      </View>
      <View style={styles.modes}>
        <View style={styles.modeCol}>
          <Shape kind={row.kind} size={MODE_SIZE} />
          <Text style={styles.modeLabel}>Warna</Text>
        </View>
        <View style={styles.modeCol}>
          <Shape kind={row.kind} size={MODE_SIZE} trace />
          <Text style={styles.modeLabel}>Putus-putus</Text>
        </View>
        <View style={styles.modeCol}>
          <Shape kind={row.kind} size={MODE_SIZE} lineOnly />
          <Text style={styles.modeLabel}>Garis</Text>
        </View>
        <View style={styles.modeCol}>
          <Shape kind={row.kind} size={MODE_SIZE} silhouette />
          <Text style={styles.modeLabel}>Bayangan</Text>
        </View>
      </View>
    </Pressable>
  );
});

/** Overlay garis + titik koordinat angka Coding untuk inspeksi detail di popup katalog. */
function LineWithCoords({ kind, size }: { kind: ShapeKind; size: number }) {
  const def = shapeDef(kind);
  const multiTargets = (def.els ?? []).filter((e) => e.n && e.at);
  const isMulti = multiTargets.length > 0;
  const badge = isMulti ? size * 0.115 : size * 0.14;

  return (
    <View style={{ width: size, height: size }}>
      <Shape kind={kind} size={size} lineOnly />
      {isMulti
        ? multiTargets.map((el, i) => {
            const [ax, ay] = el.at!;
            return (
              <View
                key={i}
                pointerEvents="none"
                style={[
                  styles.coordBadge,
                  {
                    width: badge,
                    height: badge,
                    borderRadius: badge / 2,
                    left: (ax / 100) * size - badge / 2,
                    top: (ay / 100) * size - badge / 2,
                  },
                ]}
              >
                <Text style={[styles.coordBadgeText, { fontSize: badge * 0.62 }]}>{el.n}</Text>
              </View>
            );
          })
        : def.code && (
            <View
              pointerEvents="none"
              style={[
                styles.coordBadge,
                {
                  width: badge,
                  height: badge,
                  borderRadius: badge / 2,
                  left: (def.code.x / 100) * size - badge / 2,
                  top: (def.code.y / 100) * size - badge / 2,
                },
              ]}
            >
              <Text style={[styles.coordBadgeText, { fontSize: badge * 0.62 }]}>1</Text>
            </View>
          )}
    </View>
  );
}

/**
 * Katalog semua shape (lebar 100%, tervirtualisasi dengan SectionList agar instan walau ratusan shape).
 * Ketuk kartu mana pun untuk membuka popup perbesaran (slide kanan-kiri antar 4 mode + titik angka Coding di tab Garis).
 */
export default function KatalogShape() {
  const insets = useSafeAreaInsets();
  const { width: winW } = useWindowDimensions();
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [modeIdx, setModeIdx] = useState(0);
  const pagerRef = useRef<ComponentRef<typeof ScrollView>>(null);

  const openModal = useCallback((idx: number) => {
    setSelectedIdx(idx);
    setModeIdx(0);
    setTimeout(() => pagerRef.current?.scrollTo({ x: 0, animated: false }), 0);
  }, []);

  const closeModal = () => setSelectedIdx(null);

  const modalW = Math.min(winW - 28, 380);
  const slideW = modalW - 24;
  const bigSize = Math.min(slideW - 28, 240);

  const jumpMode = (i: number) => {
    setModeIdx(i);
    pagerRef.current?.scrollTo({ x: i * slideW, animated: true });
  };

  const onMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / slideW);
    if (idx >= 0 && idx < MODES.length) setModeIdx(idx);
  };

  const selected = selectedIdx !== null ? ALL_ROWS[selectedIdx] : null;
  const selectedDef = selected ? shapeDef(selected.kind) : null;
  const multiTargets = selectedDef ? (selectedDef.els ?? []).filter((e) => e.n && e.at) : [];
  const isMulti = multiTargets.length > 0;
  const groupCount = selected ? shapeGroupCount(selected.kind) : 1;

  return (
    <>
      <Stack.Screen options={{ title: `Katalog Shape (${SHAPE_KINDS.length})` }} />
      <SectionList
        sections={SECTIONS}
        keyExtractor={(item) => item.kind}
        contentContainerStyle={[styles.wrap, { paddingBottom: 28 + insets.bottom }]}
        stickySectionHeadersEnabled={false}
        initialNumToRender={5}
        maxToRenderPerBatch={4}
        windowSize={5}
        removeClippedSubviews
        renderSectionHeader={({ section }) => (
          <View style={[styles.groupHeader, !section.isFirst && styles.groupGap]}>
            <Text style={styles.title}>{section.title}</Text>
            <View style={styles.countPill}>
              <Text style={styles.countPillText}>{section.count}</Text>
            </View>
          </View>
        )}
        renderItem={({ item }) => <ShapeCard row={item} onPress={openModal} />}
        ListFooterComponent={
          <View style={styles.totalCard}>
            <Text style={styles.totalText}>Total keseluruhan: {SHAPE_KINDS.length} shape</Text>
            <Text style={styles.totalSub}>Dari {SECTIONS.length} kategori</Text>
          </View>
        }
      />

      <Modal visible={selected !== null} transparent animationType="fade" onRequestClose={closeModal}>
        <Pressable style={styles.backdrop} onPress={closeModal}>
          {selected && selectedDef && (
            <Pressable style={[styles.modalCard, { width: modalW }]} onPress={() => {}}>
              {/* Header modal */}
              <View style={styles.modalHeader}>
                <View style={styles.modalTitleWrap}>
                  <Text style={styles.modalTitle}>
                    #{selected.seq} {selectedDef.name}
                  </Text>
                  <View style={styles.metaRow}>
                    <Text style={styles.metaText}>{selected.category} · {selected.kind}</Text>
                    <View style={[styles.typeBadge, isMulti ? styles.typeBadgeMulti : styles.typeBadgeSingle]}>
                      <Text style={[styles.typeBadgeText, isMulti ? styles.typeBadgeMultiText : styles.typeBadgeSingleText]}>
                        {isMulti ? `Multi-warna (${groupCount})` : '1 warna'}
                      </Text>
                    </View>
                  </View>
                </View>
                <Pressable onPress={closeModal} style={styles.closeBtn} hitSlop={8}>
                  <Text style={styles.closeText}>✕</Text>
                </Pressable>
              </View>

              {/* Tab pills (bisa diklik atau slide kanan-kiri) */}
              <View style={styles.tabRow}>
                {MODES.map((label, i) => (
                  <Pressable
                    key={label}
                    onPress={() => jumpMode(i)}
                    style={[styles.tabPill, modeIdx === i && styles.tabPillActive]}
                  >
                    <Text style={[styles.tabText, modeIdx === i && styles.tabTextActive]}>{label}</Text>
                  </Pressable>
                ))}
              </View>

              {/* Slider horizontal 4 mode */}
              <ScrollView
                ref={pagerRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={onMomentumEnd}
                style={{ width: slideW }}
              >
                <View style={[styles.slide, { width: slideW }]}>
                  <View style={styles.previewBox}>
                    <Shape kind={selected.kind} size={bigSize} />
                  </View>
                  <Text style={styles.slideHint}>Geser kanan/kiri untuk lihat mode lain</Text>
                </View>
                <View style={[styles.slide, { width: slideW }]}>
                  <View style={styles.previewBox}>
                    <Shape kind={selected.kind} size={bigSize} trace />
                  </View>
                  <Text style={styles.slideHint}>Mode garis putus-putus (tebalkan gambar)</Text>
                </View>
                <View style={[styles.slide, { width: slideW }]}>
                  <View style={styles.previewBox}>
                    <LineWithCoords kind={selected.kind} size={bigSize} />
                  </View>
                  <Text style={styles.slideHint}>
                    {isMulti
                      ? `Titik Coding: ${multiTargets.length} bagian (${groupCount} kelompok, angka diacak saat main)`
                      : selectedDef.code
                        ? `Titik Coding 1-warna: [${selectedDef.code.x}, ${selectedDef.code.y}] (angka diacak saat main)`
                        : 'Tidak dipakai di mode Coding'}
                  </Text>
                </View>
                <View style={[styles.slide, { width: slideW }]}>
                  <View style={styles.previewBox}>
                    <Shape kind={selected.kind} size={bigSize} silhouette />
                  </View>
                  <Text style={styles.slideHint}>Mode bayangan (cocokkan bayangan)</Text>
                </View>
              </ScrollView>

              {/* Navigasi shape sebelumnya / berikutnya */}
              <View style={styles.navRow}>
                <Pressable
                  disabled={selectedIdx === 0}
                  onPress={() => setSelectedIdx((i) => (i !== null && i > 0 ? i - 1 : i))}
                  style={({ pressed }) => [styles.navBtn, selectedIdx === 0 && styles.navBtnDisabled, pressed && styles.navBtnPressed]}
                >
                  <Text style={styles.navBtnText}>‹ Sebelumnya</Text>
                </Pressable>
                <Text style={styles.navCounter}>
                  {selected.seq} / {ALL_ROWS.length}
                </Text>
                <Pressable
                  disabled={selectedIdx === ALL_ROWS.length - 1}
                  onPress={() => setSelectedIdx((i) => (i !== null && i < ALL_ROWS.length - 1 ? i + 1 : i))}
                  style={({ pressed }) => [
                    styles.navBtn,
                    selectedIdx === ALL_ROWS.length - 1 && styles.navBtnDisabled,
                    pressed && styles.navBtnPressed,
                  ]}
                >
                  <Text style={styles.navBtnText}>Berikutnya ›</Text>
                </Pressable>
              </View>
            </Pressable>
          )}
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 14 },
  groupGap: { marginTop: 22 },
  groupHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  title: { fontSize: 20, fontWeight: '900', textTransform: 'capitalize', color: '#37474F' },
  countPill: {
    backgroundColor: '#E53935',
    minWidth: 26,
    height: 24,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countPillText: { color: '#fff', fontSize: 12, fontWeight: '900' },
  item: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    padding: 12,
    gap: 8,
    marginBottom: 10,
  },
  itemPressed: { backgroundColor: '#F5F7FA', transform: [{ scale: 0.99 }] },
  itemHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  seq: { fontSize: 13, fontWeight: '900', color: '#90A4AE' },
  name: { fontSize: 16, fontWeight: '800', color: '#333', textTransform: 'capitalize' },
  colorTag: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  colorDot: { width: 14, height: 14, borderRadius: 7, borderWidth: 1, borderColor: '#3A3A3A' },
  label: { fontSize: 12, color: '#78909C', fontWeight: '700' },
  modes: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modeCol: { alignItems: 'center', gap: 4 },
  modeLabel: { fontSize: 11, color: '#78909C', fontWeight: '700' },
  totalCard: {
    marginTop: 18,
    backgroundColor: '#ECEFF1',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 2,
  },
  totalText: { fontSize: 16, fontWeight: '900', color: '#37474F' },
  totalSub: { fontSize: 13, fontWeight: '600', color: '#607D8B' },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.52)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 12,
    gap: 10,
    elevation: 6,
  },
  modalHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 },
  modalTitleWrap: { flex: 1, gap: 3 },
  modalTitle: { fontSize: 18, fontWeight: '900', color: '#263238', textTransform: 'capitalize' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  metaText: { fontSize: 12, fontWeight: '600', color: '#78909C', textTransform: 'capitalize' },
  typeBadge: { borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 },
  typeBadgeMulti: { backgroundColor: '#EDE7F6' },
  typeBadgeSingle: { backgroundColor: '#ECEFF1' },
  typeBadgeText: { fontSize: 11, fontWeight: '800' },
  typeBadgeMultiText: { color: '#5E35B1' },
  typeBadgeSingleText: { color: '#546E7A' },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ECEFF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: { fontSize: 15, fontWeight: '900', color: '#455A64' },
  tabRow: { flexDirection: 'row', gap: 6 },
  tabPill: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  tabPillActive: { backgroundColor: '#1E88E5' },
  tabText: { fontSize: 12, fontWeight: '800', color: '#546E7A' },
  tabTextActive: { color: '#fff' },
  slide: { alignItems: 'center', gap: 8, paddingVertical: 4 },
  previewBox: {
    backgroundColor: '#FAFAFA',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slideHint: { fontSize: 12, fontWeight: '600', color: '#607D8B', textAlign: 'center', paddingHorizontal: 8 },
  coordBadge: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderWidth: 1.5,
    borderColor: '#3A3A3A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coordBadgeText: { fontWeight: '900', color: '#263238' },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#ECEFF1',
  },
  navBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#ECEFF1',
  },
  navBtnPressed: { backgroundColor: '#CFD8DC' },
  navBtnDisabled: { opacity: 0.35 },
  navBtnText: { fontSize: 13, fontWeight: '800', color: '#37474F' },
  navCounter: { fontSize: 13, fontWeight: '800', color: '#78909C' },
});
