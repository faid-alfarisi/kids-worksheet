import { Stack } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Shape, SHAPE_GROUPS, type ShapeKind } from '../shapes';

/**
 * Katalog semua shape (untuk pengembang, tidak ada di menu).
 * Buka lewat: kidsworksheet://katalog-shape
 */
export default function KatalogShape() {
  return (
    <>
      <Stack.Screen options={{ title: 'Katalog Shape' }} />
      <ScrollView contentContainerStyle={styles.wrap}>
        {Object.entries(SHAPE_GROUPS).map(([group, shapes]) => (
          <View key={group} style={styles.group}>
            <Text style={styles.title}>{group}</Text>
            <View style={styles.grid}>
              {(Object.keys(shapes) as ShapeKind[]).map((kind) => (
                <View key={kind} style={styles.item}>
                  <View style={styles.pair}>
                    <Shape kind={kind} size={58} />
                    <Shape kind={kind} size={58} silhouette />
                  </View>
                  <Text style={styles.label}>{kind}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 12, gap: 16 },
  group: { gap: 6 },
  title: { fontSize: 18, fontWeight: '900', textTransform: 'capitalize', color: '#444' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  item: { backgroundColor: '#fff', borderRadius: 12, padding: 6, alignItems: 'center' },
  pair: { flexDirection: 'row' },
  label: { fontSize: 11, color: '#666' },
});
