import { useState } from 'react';
import { DrawingSheet } from '../components/DrawingSheet';
import { GameScreen } from '../components/GameScreen';
import { getCategory } from '../data/categories';
import { SHEETS } from '../data/sheets';
import { DRAWING_IDS, DRAWINGS, type DrawingId } from '../drawings';

type Pick = { type: 'art'; id: DrawingId } | { type: 'sheet'; index: number };

// Kumpulan gambar mewarnai: gambar besar (drawing) + lembar gambar lama.
const POOL: Pick[] = [
  ...DRAWING_IDS.map((id) => ({ type: 'art' as const, id })),
  ...(SHEETS.mewarnai ?? []).map((_, index) => ({ type: 'sheet' as const, index })),
];

const same = (a: Pick, b: Pick) => (a.type === 'art' && b.type === 'art' ? a.id === b.id : a.type === 'sheet' && b.type === 'sheet' && a.index === b.index);

function randomPick(previous?: Pick): Pick {
  const options = previous ? POOL.filter((p) => !same(p, previous)) : POOL;
  return options[Math.floor(Math.random() * options.length)];
}

/** Mewarnai bebas: gambar acak, coret sesukanya, tidak ada benar/salah. */
export default function MewarnaiScreen() {
  const cat = getCategory('mewarnai')!;
  const [state, setState] = useState(() => ({ id: 0, pick: randomPick() }));
  const shuffle = () => setState((s) => ({ id: s.id + 1, pick: randomPick(s.pick) }));
  const { pick } = state;

  return (
    <GameScreen cat={cat} shuffleLabel="Acak Gambar Baru" onShuffle={shuffle}>
      {pick.type === 'art' ? (
        <DrawingSheet key={state.id} art={DRAWINGS[pick.id]} color={cat.color} />
      ) : (
        <DrawingSheet key={state.id} sheet={SHEETS.mewarnai[pick.index]} color={cat.color} />
      )}
    </GameScreen>
  );
}
