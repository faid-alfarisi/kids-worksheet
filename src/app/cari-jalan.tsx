import { Stack } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MazeGame } from '../components/MazeGame';
import { getCategory, MAZE_ID } from '../data/categories';
import { randomLevel } from '../data/maze';

/** Cari Jalan: langsung main dengan peta acak, tombol Acak untuk peta baru. */
export default function CariJalanScreen() {
  const cat = getCategory(MAZE_ID)!;
  const insets = useSafeAreaInsets();
  const [round, setRound] = useState(() => ({ id: 0, level: randomLevel() }));
  const shuffle = () => setRound((r) => ({ id: r.id + 1, level: randomLevel() }));

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
      <View style={styles.content}>
        <MazeGame key={round.id} level={round.level} color={cat.color} onShuffle={shuffle} />
      </View>
      <View style={[styles.bar, { paddingBottom: 10 + insets.bottom }]}>
        <Pressable onPress={shuffle} style={({ pressed }) => [styles.shuffle, { backgroundColor: cat.color }, pressed && { opacity: 0.8 }]}>
          <Text style={styles.shuffleText}>🔀 Acak Jalan Baru</Text>
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
