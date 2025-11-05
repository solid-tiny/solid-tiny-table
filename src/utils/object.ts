export function getValueAtPath(obj: object, path: string) {
  const keys = path.split(".");
  let current = obj;
  for (const key of keys) {
    if (current && typeof current === "object") {
      current = current[key as keyof typeof current];
    } else {
      return;
    }
  }
  return current as unknown;
}
