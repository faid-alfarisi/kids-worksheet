import { SHEETS } from './sheets';

export type Category = {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  color: string;
  soft: string;
  /** Kategori permainan acak: langsung buka layar ini, bukan daftar lembar soal. */
  route?: '/cari-jalan' | '/memasangkan' | '/perbandingan' | '/coding' | '/mewarnai' | '/menulis' | '/menggambar' | '/menggaris' | '/berhitung';
};

export const CATEGORIES: Category[] = [
  { id: 'carijalan', title: 'Cari Jalan', subtitle: 'Atur arah robot sampai ke bintang', emoji: '🤖', color: '#7C4DFF', soft: '#EDE7FF', route: '/cari-jalan' },
  { id: 'coding', title: 'Coding', subtitle: 'Warnai sesuai kode angka', emoji: '🧠', color: '#3949AB', soft: '#E6E9F8', route: '/coding' },
  { id: 'berhitung', title: 'Berhitung', subtitle: 'Hitung, tambah & kurang', emoji: '🔢', color: '#FF7043', soft: '#FFE9E2', route: '/berhitung' },
  { id: 'memasangkan', title: 'Memasangkan', subtitle: 'Warna, bayangan & pasangan', emoji: '🧩', color: '#26A69A', soft: '#DFF5F2', route: '/memasangkan' },
  { id: 'menggaris', title: 'Menggaris', subtitle: 'Lurus, gelombang, zigzag & maze', emoji: '✏️', color: '#42A5F5', soft: '#E3F2FD', route: '/menggaris' },
  { id: 'mewarnai', title: 'Mewarnai', subtitle: 'Warnai gambar sesukamu', emoji: '🖍️', color: '#EC407A', soft: '#FCE4EC', route: '/mewarnai' },
  { id: 'melengkapi', title: 'Melengkapi', subtitle: 'Lengkapi separuh gambar hewan', emoji: '🦁', color: '#FFA000', soft: '#FFF3D6' },
  { id: 'perbandingan', title: 'Perbandingan', subtitle: 'Mana yang besar, mana yang kecil?', emoji: '⚖️', color: '#8D6E63', soft: '#F1E9E5', route: '/perbandingan' },
  { id: 'menulis', title: 'Menulis', subtitle: 'Tebalkan nama benda', emoji: '📝', color: '#5C6BC0', soft: '#E8EAF6', route: '/menulis' },
  { id: 'menggambar', title: 'Menggambar', subtitle: 'Tebalkan garis, lalu warnai', emoji: '🐰', color: '#66BB6A', soft: '#E6F5E7', route: '/menggambar' },
];

export const getCategory = (id: string) => CATEGORIES.find((c) => c.id === id);

export const countItems = (id: string) => SHEETS[id]?.length ?? 0;
