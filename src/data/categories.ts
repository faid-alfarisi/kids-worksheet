import { SHEETS } from './sheets';

export type Category = {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  color: string;
  soft: string;
  /** Kategori permainan acak: langsung buka layar ini, bukan daftar lembar soal. */
  route?: '/cari-jalan' | '/memasangkan' | '/perbandingan' | '/coding';
};

export const CATEGORIES: Category[] = [
  { id: 'carijalan', title: 'Cari Jalan', subtitle: 'Atur arah robot sampai ke bintang', emoji: '🤖', color: '#7C4DFF', soft: '#EDE7FF', route: '/cari-jalan' },
  { id: 'coding', title: 'Coding', subtitle: 'Warnai sesuai kode angka', emoji: '🧠', color: '#3949AB', soft: '#E6E9F8', route: '/coding' },
  { id: 'berhitung', title: 'Berhitung', subtitle: 'Hitung benda & penjumlahan', emoji: '🔢', color: '#FF7043', soft: '#FFE9E2' },
  { id: 'memasangkan', title: 'Memasangkan', subtitle: 'Warna, bayangan, pasangan & hitung', emoji: '🧩', color: '#26A69A', soft: '#DFF5F2', route: '/memasangkan' },
  { id: 'menggaris', title: 'Menggaris', subtitle: 'Tebalkan garis & cari jalan (maze)', emoji: '✏️', color: '#42A5F5', soft: '#E3F2FD' },
  { id: 'mewarnai', title: 'Mewarnai', subtitle: 'Warnai gambar sesukamu', emoji: '🖍️', color: '#EC407A', soft: '#FCE4EC' },
  { id: 'melengkapi', title: 'Melengkapi Gambar', subtitle: 'Lengkapi separuh gambar hewan', emoji: '🦁', color: '#FFA000', soft: '#FFF3D6' },
  { id: 'perbandingan', title: 'Perbandingan', subtitle: 'Mana yang besar, mana yang kecil?', emoji: '⚖️', color: '#8D6E63', soft: '#F1E9E5', route: '/perbandingan' },
  { id: 'menulis', title: 'Menulis', subtitle: 'Tebalkan huruf & angka', emoji: '📝', color: '#5C6BC0', soft: '#E8EAF6' },
  { id: 'membaca', title: 'Membaca', subtitle: 'Membaca jam & mencari huruf', emoji: '⏰', color: '#00ACC1', soft: '#DFF6F9' },
  { id: 'warna', title: 'Mengenal Warna', subtitle: 'Kenali & cocokkan warna', emoji: '🎨', color: '#AB47BC', soft: '#F5E5F8' },
  { id: 'menggambar', title: 'Menggambar', subtitle: 'Gambar hewan langkah demi langkah', emoji: '🐰', color: '#66BB6A', soft: '#E6F5E7' },
];

export const getCategory = (id: string) => CATEGORIES.find((c) => c.id === id);

export const countItems = (id: string) => SHEETS[id]?.length ?? 0;
