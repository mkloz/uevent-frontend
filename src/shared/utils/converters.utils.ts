export function objectToSearchParams(obj: object) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined || value === null || value === '') continue;

    if (Array.isArray(value)) {
      if (value.length === 0) continue;
      value.forEach((val) => params.append(key, val));
    } else if (value instanceof Date) {
      params.append(key, value.toISOString());
    } else if (typeof value === 'object' && value !== null) {
      params.append(key, JSON.stringify(value));
    } else {
      params.append(key, String(value));
    }
  }

  return params;
}
