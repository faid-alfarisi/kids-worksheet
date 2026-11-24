import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { CATEGORIES } from '../data/categories';

export default function Home() {
  return (
    <FlatList
      data={CATEGORIES}
      keyExtractor={(c) => c.id}
      contentContainerStyle={styles.list}
      ListHeaderComponent={<Text style={styles.hello}>Mau belajar apa hari ini? 👋</Text>}
      renderItem={({ item }) => (
        <Pressable
          onPress={() =>
            item.route ? router.push(item.route) : router.push({ pathname: '/kategori/[id]', params: { id: item.id } })
          }
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
});
