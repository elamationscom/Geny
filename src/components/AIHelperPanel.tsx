import Card from './Card';
import Button from './Button';
import { Platform } from '../lib/types';
import { generateSuggestions } from '../lib/ai';
import { useState } from 'react';

export default function AIHelperPanel({ platform, onPick }: { platform: Platform; onPick: (text: string) => void }) {
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    try {
      const list = await generateSuggestions(platform);
      setIdeas(list);
      if (!list || list.length === 0) setError('No ideas returned. Try again.');
    } catch (e) {
      setError('Could not generate ideas. Try again.');
    }
    setLoading(false);
  }

  return (
    <Card className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="font-medium">AI Suggestions</div>
        <Button variant="ghost" onClick={handleGenerate}>{loading ? 'Thinking…' : 'Generate'}</Button>
      </div>
      <div className="space-y-2">
        {error ? <div className="text-sm text-rose-300">{error}</div> : null}
        {ideas.length === 0 && !error ? (
          <div className="text-sm text-white/60">Click Generate to get 5 ready-to-post ideas tailored for this platform.</div>
        ) : null}
        {ideas.map((idea, idx) => (
          <button
            key={idx}
            onClick={() => onPick(idea)}
            className="w-full text-left p-3 rounded-md bg-white/5 hover:bg-white/10 text-sm"
          >
            {idea}
          </button>
        ))}
      </div>
    </Card>
  );
}

