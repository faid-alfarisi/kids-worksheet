import { Stack } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Category } from '../data/categories';

/** Kerangka layar permainan acak: header berwarna, isi, dan tombol acak di bawah. */
export function GameScreen({ cat, shuffleLabel, onShuffle, children }: { cat: Category; shuffleLabel: string; onShuffle: () => void; children: ReactNode }) {
  const insets = useSafeAreaInsets();
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
        <Pressable onPress={onShuffle} style={({ pressed }) => [styles.shuffle, { backgroundColor: cat.color }, pressed && { opacity: 0.8 }]}>
          <Text style={styles.shuffleText}>🔀 {shuffleLabel}</Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1 },
  bar: { paddingHorizontal: 12, paddingTop: 10, backgroundColor: '#fff' },
  shuffle: { paddingVertical: 12, borderRadius: 14, alignItems: 'center' },
  shuffleText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});
