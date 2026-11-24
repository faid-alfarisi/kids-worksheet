import { Circle, Path } from 'react-native-svg';
import { eye, part, type ShapeDef, smile } from './kit';

export const DINOSAURUS = {
  brontosaurus: {
    name: 'dinosaurus leher panjang',
    color: '#81C784',
    draw: (p, sil) => (
      <>
        <Path
          {...p}
          d="M6 66 Q20 52 36 52 Q52 40 64 46 Q70 30 68 18 Q68 6 80 6 Q92 6 92 16 Q92 24 80 24 Q76 36 80 52 Q90 60 88 70 L88 90 L76 90 L76 78 L52 78 L52 90 L40 90 L40 76 Q22 74 6 66 Z"
        />
        {!sil && [[44, 60, 4], [58, 56, 3], [52, 68, 3]].map(([x, y, r]) => <Circle key={`${x}`} cx={x} cy={y} r={r} fill="#fff" opacity={0.5} />)}
        {!sil && eye(82, 13, 3)}
        {!sil && smile(86, 19, 3)}
      </>
    ),
  },
  stegosaurus: {
    name: 'stegosaurus',
    color: '#4DB6AC',
    draw: (p, sil) => (
      <>
        <Path {...part('#FFB74D', sil)} d="M22 48 L26 28 L36 42 Z M36 40 L44 18 L54 38 Z M54 38 L64 22 L70 44 Z M70 46 L80 34 L82 52 Z" />
        <Path {...part('#FFB74D', sil)} d="M10 64 L2 56 L8 68 Z M14 60 L8 50 L16 62 Z" />
        <Path {...p} d="M8 66 Q14 42 46 40 Q74 40 84 56 Q96 58 94 68 Q92 74 84 72 L80 72 L80 90 L68 90 L68 76 L38 76 L38 90 L26 90 L26 74 Q14 72 8 66 Z" />
        {!sil && eye(86, 62, 3)}
        {!sil && smile(89, 67, 2.5)}
      </>
    ),
  },
} satisfies Record<string, ShapeDef>;
