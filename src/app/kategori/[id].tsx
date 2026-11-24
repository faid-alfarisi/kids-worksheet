import { Image } from 'expo-image';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { getCategory } from '../../data/categories';
import { SHEETS } from '../../data/sheets';

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const cat = getCategory(id);
  if (!cat) return null;

  const items = (SHEETS[cat.id] ?? []).map((_, i) => i);

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
      <FlatList
        data={items}
        numColumns={2}
        keyExtractor={(i) => String(i)}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.row}
        renderItem={({ item: i }) => (
          <Pressable
            onPress={() => router.push({ pathname: '/soal/[cat]/[idx]', params: { cat: cat.id, idx: String(i) } })}
            style={({ pressed }) => [styles.card, { borderColor: cat.color }, pressed && styles.pressed]}
          >
            <View style={styles.thumbBox}>
              <Image source={SHEETS[cat.id][i].thumb} style={styles.thumb} contentFit="cover" contentPosition="top" />
            </View>
            <View style={[styles.label, { backgroundColor: cat.color }]}>
              <Text style={styles.labelText} numberOfLines={1}>
                Soal {i + 1}
              </Text>
            </View>
          </Pressable>
        )}
      />
    </>
  );
}

const styles = StyleSheet.create({
  list: { padding: 12, gap: 12, paddingBottom: 32 },
  row: { gap: 12 },
  card: { flex: 1, maxWidth: '48.5%', backgroundColor: '#fff', borderRadius: 18, borderWidth: 2, overflow: 'hidden' },
  pressed: { transform: [{ scale: 0.96 }] },
  thumbBox: { aspectRatio: 0.75, backgroundColor: '#fff' },
  thumb: { width: '100%', height: '100%' },
  label: { paddingVertical: 8, paddingHorizontal: 10 },
  labelText: { color: '#fff', fontWeight: '800', fontSize: 14, textAlign: 'center' },
});
