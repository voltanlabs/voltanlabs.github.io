// Enemy move selection utilities. Turn execution stays in main.js.
export function chooseEnemyMove({ enemy, moves = [] } = {}) {
  const eligible = moves.filter(move => move?.power > 0 || move?.moveType === 'defense');
  if (!eligible.length) return null;
  const hpRatio = Number(enemy?.hp || 0) / Math.max(1, Number(enemy?.maxHp || 1));
  const support = eligible.find(move => move.moveType === 'defense' && hpRatio <= 0.35);
  const attacks = eligible.filter(move => Number(move.power) > 0);
  return support || attacks[Math.floor(Math.random() * attacks.length)] || eligible[0];
}
