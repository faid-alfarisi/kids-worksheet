import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DrawingSheet } from '../../../components/DrawingSheet';
import { countItems, getCategory } from '../../../data/categories';
import { SHEETS } from '../../../data/sheets';

export default function SoalScreen() {
  const { cat: catId, idx } = useLocalSearchParams<{ cat: string; idx: string }>();
  const cat = getCategory(catId);
  const insets = useSafeAreaInsets();
  if (!cat) return null;

  const i = Number(idx) || 0;
  const total = countItems(cat.id);
  const go = (n: number) => router.replace({ pathname: '/soal/[cat]/[idx]', params: { cat: cat.id, idx: String(n) } });

  return (
    <>
      <Stack.Screen
        options={{
          title: `${cat.title} · Soal ${i + 1}`,
          headerStyle: { backgroundColor: cat.color },
          headerTintColor: '#fff',
          contentStyle: { backgroundColor: cat.soft },
          animation: 'slide_from_right',
        }}
      />
      <View style={styles.content}>
        <DrawingSheet key={`${cat.id}-${i}`} sheet={SHEETS[cat.id][i]} color={cat.color} />
      </View>
      <View style={[styles.nav, { paddingBottom: 10 + insets.bottom }]}>
        <NavButton label="◀ Sebelumnya" disabled={i === 0} color={cat.color} onPress={() => go(i - 1)} />
        <Text style={styles.page}>
          {i + 1}/{total}
        </Text>
        <NavButton label="Berikutnya ▶" disabled={i >= total - 1} color={cat.color} onPress={() => go(i + 1)} />
      </View>
    </>
  );
}

function NavButton({ label, disabled, color, onPress }: { label: string; disabled: boolean; color: string; onPress: () => void }) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.btn, { backgroundColor: color, opacity: disabled ? 0.3 : pressed ? 0.8 : 1 }]}
    >
      <Text style={styles.btnText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1 },
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingTop: 10, backgroundColor: '#fff' },
  page: { fontSize: 16, fontWeight: '800', color: '#555' },
  btn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 14 },
  btnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
});
