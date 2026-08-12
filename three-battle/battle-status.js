// Battle status queries are kept separate from DOM rendering and turn orchestration.
export function list(state, key) {
  if (!state) return [];
  if (!Array.isArray(state[key])) state[key] = state[key] ? [state[key]] : [];
  return state[key];
}

export function has(state, key, id) {
  return list(state, key).some(status => status.id === id);
}

export function stacks(state, key, id) {
  return Math.max(1, Number(list(state, key).find(status => status.id === id)?.stacks || 0));
}

export function multiplier(state, key, id, field) {
  const active = list(state, key).find(status => status.id === id);
  if (!active) return 1;
  const value = Number(window.DataByteStatusRuntime?.definition?.(id)?.[field]);
  return Number.isFinite(value) && value > 0 ? Math.pow(value, Math.max(1, Number(active.stacks) || 1)) : 1;
}

export function consume(state, key, id) {
  const statuses = list(state, key), index = statuses.findIndex(status => status.id === id);
  if (index >= 0) statuses.splice(index, 1);
}
