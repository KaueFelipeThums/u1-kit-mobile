export function formatCPF(value: string): string {
  return value
    .replace(/\D/g, '')
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

export function formatCNPJ(value: string): string {
  return value
    .replace(/\D/g, '')
    .slice(0, 14)
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
}

export function formatPhone(value: string): string {
  return value
    .replace(/\D/g, '')
    .slice(0, 11)
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{4,5})(\d{4})$/, '$1-$2');
}

export function formatCEP(value: string): string {
  return value
    .replace(/\D/g, '')
    .slice(0, 8)
    .replace(/^(\d{5})(\d{1,3})$/, '$1-$2');
}

export function formatNumber(
  value: string,
  options: {
    decimals?: number;
    decimalSeparator?: string;
  } = {},
): string {
  const { decimals = 2, decimalSeparator = ',' } = options;

  let v = value.replace(/[.]/g, decimalSeparator).replace(new RegExp(`[^0-9\\-${decimalSeparator}]`, 'g'), '');

  const isNegative = v.startsWith('-');
  v = v.replace(/-/g, '');

  const parts = v.split(decimalSeparator);
  let intPart = parts[0] || '';
  let decPart = parts[1] ?? '';

  if (decPart.length > decimals) {
    decPart = decPart.slice(0, decimals);
  }

  intPart = intPart.replace(/^0+(?=\d)/, '');

  if (intPart === '' && value.startsWith(decimalSeparator)) {
    intPart = '0';
  }

  const sign = isNegative ? '-' : '';
  const decimalSection = decimals > 0 && parts.length > 1 ? decimalSeparator + decPart : '';

  return `${sign}${intPart}${decimalSection}`;
}
