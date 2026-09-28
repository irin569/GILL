export function formatTHB(amount: number): string {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount).replace('THB', '฿');
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return dateString;
  }
}

export function maskKey(key: string): string {
  if (!key) return '';
  const parts = key.split('-');
  if (parts.length <= 1) {
    return key.length > 8 ? key.slice(0, 4) + '****' + key.slice(-4) : '****-****';
  }
  return parts.map((part, i) => (i === parts.length - 1 ? part : '••••')).join('-');
}

export function generateId(prefix: string = 'id'): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let str = '';
  for (let i = 0; i < 6; i++) {
    str += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}-${Date.now().toString(36).toUpperCase()}-${str}`;
}

export function generateGameKey(prefix: string = 'KEY'): string {
  const segment = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let s = '';
    for (let i = 0; i < 4; i++) {
      s += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return s;
  };
  return `${prefix}-${segment()}-${segment()}-${segment()}`;
}
