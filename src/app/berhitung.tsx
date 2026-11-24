import { useState } from 'react';
import { CountGame } from '../components/CountGame';
import { GameScreen } from '../components/GameScreen';
import { MatchGame } from '../components/MatchGame';
import { getCategory } from '../data/categories';
import { randomCountRound } from '../data/counting';

/** Berhitung: lembar acak (tambah, kurang, hitung benda, tambah/kurang gambar, pasangkan jumlah). */
export default function BerhitungScreen() {
  const cat = getCategory('berhitung')!;
  const [state, setState] = useState(() => ({ id: 0, round: randomCountRound() }));
  // Jenis lembar berikutnya dibuat berbeda dari sebelumnya.
  const shuffle = () => setState((s) => ({ id: s.id + 1, round: randomCountRound(s.round.mode) }));
  const { round } = state;

  return (
    <GameScreen cat={cat} shuffleLabel="Acak Soal Baru" onShuffle={shuffle}>
      {round.mode === 'pasangkan' ? (
        <MatchGame key={state.id} round={round.match} color={cat.color} onShuffle={shuffle} />
      ) : (
        <CountGame key={state.id} round={round} color={cat.color} onShuffle={shuffle} />
      )}
    </GameScreen>
  );
}
