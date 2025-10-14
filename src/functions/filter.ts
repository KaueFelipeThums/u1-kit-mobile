function normalizeString(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function matchString(value: string, condition: string): boolean {
  const val = normalizeString(value);
  return val.includes(normalizeString(condition));
}

export { matchString };
