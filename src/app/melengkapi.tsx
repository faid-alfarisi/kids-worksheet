import { useState } from 'react';
import { View } from 'react-native';
import Svg, { Line, Rect } from 'react-native-svg';
import { type CustomPage, DrawingSheet } from '../components/DrawingSheet';
import { GameScreen } from '../components/GameScreen';
import { getCategory } from '../data/categories';
import { Shape, type ShapeKind } from '../shapes';

// Shape yang simetris kiri-kanan sehingga enak dilengkapi separuh kanannya.
const SYMMETRIC_SHAPES: ShapeKind[] = [
  'apel',
  'jeruk',
  'stroberi',
  'nanas',
  'alpukat',
  'wortel',
  'brokoli',
  'tomat',
  'jamur',
  'jagung',
  'labu',
  'kucing',
  'kupu',
  'anakayam',
  'babi',
  'kelinci',
  'kepiting',
  'gurita',
  'uburubur',
  'tas',
  'kaos',
  'celana',
  'rumah',
  'bunga',
  'bintang',
  'hati',
  'payung',
  'topi',
  'singa',
  'panda',
  'koala',
  'monyet',
  'katak',
  'penguin',
  'burunghantu',
  'kepik',
  'sapi',
  'eskrim',
  'cupcake',
  'donat',
  'kue',
  'burger',
  'matahari',
  'pohon',
  'kaktus',
  'beruang',
  'mahkota',
  'kado',
  'jam',
];

type RefSide = 'left' | 'right' | 'top' | 'bottom';
const REF_SIDES: readonly RefSide[] = ['left', 'right', 'top', 'bottom'];

function randomPick(previous?: ShapeKind): ShapeKind {
  const options = previous ? SYMMETRIC_SHAPES.filter((k) => k !== previous) : SYMMETRIC_SHAPES;
  return options[Math.floor(Math.random() * options.length)];
}

function randomSide(previous?: RefSide): RefSide {
  const options = previous ? REF_SIDES.filter((s) => s !== previous) : REF_SIDES;
  return options[Math.floor(Math.random() * options.length)];
}

const GRID_CELLS = 8; // 8x8 kotak bantu (4x8 atau 8x4)

function halfPage(kind: ShapeKind, side: RefSide): CustomPage {
  const isVerticalSplit = side === 'left' || side === 'right';
  return {
    ratio: 1,
    render: (w) => {
      const pad = w * 0.08;
      const box = w - pad * 2;
      const cell = box / GRID_CELLS;
      const artSize = box * 0.88;
      const artOffset = (box - artSize) / 2;

      const clipStyle =
        side === 'left'
          ? { left: pad + artOffset, top: pad + artOffset, width: artSize / 2, height: artSize }
          : side === 'right'
            ? { left: pad + artOffset + artSize / 2, top: pad + artOffset, width: artSize / 2, height: artSize }
            : side === 'top'
              ? { left: pad + artOffset, top: pad + artOffset, width: artSize, height: artSize / 2 }
              : { left: pad + artOffset, top: pad + artOffset + artSize / 2, width: artSize, height: artSize / 2 };

      const innerOffset =
        side === 'right' ? { marginLeft: -artSize / 2 } : side === 'bottom' ? { marginTop: -artSize / 2 } : undefined;

      return (
        <View style={{ flex: 1 }}>
          {/* Grid kotak bantu + garis batas tengah (vertikal untuk kiri/kanan, horizontal untuk atas/bawah) */}
          <Svg width={w} height={w} pointerEvents="none">
            {Array.from({ length: GRID_CELLS - 1 }, (_, i) => {
              const p = pad + (i + 1) * cell;
              const isCenter = isVerticalSplit && i + 1 === GRID_CELLS / 2;
              return (
                <Line
                  key={`v${i}`}
                  x1={p}
                  y1={pad}
                  x2={p}
                  y2={pad + box}
                  stroke={isCenter ? '#78909C' : '#E0E0E0'}
                  strokeWidth={isCenter ? 2 : 1}
                  strokeDasharray={isCenter ? '6 4' : undefined}
                />
              );
            })}
            {Array.from({ length: GRID_CELLS - 1 }, (_, i) => {
              const p = pad + (i + 1) * cell;
              const isCenter = !isVerticalSplit && i + 1 === GRID_CELLS / 2;
              return (
                <Line
                  key={`h${i}`}
                  x1={pad}
                  y1={p}
                  x2={pad + box}
                  y2={p}
                  stroke={isCenter ? '#78909C' : '#E0E0E0'}
                  strokeWidth={isCenter ? 2 : 1}
                  strokeDasharray={isCenter ? '6 4' : undefined}
                />
              );
            })}
            <Rect x={pad} y={pad} width={box} height={box} fill="none" stroke="#546E7A" strokeWidth={2.5} rx={4} />
          </Svg>

          {/* Separuh gambar referensi (kiri / kanan / atas / bawah) */}
          <View pointerEvents="none" style={[{ position: 'absolute', overflow: 'hidden' }, clipStyle]}>
            <View style={innerOffset}>
              <Shape kind={kind} size={artSize} lineOnly />
            </View>
          </View>
        </View>
      );
    },
  };
}

/** Melengkapi gambar: separuh shape (kiri/kanan/atas/bawah acak) tampil di atas grid kotak bantu, anak menggambar separuh sisanya (+ contoh utuh di bar atas). */
export default function MelengkapiScreen() {
  const cat = getCategory('melengkapi')!;
  const [state, setState] = useState(() => ({ id: 0, pick: randomPick(), side: randomSide() }));
  const shuffle = () => setState((s) => ({ id: s.id + 1, pick: randomPick(s.pick), side: randomSide(s.side) }));

  return (
    <GameScreen cat={cat} shuffleLabel="Acak Gambar Baru" onShuffle={shuffle}>
      <DrawingSheet
        key={state.id}
        page={halfPage(state.pick, state.side)}
        preview={<Shape kind={state.pick} size={60} />}
        startColor="#212121"
        color={cat.color}
      />
    </GameScreen>
  );
}
