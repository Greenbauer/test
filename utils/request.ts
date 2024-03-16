export function getBaseUrl(): string {
  if (typeof window !== 'undefined') return '';
  const vc = process.env.VERCEL_URL;
  if (vc) return `https://${vc}`;
  return 'http://localhost:3000';
}

interface GetRequest {
  url: string;
}

export async function get<T>({url}: GetRequest): Promise<T> {
  const res = await fetch(url);
  
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
 
  return res.json()
}

interface PatchRequest<T> {
  url: string;
  data: Record<string, any>;
}

export async function patch<T>({url, data}: PatchRequest<T>): Promise<T> {
  const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
 
  return res.json()
}