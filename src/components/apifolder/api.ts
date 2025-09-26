export const API_BASE = import.meta.env.VITE_API_URL || '';

export type Student = {
  id?: string;     // optional if backend returns _id
  _id?: string;
  name: string;
  age: number;
  email: string;
  phone: number;
  address: string;
  grade: string;
  schoolName: string;
  hobbies: string[];
  primaryLanguage: string;
};

export type StudentInput = Omit<Student, 'id' | '_id'>;

const base = '';

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(base + url, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init,
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} - ${await res.text().catch(()=> '')}`);
  return res.json() as Promise<T>;
}

export const StudentsApi = {
  list: () => request<Student[]>('/api/students').then(arr =>
    arr.map(s => ({ ...s, id: s.id ?? s._id }) as Student)
  ),
  create: (payload: StudentInput) =>
    request<Student>('/api/students', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    .then(s => ({ ...s, id: s.id ?? s._id })),
  update: (id: string, payload: Partial<StudentInput>) =>
    request<Student>(`/api/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }).then(s => ({ ...s, id: s.id ?? s._id })),
  removeMany: (ids: string[]) =>
    request<{ deleted: number }>('/api/students/bulk-delete', {
      method: 'POST',
      body: JSON.stringify({ ids }),
    }),
};