import { useState } from 'react';
import { CompareGame } from '../components/CompareGame';
import { GameScreen } from '../components/GameScreen';
import { getCategory } from '../data/categories';
import { randomCompareRound } from '../data/compare';

/** Perbandingan: tap benda yang paling/lebih besar atau kecil, soal acak. */
export default function PerbandinganScreen() {
  const cat = getCategory('perbandingan')!;
  const [state, setState] = useState(() => ({ id: 0, round: randomCompareRound() }));
  const shuffle = () => setState((s) => ({ id: s.id + 1, round: randomCompareRound(s.round) }));

  return (
    <GameScreen cat={cat} shuffleLabel="Acak Soal Baru" onShuffle={shuffle}>
      <CompareGame key={state.id} round={state.round} color={cat.color} onShuffle={shuffle} />
    </GameScreen>
  );
}
