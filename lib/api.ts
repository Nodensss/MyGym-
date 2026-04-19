import type { Workout } from '@/lib/types';

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {})
    }
  });

  if (!response.ok) {
    const message = await response.text().catch(() => '');
    throw new Error(message || `Request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function fetchWorkouts() {
  return request<Workout[]>('/api/workouts');
}

export async function createWorkout(data: Workout) {
  return request<Workout>('/api/workouts', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function updateWorkout(id: string, data: Partial<Workout>) {
  return request<Workout>(`/api/workouts/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  });
}

export async function deleteWorkout(id: string) {
  return request<void>(`/api/workouts/${id}`, {
    method: 'DELETE'
  });
}

export async function fetchActive() {
  const result = await request<{ data: Workout } | null>('/api/active');
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
