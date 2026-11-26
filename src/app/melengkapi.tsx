import { useState } from 'react';
import { View } from 'react-native';
import Svg, { Line, Rect } from 'react-native-svg';
import { type CustomPage, DrawingSheet } from '../components/DrawingSheet';
import { GameScreen } from '../components/GameScreen';
import { getCategory } from '../data/categories';
import { DrawingArt, type DrawingId, DRAWINGS, sampleDrawingFills } from '../drawings';
import { Shape, type ShapeKind } from '../shapes';

type Pick = { type: 'shape'; kind: ShapeKind } | { type: 'art'; id: DrawingId };

// Shape & gambar besar yang simetris kiri-kanan sehingga enak dilengkapi separuh kanannya.
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
];

const SYMMETRIC_ARTS: DrawingId[] = ['bunga', 'kupukupu', 'eskrim', 'kucing', 'kelinci', 'gurita', 'kue'];

const POOL: Pick[] = [
  ...SYMMETRIC_SHAPES.map((kind) => ({ type: 'shape' as const, kind })),
  ...SYMMETRIC_ARTS.map((id) => ({ type: 'art' as const, id })),
];

const key = (p: Pick) => (p.type === 'shape' ? p.kind : `art:${p.id}`);

function randomPick(previous?: Pick): Pick {
  const options = previous ? POOL.filter((p) => key(p) !== key(previous)) : POOL;
  return options[Math.floor(Math.random() * options.length)];
}

const GRID_CELLS = 8; // 8x8 kotak bantu (4 kiri, 4 kanan)

function halfPage(pick: Pick): CustomPage {
  return {
    ratio: 1,
    render: (w) => {
      const pad = w * 0.08;
      const box = w - pad * 2;
      const cell = box / GRID_CELLS;
      const artSize = box * 0.88;
      const artOffset = (box - artSize) / 2;

      return (
        <View style={{ flex: 1 }}>
          {/* Grid kotak bantu + garis sumbu simetri tengah */}
          <Svg width={w} height={w} pointerEvents="none">
            {Array.from({ length: GRID_CELLS - 1 }, (_, i) => {
              const p = pad + (i + 1) * cell;
              const isCenter = i + 1 === GRID_CELLS / 2;
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
              return <Line key={`h${i}`} x1={pad} y1={p} x2={pad + box} y2={p} stroke="#E0E0E0" strokeWidth={1} />;
            })}
            <Rect x={pad} y={pad} width={box} height={box} fill="none" stroke="#546E7A" strokeWidth={2.5} rx={4} />
          </Svg>

          {/* Separuh kiri gambar (dipotong tepat di garis tengah x = w / 2) */}
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: pad + artOffset,
              top: pad + artOffset,
              width: artSize / 2,
              height: artSize,
              overflow: 'hidden',
            }}
          >
            {pick.type === 'shape' ? (
              <Shape kind={pick.kind} size={artSize} lineOnly />
            ) : (
              <DrawingArt def={DRAWINGS[pick.id]} size={artSize} layer="line" />
            )}
          </View>
        </View>
      );
    },
  };
}

function renderPreview(pick: Pick) {
  if (pick.type === 'shape') return <Shape kind={pick.kind} size={60} />;
  const def = DRAWINGS[pick.id];
  return <DrawingArt def={def} size={64} fills={sampleDrawingFills(def)} />;
}

/** Melengkapi gambar: separuh kiri tampil di atas grid kotak bantu, anak menggambar separuh kanannya (+ contoh utuh di pojok kanan atas). */
export default function MelengkapiScreen() {
  const cat = getCategory('melengkapi')!;
  const [state, setState] = useState(() => ({ id: 0, pick: randomPick() }));
  const shuffle = () => setState((s) => ({ id: s.id + 1, pick: randomPick(s.pick) }));

  return (
    <GameScreen cat={cat} shuffleLabel="Acak Gambar Baru" onShuffle={shuffle}>
      <DrawingSheet
        key={state.id}
        page={halfPage(state.pick)}
        preview={renderPreview(state.pick)}
        startColor="#212121"
        color={cat.color}
      />
    </GameScreen>
  );
}
