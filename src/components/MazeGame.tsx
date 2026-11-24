import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ARROW, type Dir, type Level, MOVE, parseLevel, type Pos } from '../data/maze';

type Status = 'edit' | 'running' | 'win' | 'fail';

const DIRS: Dir[] = ['left', 'up', 'down', 'right'];

/**
 * Coding untuk anak: susun urutan panah, tekan "Jalankan", robot bergerak satu per satu.
 * Sampai di bintang = menang; menabrak batu/keluar papan = coba lagi.
 */
export function MazeGame({ level, color, onShuffle }: { level: Level; color: string; onShuffle: () => void }) {
  const info = useMemo(() => parseLevel(level), [level]);
  const maxCmds = info.shortest + 4;
  const [cmds, setCmds] = useState<Dir[]>([]);
  const [robot, setRobot] = useState<Pos>(info.start);
  const [step, setStep] = useState(-1);
  const [status, setStatus] = useState<Status>('edit');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const reset = () => {
    if (timer.current) clearTimeout(timer.current);
    setRobot(info.start);
    setStep(-1);
    setStatus('edit');
  };

  const run = () => {
    if (!cmds.length) return;
    reset();
    setStatus('running');
    let pos = info.start;
    const tick = (i: number) => {
      if (i >= cmds.length) {
        setStatus(pos.r === info.goal.r && pos.c === info.goal.c ? 'win' : 'fail');
        return;
      }
      const m = MOVE[cmds[i]];
      const next = { r: pos.r + m.r, c: pos.c + m.c };
      setStep(i);
      const blocked =
        next.r < 0 || next.c < 0 || next.r >= info.rows || next.c >= info.cols || info.rocks.has(`${next.r},${next.c}`);
      if (blocked) {
        setStatus('fail');
        return;
      }
      pos = next;
      setRobot(next);
      if (pos.r === info.goal.r && pos.c === info.goal.c) {
        setStatus('win');
        return;
      }
      timer.current = setTimeout(() => tick(i + 1), 450);
    };
    timer.current = setTimeout(() => tick(0), 300);
  };

  const editing = status !== 'running';
  const add = (d: Dir) => {
    if (status !== 'edit') reset();
    setCmds((c) => (c.length < maxCmds ? [...c, d] : c));
  };

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <Text style={styles.hint}>Bantu robot 🤖 sampai ke bintang ⭐ ! Susun panahnya, lalu tekan Jalankan.</Text>

      <View style={[styles.board, { borderColor: color }]}>
        {level.map.map((row, r) => (
          <View key={r} style={styles.row}>
            {row.split('').map((ch, c) => {
              const isRobot = robot.r === r && robot.c === c;
              const isGoal = info.goal.r === r && info.goal.c === c;
              return (
                <View key={c} style={[styles.cell, ch === '#' && styles.rock]}>
                  {ch === '#' && <Text style={styles.cellIcon}>🪨</Text>}
                  {isGoal && !isRobot && <Text style={styles.cellIcon}>⭐</Text>}
                  {isRobot && <Text style={styles.cellIcon}>{status === 'win' ? '🥳' : status === 'fail' ? '😵' : '🤖'}</Text>}
                </View>
              );
            })}
          </View>
        ))}
      </View>

      {status === 'win' && (
        <View style={[styles.banner, { backgroundColor: '#E8F5E9' }]}>
          <Text style={styles.bannerText}>🎉 Hebat! Robot sampai ke bintang!</Text>
          <Pressable onPress={onShuffle} style={[styles.bigBtn, { backgroundColor: color }]}>
            <Text style={styles.bigBtnText}>🔀 Main lagi</Text>
          </Pressable>
        </View>
      )}
      {status === 'fail' && (
        <View style={[styles.banner, { backgroundColor: '#FFEBEE' }]}>
          <Text style={styles.bannerText}>Ups! Belum sampai. Coba lagi ya 💪</Text>
        </View>
      )}

      <Text style={styles.label}>
        Perintah ({cmds.length}/{maxCmds})
      </Text>
      <View style={styles.program}>
        {cmds.length === 0 && <Text style={styles.empty}>Belum ada perintah…</Text>}
        {cmds.map((d, i) => (
          <View key={i} style={[styles.cmd, step === i && { backgroundColor: color }]}>
            <Text style={styles.cmdText}>{ARROW[d]}</Text>
          </View>
        ))}
      </View>

      <View style={styles.pad}>
        {DIRS.map((d) => (
          <Pressable key={d} disabled={!editing} onPress={() => add(d)} style={({ pressed }) => [styles.arrow, { borderColor: color }, pressed && { transform: [{ scale: 0.9 }] }]}>
            <Text style={styles.arrowText}>{ARROW[d]}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.controls}>
        <Pressable disabled={!editing} onPress={() => { reset(); setCmds((c) => c.slice(0, -1)); }} style={[styles.ctrl, { backgroundColor: '#EEE' }]}>
          <Text style={styles.ctrlText}>↩️ Hapus 1</Text>
        </Pressable>
        <Pressable disabled={!editing} onPress={() => { reset(); setCmds([]); }} style={[styles.ctrl, { backgroundColor: '#EEE' }]}>
          <Text style={styles.ctrlText}>🧽 Ulang</Text>
        </Pressable>
        <Pressable disabled={!editing || !cmds.length} onPress={run} style={[styles.ctrl, { backgroundColor: color, opacity: cmds.length ? 1 : 0.4 }]}>
          <Text style={[styles.ctrlText, { color: '#fff' }]}>▶ Jalankan</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 14, gap: 10, alignItems: 'stretch' },
  hint: { fontSize: 15, color: '#444', fontWeight: '600', textAlign: 'center' },
  board: { alignSelf: 'center', width: '88%', maxWidth: 400, backgroundColor: '#fff', borderRadius: 18, borderWidth: 3, padding: 8, gap: 6 },
  row: { flexDirection: 'row', gap: 6 },
  cell: { flex: 1, aspectRatio: 1, borderRadius: 10, backgroundColor: '#F4F1FF', alignItems: 'center', justifyContent: 'center' },
  rock: { backgroundColor: '#D7CCC8' },
  cellIcon: { fontSize: 30 },
  banner: { borderRadius: 14, padding: 12, alignItems: 'center', gap: 10 },
  bannerText: { fontSize: 17, fontWeight: '800', color: '#333' },
  label: { fontWeight: '800', color: '#555', fontSize: 15 },
  program: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, minHeight: 48, backgroundColor: '#fff', borderRadius: 14, padding: 8 },
  empty: { color: '#aaa', alignSelf: 'center', marginLeft: 4 },
  cmd: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#F1F1F1', alignItems: 'center', justifyContent: 'center' },
  cmdText: { fontSize: 22 },
  pad: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  arrow: { flex: 1, height: 64, borderRadius: 18, borderWidth: 3, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  arrowText: { fontSize: 30 },
  controls: { flexDirection: 'row', gap: 10 },
  ctrl: { flex: 1, paddingVertical: 12, borderRadius: 14, alignItems: 'center' },
  ctrlText: { fontWeight: '800', fontSize: 15, color: '#333' },
  bigBtn: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 14 },
  bigBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});
