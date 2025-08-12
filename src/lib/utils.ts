export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export function reviveDates<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj), (key, value) => {
    if (typeof value === 'string' && /\d{4}-\d{2}-\d{2}T/.test(value)) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) return d;
    }
    return value;
  });
}

