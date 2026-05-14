import type { Workout } from '@/lib/types';

interface RequestOptions extends RequestInit {
  retries?: number;
  retryDelayMs?: number;
}

async function request<T>(url: string, init: RequestOptions = {}): Promise<T> {
  const { retries = 0, retryDelayMs = 2000, ...fetchInit } = init;
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(url, {
        ...fetchInit,
        headers: {
          'Content-Type': 'application/json',
          ...(fetchInit.headers ?? {})
        }
      });

      if (!response.ok) {
        const message = await response.text().catch(() => '');
        throw new Error(message || `Request failed: ${response.status}`);
      }

      if (response.status === 204) {
        return undefined as T;
      }

      return (await response.json()) as T;
    } catch (error) {
      lastError = error;
      if (attempt === retries) break;
      await new Promise((resolve) => setTimeout(resolve, retryDelayMs * Math.pow(2, attempt)));
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Request failed');
}

export async function fetchWorkouts() {
  return request<Workout[]>('/api/workouts', { retries: 2 });
}

export async function createWorkout(data: Workout) {
  return request<Workout>('/api/workouts', {
    method: 'POST',
    body: JSON.stringify(data),
    retries: 3,
    retryDelayMs: 2000
  });
}

export async function updateWorkout(id: string, data: Partial<Workout>) {
  return request<Workout>(`/api/workouts/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
    retries: 2
  });
}

export async function deleteWorkout(id: string) {
  return request<void>(`/api/workouts/${id}`, {
    method: 'DELETE',
    retries: 2
  });
}

export async function fetchActive() {
  const result = await request<{ data: Workout } | null>('/api/active', { retries: 2 });
  return result?.data ?? null;
}

export async function saveActive(data: Workout) {
  return request<{ data: Workout }>('/api/active', {
    method: 'POST',
    body: JSON.stringify({ data })
  });
}

export async function clearActive() {
  return request<void>('/api/active', {
    method: 'DELETE'
  });
}

export function exportUrl() {
  return '/api/export';
}

export function aiExportUrl() {
  return '/api/export?format=ai';
}
