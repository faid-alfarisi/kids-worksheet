// File ini dibuat otomatis dari folder referensi. Tambah soal: taruh gambar di assets/worksheets/<kategori>/ lalu daftarkan di sini.
// require() gambar lokal menghasilkan id aset (number).


export type Sheet = { image: number; thumb: number; w: number; h: number };

export const SHEETS: Record<string, Sheet[]> = {
  coding: [
    { image: require('../../assets/worksheets/coding/01.jpg'), thumb: require('../../assets/worksheets/coding/01_t.jpg'), w: 466, h: 658 },
    { image: require('../../assets/worksheets/coding/02.jpg'), thumb: require('../../assets/worksheets/coding/02_t.jpg'), w: 466, h: 659 },
    { image: require('../../assets/worksheets/coding/03.jpg'), thumb: require('../../assets/worksheets/coding/03_t.jpg'), w: 393, h: 508 },
    { image: require('../../assets/worksheets/coding/04.jpg'), thumb: require('../../assets/worksheets/coding/04_t.jpg'), w: 465, h: 659 },
    { image: require('../../assets/worksheets/coding/05.jpg'), thumb: require('../../assets/worksheets/coding/05_t.jpg'), w: 387, h: 516 },
  ],
  berhitung: [
    { image: require('../../assets/worksheets/berhitung/01.jpg'), thumb: require('../../assets/worksheets/berhitung/01_t.jpg'), w: 940, h: 1332 },
    { image: require('../../assets/worksheets/berhitung/02.jpg'), thumb: require('../../assets/worksheets/berhitung/02_t.jpg'), w: 736, h: 1045 },
    { image: require('../../assets/worksheets/berhitung/03.jpg'), thumb: require('../../assets/worksheets/berhitung/03_t.jpg'), w: 764, h: 1080 },
    { image: require('../../assets/worksheets/berhitung/04.jpg'), thumb: require('../../assets/worksheets/berhitung/04_t.jpg'), w: 764, h: 1080 },
    { image: require('../../assets/worksheets/berhitung/05.jpg'), thumb: require('../../assets/worksheets/berhitung/05_t.jpg'), w: 764, h: 1080 },
    { image: require('../../assets/worksheets/berhitung/06.jpg'), thumb: require('../../assets/worksheets/berhitung/06_t.jpg'), w: 764, h: 1080 },
    { image: require('../../assets/worksheets/berhitung/07.jpg'), thumb: require('../../assets/worksheets/berhitung/07_t.jpg'), w: 466, h: 659 },
    { image: require('../../assets/worksheets/berhitung/08.jpg'), thumb: require('../../assets/worksheets/berhitung/08_t.jpg'), w: 1080, h: 1528 },
    { image: require('../../assets/worksheets/berhitung/09.jpg'), thumb: require('../../assets/worksheets/berhitung/09_t.jpg'), w: 1080, h: 1528 },
    { image: require('../../assets/worksheets/berhitung/10.jpg'), thumb: require('../../assets/worksheets/berhitung/10_t.jpg'), w: 1080, h: 1528 },
    { image: require('../../assets/worksheets/berhitung/11.jpg'), thumb: require('../../assets/worksheets/berhitung/11_t.jpg'), w: 1080, h: 1528 },
    { image: require('../../assets/worksheets/berhitung/12.jpg'), thumb: require('../../assets/worksheets/berhitung/12_t.jpg'), w: 1080, h: 1528 },
  ],
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
  menulis: [
    { image: require('../../assets/worksheets/menulis/01.jpg'), thumb: require('../../assets/worksheets/menulis/01_t.jpg'), w: 764, h: 1080 },
    { image: require('../../assets/worksheets/menulis/02.jpg'), thumb: require('../../assets/worksheets/menulis/02_t.jpg'), w: 465, h: 660 },
    { image: require('../../assets/worksheets/menulis/03.jpg'), thumb: require('../../assets/worksheets/menulis/03_t.jpg'), w: 1080, h: 1534 },
  ],
  membaca: [
    { image: require('../../assets/worksheets/membaca/01.jpg'), thumb: require('../../assets/worksheets/membaca/01_t.jpg'), w: 1080, h: 1528 },
    { image: require('../../assets/worksheets/membaca/02.jpg'), thumb: require('../../assets/worksheets/membaca/02_t.jpg'), w: 1080, h: 1528 },
    { image: require('../../assets/worksheets/membaca/03.jpg'), thumb: require('../../assets/worksheets/membaca/03_t.jpg'), w: 1080, h: 1528 },
    { image: require('../../assets/worksheets/membaca/04.jpg'), thumb: require('../../assets/worksheets/membaca/04_t.jpg'), w: 1080, h: 810 },
  ],
  warna: [
    { image: require('../../assets/worksheets/warna/01.jpg'), thumb: require('../../assets/worksheets/warna/01_t.jpg'), w: 1080, h: 1528 },
    { image: require('../../assets/worksheets/warna/02.jpg'), thumb: require('../../assets/worksheets/warna/02_t.jpg'), w: 456, h: 673 },
    { image: require('../../assets/worksheets/warna/03.jpg'), thumb: require('../../assets/worksheets/warna/03_t.jpg'), w: 466, h: 658 },
    { image: require('../../assets/worksheets/warna/04.jpg'), thumb: require('../../assets/worksheets/warna/04_t.jpg'), w: 325, h: 490 },
  ],
  menggambar: [
    { image: require('../../assets/worksheets/menggambar/01.jpg'), thumb: require('../../assets/worksheets/menggambar/01_t.jpg'), w: 549, h: 575 },
    { image: require('../../assets/worksheets/menggambar/02.jpg'), thumb: require('../../assets/worksheets/menggambar/02_t.jpg'), w: 547, h: 589 },
    { image: require('../../assets/worksheets/menggambar/03.jpg'), thumb: require('../../assets/worksheets/menggambar/03_t.jpg'), w: 554, h: 555 },
    { image: require('../../assets/worksheets/menggambar/04.jpg'), thumb: require('../../assets/worksheets/menggambar/04_t.jpg'), w: 544, h: 583 },
    { image: require('../../assets/worksheets/menggambar/05.jpg'), thumb: require('../../assets/worksheets/menggambar/05_t.jpg'), w: 549, h: 610 },
    { image: require('../../assets/worksheets/menggambar/06.jpg'), thumb: require('../../assets/worksheets/menggambar/06_t.jpg'), w: 551, h: 588 },
    { image: require('../../assets/worksheets/menggambar/07.jpg'), thumb: require('../../assets/worksheets/menggambar/07_t.jpg'), w: 548, h: 573 },
    { image: require('../../assets/worksheets/menggambar/08.jpg'), thumb: require('../../assets/worksheets/menggambar/08_t.jpg'), w: 548, h: 545 },
  ],
};
