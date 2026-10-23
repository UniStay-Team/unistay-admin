// Корень C# API без /api/v1. 8003 — демо-стенд unistay-api (scripts/demo.py) с синтетическим seed;
// 8001 — обычный compose.yaml с пустой БД.
export const API_BASE_URL = 'http://127.0.0.1:8003';

export function apiUrl(path: string): string {
  return `${API_BASE_URL}/api/v1/${path}`;
}
