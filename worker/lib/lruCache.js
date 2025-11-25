export default function LRU(max = 1000) {
  const map = new Map();
  return {
    has(key) {
      return map.has(key);
    },
    get(key) {
      if (!map.has(key)) return undefined;
      const v = map.get(key);
      map.delete(key);
      map.set(key, v);
      return v;
    },
    set(key, val) {
      if (map.has(key)) map.delete(key);
      map.set(key, val);
      while (map.size > max) map.delete(map.keys().next().value);
    },
    size() {
      return map.size;
    },
  };
}
