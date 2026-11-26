import { useState } from 'react';
import { GameScreen } from '../components/GameScreen';
import { MatchGame } from '../components/MatchGame';
import { getCategory } from '../data/categories';
import { randomRound } from '../data/match';

/** Memasangkan: soal acak (warna, bayangan, pasangan) dengan tarik garis. */
export default function MemasangkanScreen() {
  const cat = getCategory('memasangkan')!;
  const [state, setState] = useState(() => ({ id: 0, round: randomRound(), done: false }));
  // Mode berikutnya dibuat berbeda dari sebelumnya supaya bervariasi.
  const shuffle = () => setState((s) => ({ id: s.id + 1, round: randomRound(s.round.mode), done: false }));
  const markDone = () => setState((s) => (s.done ? s : { ...s, done: true }));

  return (
    <GameScreen cat={cat} shuffleLabel="Acak Soal Baru" done={state.done} onShuffle={shuffle}>
      <MatchGame key={state.id} round={state.round} color={cat.color} onDone={markDone} />
    </GameScreen>
  );
}
