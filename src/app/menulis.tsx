import { useState } from 'react';
import { DrawingSheet } from '../components/DrawingSheet';
import { GameScreen } from '../components/GameScreen';
import { WRITING_KINDS, writingPage } from '../components/WritingPage';
import { getCategory } from '../data/categories';
import type { ShapeKind } from '../shapes';

function randomKind(previous?: ShapeKind): ShapeKind {
  const options = WRITING_KINDS.filter((k) => k !== previous);
  return options[Math.floor(Math.random() * options.length)];
}

/** Menulis: tebalkan nama benda (huruf putus-putus) dengan tinta hitam, bebas tanpa benar/salah. */
export default function MenulisScreen() {
  const cat = getCategory('menulis')!;
  const [state, setState] = useState(() => ({ id: 0, kind: randomKind() }));
  const shuffle = () => setState((s) => ({ id: s.id + 1, kind: randomKind(s.kind) }));

  return (
    <GameScreen cat={cat} shuffleLabel="Acak Kata Baru" onShuffle={shuffle}>
      <DrawingSheet key={state.id} page={writingPage(state.kind)} ink="#212121" color={cat.color} />
    </GameScreen>
  );
}
