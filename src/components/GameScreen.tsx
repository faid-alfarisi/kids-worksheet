import { router, Stack } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Category } from '../data/categories';

/** Kembali ke beranda; kalau layar dibuka langsung (tanpa riwayat), ganti dengan beranda. */
function goHome() {
  if (router.canDismiss()) router.dismissTo('/');
  else router.replace('/');
}

/** Kerangka layar permainan acak: header berwarna, isi, dan tombol Home + Acak/Main Lagi di bawah. */
export function GameScreen({
  cat,
  shuffleLabel,
  done = false,
  onShuffle,
  children,
}: {
  cat: Category;
  shuffleLabel: string;
  done?: boolean;
  onShuffle: () => void;
  children: ReactNode;
}) {
  const insets = useSafeAreaInsets();
  const btnColor = done ? '#43A047' : cat.color;
  return (
    <>
      <Stack.Screen
        options={{
          title: `${cat.emoji} ${cat.title}`,
          headerStyle: { backgroundColor: cat.color },
          headerTintColor: '#fff',
          contentStyle: { backgroundColor: cat.soft },
        }}
      />
      <View style={styles.content}>{children}</View>
      <View style={[styles.bar, { paddingBottom: 10 + insets.bottom }]}>
        <Pressable
          onPress={goHome}
          accessibilityLabel="Kembali ke beranda"
          style={({ pressed }) => [styles.home, { borderColor: cat.color }, pressed && { opacity: 0.7 }]}
        >
          <Text style={styles.homeText}>🏠</Text>
        </Pressable>
        <Pressable onPress={onShuffle} style={({ pressed }) => [styles.shuffle, { backgroundColor: btnColor }, pressed && { opacity: 0.8 }]}>
          <Text style={styles.shuffleText}>{done ? '🎉 Main Lagi' : `🔀 ${shuffleLabel}`}</Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1 },
  bar: { flexDirection: 'row', gap: 10, paddingHorizontal: 12, paddingTop: 10, backgroundColor: '#fff' },
  home: { width: 56, borderRadius: 14, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  homeText: { fontSize: 24 },
  shuffle: { flex: 1, paddingVertical: 12, borderRadius: 14, alignItems: 'center' },
  shuffleText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});
