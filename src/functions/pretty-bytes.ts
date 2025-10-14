function prettyBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const dm = Math.max(0, decimals);
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = bytes / Math.pow(k, i);

  let str = value.toFixed(dm).replace(/\.?0+$/, '');
  str = str.replace('.', ',');

  return `${str} ${sizes[i]}`;
}

export { prettyBytes };
