export function serializeDb<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}
