import { useState } from 'react';
import { GameScreen } from '../components/GameScreen';
import { MazeGame } from '../components/MazeGame';
import { getCategory } from '../data/categories';
import { randomLevel } from '../data/maze';

/** Cari Jalan: langsung main dengan peta acak, tombol Acak untuk peta baru. */
export default function CariJalanScreen() {
  const cat = getCategory('carijalan')!;
  const [round, setRound] = useState(() => ({ id: 0, level: randomLevel(), done: false }));
  const shuffle = () => setRound((r) => ({ id: r.id + 1, level: randomLevel(), done: false }));
  const markDone = () => setRound((r) => (r.done ? r : { ...r, done: true }));

  return (
    <GameScreen cat={cat} shuffleLabel="Acak Jalan Baru" done={round.done} onShuffle={shuffle}>
      <MazeGame key={round.id} level={round.level} color={cat.color} onDone={markDone} />
    </GameScreen>
  );
}
