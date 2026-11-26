import { useState } from 'react';
import { DrawingSheet } from '../components/DrawingSheet';
import { GameScreen } from '../components/GameScreen';
import { getCategory } from '../data/categories';
import { DrawingArt, DRAWING_IDS, DRAWINGS, type DrawingId, sampleDrawingFills } from '../drawings';

function randomPick(previous?: DrawingId): DrawingId {
  const options = previous ? DRAWING_IDS.filter((id) => id !== previous) : DRAWING_IDS;
  return options[Math.floor(Math.random() * options.length)];
}

/** Mewarnai bebas: gambar besar vektor acak + contoh kecil berwarna di pojok kanan atas. */
export default function MewarnaiScreen() {
  const cat = getCategory('mewarnai')!;
  const [state, setState] = useState(() => ({ id: 0, pick: randomPick() }));
  const shuffle = () => setState((s) => ({ id: s.id + 1, pick: randomPick(s.pick) }));
  const def = DRAWINGS[state.pick];

  return (
    <GameScreen cat={cat} shuffleLabel="Acak Gambar Baru" onShuffle={shuffle}>
      <DrawingSheet
        key={state.id}
        art={def}
        preview={<DrawingArt def={def} size={64} fills={sampleDrawingFills(def)} />}
        color={cat.color}
      />
    </GameScreen>
  );
}
