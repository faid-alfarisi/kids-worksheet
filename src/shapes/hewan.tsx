import { Circle, Ellipse, Path } from 'react-native-svg';
import { DARK, eye, face, OUTLINE, part, type ShapeDef, smile, stroke } from './kit';

export const HEWAN = {
  kucing: {
    name: 'kucing',
    color: '#FFB74D',
    look: 'telinga',
    recolor: true,
    code: { x: 50, y: 37 },
    draw: (p, sil) => (
      <>
        <Path {...p} d="M20 42 L24 10 L44 28 Q50 27 56 28 L76 10 L80 42 Q88 58 80 74 Q68 90 50 90 Q32 90 20 74 Q12 58 20 42 Z" />
        {!sil && <Path d="M28 22 L30 34 L38 30 Z M72 22 L70 34 L62 30 Z" fill="#F8BBD0" />}
        {!sil && eye(38, 55, 5)}
        {!sil && eye(62, 55, 5)}
        {!sil && <Path d="M46 64 H54 L50 69 Z" fill="#F48FB1" stroke={DARK} strokeWidth={1.5} strokeLinejoin="round" />}
        {!sil && <Path d="M44 72 Q50 77 56 72 M14 60 L30 63 M14 70 L30 68 M86 60 L70 63 M86 70 L70 68" {...stroke(DARK, false, 2)} />}
      </>
    ),
  },
  ikan: {
    name: 'ikan',
    color: '#29B6F6',
    recolor: true,
    code: { x: 42, y: 61 },
    draw: (p, sil) => (
      <>
        <Path {...p} d="M70 50 L94 30 L90 50 L94 70 Z" />
        <Path {...p} d="M40 31 Q48 18 58 30 Z" />
        <Ellipse {...p} cx={43} cy={52} rx={33} ry={23} />
        {!sil && <Path d="M58 38 Q64 52 58 66" stroke={OUTLINE} strokeWidth={2.5} fill="none" />}
        {!sil && eye(26, 47, 5)}
        {!sil && smile(22, 59, 5)}
      </>
    ),
  },
  kupu: {
    name: 'kupu-kupu',
    color: '#AB47BC',
    recolor: true,
    code: { x: 28, y: 40 },
    draw: (p, sil) => (
      <>
        <Path d="M46 26 Q40 12 32 10 M54 26 Q60 12 68 10" {...stroke(DARK, sil)} />
        <Ellipse {...p} cx={29} cy={38} rx={22} ry={19} />
        <Ellipse {...p} cx={71} cy={38} rx={22} ry={19} />
        <Ellipse {...p} cx={33} cy={69} rx={16} ry={15} />
        <Ellipse {...p} cx={67} cy={69} rx={16} ry={15} />
        {!sil && [[27, 36, 7], [73, 36, 7], [33, 70, 5], [67, 70, 5]].map(([x, y, r]) => <Circle key={`${x}${y}`} cx={x} cy={y} r={r} fill="#fff" opacity={0.6} />)}
        <Ellipse {...part('#5D4037', sil)} cx={50} cy={52} rx={7} ry={30} />
        {!sil && eye(47, 32, 2.2)}
        {!sil && eye(53, 32, 2.2)}
      </>
    ),
  },
  anakayam: {
    name: 'anak ayam',
    color: '#FFEE58',
    draw: (p, sil) => (
      <>
        <Path d="M40 86 V94 M60 86 V94 M34 94 H46 M54 94 H66" {...stroke('#FB8C00', sil, 4)} />
        <Path {...p} d="M44 22 Q46 10 54 14 Q52 18 56 22 Z" />
        <Circle {...p} cx={50} cy={56} r={32} />
        <Ellipse {...p} cx={26} cy={62} rx={10} ry={14} transform="rotate(20 26 62)" />
        <Path {...part('#FB8C00', sil)} d="M44 54 L56 54 L50 62 Z" />
        {!sil && eye(40, 46, 4)}
        {!sil && eye(60, 46, 4)}
        {!sil && <Circle cx={34} cy={58} r={4} fill="#FFAB91" opacity={0.8} />}
        {!sil && <Circle cx={66} cy={58} r={4} fill="#FFAB91" opacity={0.8} />}
      </>
    ),
  },
  kurakura: {
    name: 'kura-kura',
    color: '#66BB6A',
    draw: (p, sil) => (
      <>
        <Ellipse {...part('#AED581', sil)} cx={26} cy={74} rx={8} ry={6} />
        <Ellipse {...part('#AED581', sil)} cx={72} cy={74} rx={8} ry={6} />
        <Path {...part('#AED581', sil)} d="M8 64 L16 58 L18 66 Z" />
        <Circle {...part('#AED581', sil)} cx={84} cy={54} r={12} />
        <Path {...p} d="M12 66 Q14 26 50 24 Q86 26 88 66 Z" />
        {!sil && <Path d="M50 26 V66 M28 34 L36 50 H64 L72 34 M18 54 L36 50 M64 50 L82 54" stroke="#2E7D32" strokeWidth={2.5} fill="none" />}
        {!sil && eye(86, 50, 3.2)}
        {!sil && smile(87, 58, 3)}
      </>
    ),
  },
  babi: {
    name: 'babi',
    color: '#F8BBD0',
    look: 'telinga',
    draw: (p, sil) => (
      <>
        <Path {...p} d="M18 36 L16 12 L38 24 Z" />
        <Path {...p} d="M82 36 L84 12 L62 24 Z" />
        <Circle {...p} cx={50} cy={54} r={36} />
        <Ellipse {...part('#F48FB1', sil)} cx={50} cy={64} rx={15} ry={11} />
        {!sil && <Ellipse cx={45} cy={64} rx={2.5} ry={4} fill={DARK} />}
        {!sil && <Ellipse cx={55} cy={64} rx={2.5} ry={4} fill={DARK} />}
        {!sil && eye(36, 46, 4.5)}
        {!sil && eye(64, 46, 4.5)}
        {!sil && <Circle cx={26} cy={62} r={5} fill="#F06292" opacity={0.5} />}
        {!sil && <Circle cx={74} cy={62} r={5} fill="#F06292" opacity={0.5} />}
      </>
    ),
  },
  siput: {
    name: 'siput',
    color: '#FFB74D',
    draw: (p, sil) => (
      <>
        <Path d="M18 48 L12 30 M26 46 L28 28" {...stroke(DARK, sil)} />
        {!sil && <Circle cx={12} cy={29} r={3} fill={DARK} />}
        {!sil && <Circle cx={28} cy={27} r={3} fill={DARK} />}
        <Path {...part('#C5E1A5', sil)} d="M6 86 Q6 76 18 76 H84 Q94 76 92 86 Z M12 78 Q8 56 20 46 Q32 48 32 78 Z" />
        <Circle {...p} cx={60} cy={50} r={28} />
        {!sil && <Path d="M60 50 m0 -4 a4 4 0 1 1 -4 4 a8 8 0 1 1 8 8 a12 12 0 1 1 -12 -12 a17 17 0 1 1 18 18" stroke="#E65100" strokeWidth={3} fill="none" />}
        {face(sil, 21, 60, 4.5, 2.6)}
      </>
    ),
  },
} satisfies Record<string, ShapeDef>;
