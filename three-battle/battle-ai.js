// Enemy move selection utilities. Turn execution stays in main.js.
export function chooseEnemyMove({ enemy, moves = [] } = {}) {
  const eligible = moves.filter(move => move?.power > 0 || move?.moveType === 'defense');
  if (!eligible.length) return null;
  const support = eligible.find(move => move.moveType === 'defense' && Number(enemy?.hp) < 40);
  return support || eligible[Math.floor(Math.random() * eligible.length)];
}
