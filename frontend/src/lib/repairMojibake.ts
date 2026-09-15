/**
 * Repairs legacy strings that were saved after UTF-8 was decoded as Latin-1.
 * This keeps older CMS/content records readable while new content stays UTF-8.
 */
export const repairMojibake = (value: string): string => {
  let repaired = value;
  for (let attempt = 0; attempt < 3 && /[ÃÂàâêìëíã]/.test(repaired); attempt += 1) {
    const bytes = Uint8Array.from(repaired, (character) => character.charCodeAt(0) & 0xff);
    const decoded = new TextDecoder('utf-8').decode(bytes);
    if (decoded === repaired) break;
    repaired = decoded;
  }
  return repaired;
};

export const repairMojibakeTree = <T>(value: T): T => {
  if (typeof value === 'string') return repairMojibake(value) as T;
  if (Array.isArray(value)) return value.map((item) => repairMojibakeTree(item)) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, repairMojibakeTree(item)])) as T;
  }
  return value;
};
