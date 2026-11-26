import { useState } from 'react';
import { View } from 'react-native';
import { type CustomPage, DrawingSheet } from '../components/DrawingSheet';
import { GameScreen } from '../components/GameScreen';
import { getCategory } from '../data/categories';
import { DrawingArt, DRAWING_IDS, DRAWINGS, type DrawingId, sampleDrawingFills } from '../drawings';
import { Shape, SHAPE_KINDS, type ShapeKind } from '../shapes';

type Pick = { type: 'shape'; kind: ShapeKind } | { type: 'art'; id: DrawingId };

// Semua shape + semua gambar besar, ditampilkan sebagai garis putus-putus.
const POOL: Pick[] = [
  ...SHAPE_KINDS.map((kind) => ({ type: 'shape' as const, kind })),
  ...DRAWING_IDS.map((id) => ({ type: 'art' as const, id })),
];

const key = (p: Pick) => (p.type === 'shape' ? p.kind : `art:${p.id}`);

function randomPick(previous?: Pick): Pick {
  const options = previous ? POOL.filter((p) => key(p) !== key(previous)) : POOL;
  return options[Math.floor(Math.random() * options.length)];
}

function tracePage(pick: Pick): CustomPage {
  return {
    ratio: 1,
    render: (w) => (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {pick.type === 'shape' ? <Shape kind={pick.kind} size={w * 0.84} trace /> : <DrawingArt def={DRAWINGS[pick.id]} size={w * 0.94} layer="trace" />}
      </View>
    ),
  };
}

function renderPreview(pick: Pick) {
  if (pick.type === 'shape') return <Shape kind={pick.kind} size={60} />;
  const def = DRAWINGS[pick.id];
  return <DrawingArt def={def} size={64} fills={sampleDrawingFills(def)} />;
}

/** Menggambar: tebalkan gambar garis putus-putus lalu warnai sesukanya (+ contoh kecil di pojok kanan atas). */
export default function MenggambarScreen() {
  const cat = getCategory('menggambar')!;
  const [state, setState] = useState(() => ({ id: 0, pick: randomPick() }));
  const shuffle = () => setState((s) => ({ id: s.id + 1, pick: randomPick(s.pick) }));

  return (
    <GameScreen cat={cat} shuffleLabel="Acak Gambar Baru" onShuffle={shuffle}>
      <DrawingSheet
        key={state.id}
        page={tracePage(state.pick)}
        preview={renderPreview(state.pick)}
        startColor="#212121"
        color={cat.color}
      />
    </GameScreen>
  );
}
