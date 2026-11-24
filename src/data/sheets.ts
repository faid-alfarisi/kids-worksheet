// File ini dibuat otomatis dari folder referensi. Tambah soal: taruh gambar di assets/worksheets/<kategori>/ lalu daftarkan di sini.
// require() gambar lokal menghasilkan id aset (number).


export type Sheet = { image: number; thumb: number; w: number; h: number };

export const SHEETS: Record<string, Sheet[]> = {
  menggaris: [
    { image: require('../../assets/worksheets/menggaris/01.jpg'), thumb: require('../../assets/worksheets/menggaris/01_t.jpg'), w: 1080, h: 1528 },
    { image: require('../../assets/worksheets/menggaris/02.jpg'), thumb: require('../../assets/worksheets/menggaris/02_t.jpg'), w: 1080, h: 1528 },
    { image: require('../../assets/worksheets/menggaris/03.jpg'), thumb: require('../../assets/worksheets/menggaris/03_t.jpg'), w: 1080, h: 1528 },
    { image: require('../../assets/worksheets/menggaris/04.jpg'), thumb: require('../../assets/worksheets/menggaris/04_t.jpg'), w: 1080, h: 1524 },
    { image: require('../../assets/worksheets/menggaris/05.jpg'), thumb: require('../../assets/worksheets/menggaris/05_t.jpg'), w: 736, h: 1041 },
  ],
  mewarnai: [
    { image: require('../../assets/worksheets/mewarnai/01.jpg'), thumb: require('../../assets/worksheets/mewarnai/01_t.jpg'), w: 670, h: 867 },
    { image: require('../../assets/worksheets/mewarnai/02.jpg'), thumb: require('../../assets/worksheets/mewarnai/02_t.jpg'), w: 736, h: 1045 },
    { image: require('../../assets/worksheets/mewarnai/03.jpg'), thumb: require('../../assets/worksheets/mewarnai/03_t.jpg'), w: 447, h: 447 },
    { image: require('../../assets/worksheets/mewarnai/04.jpg'), thumb: require('../../assets/worksheets/mewarnai/04_t.jpg'), w: 1080, h: 1440 },
    { image: require('../../assets/worksheets/mewarnai/05.jpg'), thumb: require('../../assets/worksheets/mewarnai/05_t.jpg'), w: 720, h: 1040 },
  ],
  melengkapi: [
    { image: require('../../assets/worksheets/melengkapi/01.jpg'), thumb: require('../../assets/worksheets/melengkapi/01_t.jpg'), w: 1080, h: 1528 },
    { image: require('../../assets/worksheets/melengkapi/02.jpg'), thumb: require('../../assets/worksheets/melengkapi/02_t.jpg'), w: 1080, h: 1528 },
    { image: require('../../assets/worksheets/melengkapi/03.jpg'), thumb: require('../../assets/worksheets/melengkapi/03_t.jpg'), w: 1080, h: 1528 },
    { image: require('../../assets/worksheets/melengkapi/04.jpg'), thumb: require('../../assets/worksheets/melengkapi/04_t.jpg'), w: 1080, h: 1528 },
    { image: require('../../assets/worksheets/melengkapi/05.jpg'), thumb: require('../../assets/worksheets/melengkapi/05_t.jpg'), w: 1080, h: 1528 },
  ],
};
