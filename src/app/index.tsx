import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CATEGORIES } from '../data/categories';

export default function Home() {
  const insets = useSafeAreaInsets();
  return (
    <FlatList
      data={CATEGORIES}
      keyExtractor={(c) => c.id}
      contentContainerStyle={[styles.list, { paddingBottom: 24 + insets.bottom }]}
      ListHeaderComponent={<Text style={styles.hello}>Mau belajar apa hari ini? 👋</Text>}
      ListFooterComponent={
        <Pressable
          onPress={() => router.push('/katalog-shape')}
          style={({ pressed }) => [styles.katalogBtn, pressed && styles.pressed]}
        >
          <Text style={styles.katalogText}>🎨 Lihat Katalog Shape & Gambar</Text>
        </Pressable>
      }
      renderItem={({ item }) => (
        <Pressable
          onPress={() => router.push(item.route)}
          style={({ pressed }) => [styles.card, { backgroundColor: item.soft, borderColor: item.color }, pressed && styles.pressed]}
        >
          <View style={[styles.badge, { backgroundColor: item.color }]}>
            <Text style={styles.emoji}>{item.emoji}</Text>
          </View>
          <View style={styles.body}>
            <Text style={[styles.title, { color: item.color }]}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 16, gap: 14, paddingBottom: 32 },
  hello: { fontSize: 18, fontWeight: '700', color: '#555', marginBottom: 2 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 22,
    borderWidth: 2,
    padding: 14,
    gap: 14,
  },
  pressed: { transform: [{ scale: 0.97 }], opacity: 0.9 },
  badge: { width: 64, height: 64, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 34 },
  body: { flex: 1 },
  title: { fontSize: 22, fontWeight: '900' },
  subtitle: { fontSize: 14, color: '#555', marginTop: 2 },
  katalogBtn: {
    marginTop: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#CFD8DC',
    backgroundColor: '#F5F7F8',
    alignItems: 'center',
  },
  katalogText: { fontSize: 14, fontWeight: '800', color: '#546E7A' },
});
