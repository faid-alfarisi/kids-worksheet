import { useState } from 'react';
import { DrawingSheet } from '../components/DrawingSheet';
import { GameScreen } from '../components/GameScreen';
import { linesPage, randomLinesRows } from '../components/LinesPage';
import { getCategory } from '../data/categories';

/** Menggaris: tebalkan garis putus-putus acak (lurus, gelombang, zigzag, ...) dari benda kiri ke kanan. */
export default function MenggarisScreen() {
  const cat = getCategory('menggaris')!;
  const [state, setState] = useState(() => ({ id: 0, rows: randomLinesRows() }));
  const shuffle = () => setState((s) => ({ id: s.id + 1, rows: randomLinesRows() }));

  return (
    <GameScreen cat={cat} shuffleLabel="Acak Garis Baru" onShuffle={shuffle}>
      <DrawingSheet key={state.id} page={linesPage(state.rows)} ink="#212121" color={cat.color} />
    </GameScreen>
  );
}
