import { useState } from 'react';
import { CountGame } from '../components/CountGame';
import { GameScreen } from '../components/GameScreen';
import { MatchGame } from '../components/MatchGame';
import { getCategory } from '../data/categories';
import { randomCountRound } from '../data/counting';

/** Berhitung: lembar acak (tambah, kurang, hitung benda, tambah/kurang gambar, pasangkan jumlah). */
export default function BerhitungScreen() {
  const cat = getCategory('berhitung')!;
  const [state, setState] = useState(() => ({ id: 0, round: randomCountRound(), done: false }));
  // Jenis lembar berikutnya dibuat berbeda dari sebelumnya.
  const shuffle = () => setState((s) => ({ id: s.id + 1, round: randomCountRound(s.round.mode), done: false }));
  const markDone = () => setState((s) => (s.done ? s : { ...s, done: true }));
  const { round } = state;

  return (
    <GameScreen cat={cat} shuffleLabel="Acak Soal Baru" done={state.done} onShuffle={shuffle}>
      {round.mode === 'pasangkan' ? (
        <MatchGame key={state.id} round={round.match} color={cat.color} onDone={markDone} />
      ) : (
        <CountGame key={state.id} round={round} color={cat.color} onDone={markDone} />
      )}
    </GameScreen>
  );
}
