import { Stack } from 'expo-router';
import { memo } from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Shape, SHAPE_GROUPS, SHAPE_KINDS, shapeDef, type ShapeKind } from '../shapes';

const MODE_SIZE = 66;

type Row = { kind: ShapeKind; seq: number };
type Section = { title: string; count: number; isFirst: boolean; data: Row[] };

const SECTIONS: Section[] = (() => {
  let seq = 0;
  return Object.entries(SHAPE_GROUPS).map(([title, shapes], idx) => {
    const kinds = Object.keys(shapes) as ShapeKind[];
    return {
      title,
      count: kinds.length,
      isFirst: idx === 0,
      data: kinds.map((kind) => ({ kind, seq: ++seq })),
    };
  });
})();

const ShapeCard = memo(function ShapeCard({ kind, seq }: Row) {
  const def = shapeDef(kind);
  return (
    <View style={styles.item}>
      <View style={styles.itemHeader}>
        <View style={styles.titleRow}>
          <Text style={styles.seq}>#{seq}</Text>
          <Text style={styles.name}>{def.name}</Text>
        </View>
        <View style={styles.colorTag}>
          <View style={[styles.colorDot, { backgroundColor: def.color }]} />
          <Text style={styles.label}>{kind}</Text>
        </View>
      </View>
      <View style={styles.modes}>
        <View style={styles.modeCol}>
          <Shape kind={kind} size={MODE_SIZE} />
          <Text style={styles.modeLabel}>Warna</Text>
        </View>
        <View style={styles.modeCol}>
          <Shape kind={kind} size={MODE_SIZE} trace />
          <Text style={styles.modeLabel}>Putus-putus</Text>
        </View>
        <View style={styles.modeCol}>
          <Shape kind={kind} size={MODE_SIZE} lineOnly />
          <Text style={styles.modeLabel}>Garis</Text>
        </View>
        <View style={styles.modeCol}>
          <Shape kind={kind} size={MODE_SIZE} silhouette />
          <Text style={styles.modeLabel}>Bayangan</Text>
        </View>
      </View>
    </View>
  );
});

/**
 * Katalog semua shape (lebar 100%, tervirtualisasi dengan SectionList agar instan walau ratusan shape).
 * Menampilkan 4 mode tiap shape: Warna, Putus-putus, Garis, dan Bayangan.
 */
export default function KatalogShape() {
  const insets = useSafeAreaInsets();

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
        renderItem={({ item }) => <ShapeCard kind={item.kind} seq={item.seq} />}
        ListFooterComponent={
          <View style={styles.totalCard}>
            <Text style={styles.totalText}>Total keseluruhan: {SHAPE_KINDS.length} shape</Text>
            <Text style={styles.totalSub}>Dari {SECTIONS.length} kategori</Text>
          </View>
        }
      />
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
});
