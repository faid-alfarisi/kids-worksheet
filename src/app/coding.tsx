import { useState } from 'react';
import { ColorCodeGame } from '../components/ColorCodeGame';
import { GameScreen } from '../components/GameScreen';
import { getCategory } from '../data/categories';
import { randomCodeRound } from '../data/colorcode';

/** Coding: warnai benda sesuai kode angka→warna, soal acak. */
export default function CodingScreen() {
  const cat = getCategory('coding')!;
  const [state, setState] = useState(() => ({ id: 0, round: randomCodeRound(), done: false }));
  const shuffle = () => setState((s) => ({ id: s.id + 1, round: randomCodeRound(s.round), done: false }));
  const markDone = () => setState((s) => (s.done ? s : { ...s, done: true }));

  return (
    <GameScreen cat={cat} shuffleLabel="Acak Soal Baru" done={state.done} onShuffle={shuffle}>
      <ColorCodeGame key={state.id} round={state.round} color={cat.color} onDone={markDone} />
    </GameScreen>
  );
}
