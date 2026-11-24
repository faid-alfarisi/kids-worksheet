import { useState } from 'react';
import { DrawingSheet } from '../components/DrawingSheet';
import { GameScreen } from '../components/GameScreen';
import { type LinesRow, linesPage, randomLinesRows } from '../components/LinesPage';
import { getCategory } from '../data/categories';
import { SHEETS } from '../data/sheets';

type Pick = { type: 'lines'; rows: LinesRow[] } | { type: 'sheet'; index: number };

const SHEET_CHANCE = 0.3; // peluang muncul lembar lama (maze, menebalkan garis, ...)

function randomPick(previous?: Pick): Pick {
  const sheets = SHEETS.menggaris ?? [];
  if (sheets.length && Math.random() < SHEET_CHANCE) {
    const options = sheets.map((_, index) => index).filter((i) => !(previous?.type === 'sheet' && previous.index === i));
    return { type: 'sheet', index: options[Math.floor(Math.random() * options.length)] };
  }
  return { type: 'lines', rows: randomLinesRows() };
}

/** Menggaris: tebalkan garis putus-putus (lurus, gelombang, zigzag, ...) atau maze. Acak, bebas. */
export default function MenggarisScreen() {
  const cat = getCategory('menggaris')!;
  const [state, setState] = useState(() => ({ id: 0, pick: randomPick() }));
  const shuffle = () => setState((s) => ({ id: s.id + 1, pick: randomPick(s.pick) }));
  const { pick } = state;

  return (
    <GameScreen cat={cat} shuffleLabel="Acak Garis Baru" onShuffle={shuffle}>
      {pick.type === 'lines' ? (
        <DrawingSheet key={state.id} page={linesPage(pick.rows)} ink="#212121" color={cat.color} />
      ) : (
        <DrawingSheet key={state.id} sheet={SHEETS.menggaris[pick.index]} ink="#212121" color={cat.color} />
      )}
    </GameScreen>
  );
}
