import { useState } from 'react';
import { DrawingSheet } from '../components/DrawingSheet';
import { GameScreen } from '../components/GameScreen';
import { getCategory } from '../data/categories';
import { Shape, SHAPE_KINDS, type ShapeKind } from '../shapes';

function randomPick(previous?: ShapeKind): ShapeKind {
  const options = previous ? SHAPE_KINDS.filter((k) => k !== previous) : SHAPE_KINDS;
  return options[Math.floor(Math.random() * options.length)];
}

/** Mewarnai bebas: shape vektor acak + contoh kecil berwarna di pojok kanan atas. Garis tepi selalu rapi di atas coretan. */
export default function MewarnaiScreen() {
  const cat = getCategory('mewarnai')!;
  const [state, setState] = useState(() => ({ id: 0, pick: randomPick() }));
  const shuffle = () => setState((s) => ({ id: s.id + 1, pick: randomPick(s.pick) }));

  return (
    <GameScreen cat={cat} shuffleLabel="Acak Gambar Baru" onShuffle={shuffle}>
      <DrawingSheet
        key={state.id}
        shape={state.pick}
        preview={<Shape kind={state.pick} size={60} />}
        color={cat.color}
      />
    </GameScreen>
  );
}
