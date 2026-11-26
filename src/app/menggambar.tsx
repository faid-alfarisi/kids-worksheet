import { useState } from 'react';
import { View } from 'react-native';
import { type CustomPage, DrawingSheet } from '../components/DrawingSheet';
import { GameScreen } from '../components/GameScreen';
import { getCategory } from '../data/categories';
import { Shape, SHAPE_KINDS, type ShapeKind } from '../shapes';

function randomPick(previous?: ShapeKind): ShapeKind {
  const options = previous ? SHAPE_KINDS.filter((k) => k !== previous) : SHAPE_KINDS;
  return options[Math.floor(Math.random() * options.length)];
}

function tracePage(kind: ShapeKind): CustomPage {
  return {
    ratio: 1,
    render: (w) => (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Shape kind={kind} size={w * 0.84} trace />
      </View>
    ),
  };
}

/** Menggambar: tebalkan gambar garis putus-putus lalu warnai sesukanya (+ contoh kecil di pojok kanan atas). */
export default function MenggambarScreen() {
  const cat = getCategory('menggambar')!;
  const [state, setState] = useState(() => ({ id: 0, pick: randomPick() }));
  const shuffle = () => setState((s) => ({ id: s.id + 1, pick: randomPick(s.pick) }));

  return (
    <GameScreen cat={cat} shuffleLabel="Acak Gambar Baru" onShuffle={shuffle}>
      <DrawingSheet
        key={state.id}
        page={tracePage(state.pick)}
        preview={<Shape kind={state.pick} size={60} />}
        startColor="#212121"
        color={cat.color}
      />
    </GameScreen>
  );
}
