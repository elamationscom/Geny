import { Platform } from './types';

export async function generateSuggestions(platform: Platform): Promise<string[]> {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const url = `/api/ai/suggestions?t=${Date.now()}_${Math.random().toString(36).slice(2)}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        body: JSON.stringify({ platform, seed: Math.random().toString(36).slice(2) }),
      });
      const data = await res.json();
      if (Array.isArray(data?.ideas) && data.ideas.length > 0) return data.ideas as string[];
    } catch {}
    // backoff before retry
    const delayMs = 1500 * (attempt + 1);
    await new Promise((r) => setTimeout(r, delayMs));
  }
  return [];
}

// Import supabase client from the dedicated module
export { supabase } from './supabase';

