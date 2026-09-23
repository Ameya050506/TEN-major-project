/** Tracks whether tests/questions last succeeded via API or localStorage fallback. */

let mode = "unknown";

const listeners = new Set();

export const getDataSourceMode = () => mode;

export const setDataSourceMode = (next) => {
  if (mode === next) return;
  mode = next;
  listeners.forEach((fn) => fn(mode));
};

export const subscribeDataSource = (fn) => {
  listeners.add(fn);
  fn(mode);
  return () => listeners.delete(fn);
};
