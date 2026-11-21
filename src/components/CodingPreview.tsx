import { StyleSheet, Text, View } from 'react-native';
import type { Level } from '../data/coding';

/** Gambar mini peta level untuk thumbnail. */
export function CodingPreview({ level }: { level: Level }) {
  return (
    <View style={styles.wrap}>
      {level.map.map((row, r) => (
        <View key={r} style={styles.row}>
          {row.split('').map((ch, c) => (
            <View key={c} style={[styles.cell, ch === '#' && styles.rock]}>
              {ch === 'R' && <Text style={styles.icon}>🤖</Text>}
              {ch === '*' && <Text style={styles.icon}>⭐</Text>}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: 10, justifyContent: 'center', gap: 3, backgroundColor: '#F6F2FF' },
  row: { flexDirection: 'row', gap: 3 },
  cell: { flex: 1, aspectRatio: 1, borderRadius: 5, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  rock: { backgroundColor: '#9E8C7A' },
  icon: { fontSize: 16 },
});
