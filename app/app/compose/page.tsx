"use client";
import { useMemo, useState } from 'react';
import { useAppStore } from '@/lib/store';
import AIHelperPanel from '@/components/AIHelperPanel';
import { postToSocialMedia, getDemoImageUrl } from '@/lib/social';

type Platform = 'instagram' | 'linkedin' | 'facebook';

export default function ComposePage() {
  const [platform, setPlatform] = useState<Platform>('instagram');
  const [content, setContent] = useState('');
  const [preferences, setPreferences] = useState('');
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [postNowLoading, setPostNowLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const schedule = useAppStore((s) => s.schedulePost);
  const bulkSchedule = useAppStore((s) => s.bulkSchedulePosts);
  const accounts = useAppStore((s) => s.accounts);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  type Mode = 'once' | 'daily' | 'days';
  const [mode, setMode] = useState<Mode>('once');
  const [onceWhen, setOnceWhen] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [times, setTimes] = useState<string[]>(['09:00']);

  const plan = useMemo(() => {
    const out: Date[] = [];
    if (mode === 'once') {
      if (!onceWhen) return out;
      out.push(new Date(onceWhen));
      return out;
    }
    if (!startDate || times.length === 0) return out;
    const start = new Date(startDate + 'T00:00');
    const daysToGenerate = 28; // next 4 weeks
    for (let i = 0; i < daysToGenerate; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      const isMatch = mode === 'daily' || selectedDays.includes(day.getDay());
      if (!isMatch) continue;
      for (const t of times) {
        const [hh, mm] = t.split(':').map((n) => parseInt(n, 10));
        const dt = new Date(day);
        dt.setHours(hh || 0, mm || 0, 0, 0);
        out.push(dt);
      }
    }
    return out;
  }, [mode, onceWhen, startDate, selectedDays, times]);

  function onSchedule() {
    const when = new Date(Date.now() + 60 * 60 * 1000);
    schedule({ platform, content, scheduledAt: when });
    setContent('');
    alert('Post scheduled in 1 hour!');
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <div className="glass-card p-4">
          <div className="flex items-center gap-3 mb-3">
            <label className="text-sm text-white/80">Platform</label>
            <select
              className="rounded-md bg-white/5 border border-white/10 px-3 py-1.5 text-white outline-none focus:ring-2 focus:ring-white/20"
              value={platform}
              onChange={(e) => setPlatform(e.target.value as Platform)}
            >
              <option value="instagram">Instagram</option>
              <option value="linkedin">LinkedIn</option>
              <option value="facebook">Facebook</option>
            </select>
          </div>
          <label className="block">
            <div className="mb-1 text-sm text-white/80">Your idea / draft</div>
            <textarea className="w-full min-h-[120px] rounded-md bg-white/5 border border-white/10 px-3 py-2" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write what you want to post about…" />
          </label>
          <label className="block">
            <div className="mb-1 text-sm text-white/80">Tone & preferences (optional)</div>
            <input className="w-full rounded-md bg-white/5 border border-white/10 px-3 py-2" value={preferences} onChange={(e) => setPreferences(e.target.value)} placeholder="e.g., friendly, concise, include 1 emoji, add #productivity" />
          </label>
          <div className="flex items-center gap-2 mt-2">
            <button
              className="px-3 py-1.5 rounded-md bg-white/10 border border-white/10 text-sm"
              onClick={async () => {
                if (!content.trim()) return;
                setLoading(true);
                setError(null);
                try {
                  const url = `/api/ai/generate?t=${Date.now()}_${Math.random().toString(36).slice(2)}`;
                  const res = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    cache: 'no-store',
                    body: JSON.stringify({ platform, idea: content, preferences, nonce: Date.now() }),
                  });
                  const data = await res.json();
                  const text = String(data?.text || '').trim();
                  setPreview(text);
                  if (!text) setError('No text returned. Try again.');
                } finally {
                  setLoading(false);
                }
              }}
            >{loading ? 'Generating…' : 'Test generate'}</button>
            <button className="px-3 py-1.5 rounded-md bg-white/10 border border-white/10 text-sm" onClick={() => setContent(preview)} disabled={!preview}>Use preview</button>
          </div>
          {error ? (
            <div className="mt-2 p-3 rounded-md bg-rose-500/10 border border-rose-500/30 text-sm text-rose-200">{error}</div>
          ) : null}
          {preview ? (
            <div className="mt-2 p-3 rounded-md bg-white/5 border border-white/10 text-sm whitespace-pre-wrap">{preview}</div>
          ) : null}
          <div className="mt-3">
            <button onClick={() => navigator.clipboard.writeText(content)} className="px-3 py-1.5 rounded-md bg-white/10 border border-white/10 text-sm">Copy</button>
          </div>
        </div>
        <div className="glass-card p-4">
          <button
            onClick={() => setIsPickerOpen(true)}
            className="w-full px-4 py-2 rounded-md bg-brand-500 hover:bg-brand-400 text-white"
          >
            Pick a time to post
          </button>
        </div>
      </div>
      <AIHelperPanel platform={platform} onPick={setContent} />

      {isPickerOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setIsPickerOpen(false)} />
          <div className="relative glass-card w-full max-w-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-medium">Schedule post</div>
              <button onClick={() => setIsPickerOpen(false)} className="px-2 py-1 rounded-md bg-white/10 border border-white/10 text-sm">Close</button>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <label className="block">
                <div className="mb-1 text-sm text-white/80">How often</div>
                <div className="space-y-2 text-sm">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="mode" value="once" checked={mode==='once'} onChange={() => setMode('once')} /> One time
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="mode" value="daily" checked={mode==='daily'} onChange={() => setMode('daily')} /> Every day
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="mode" value="days" checked={mode==='days'} onChange={() => setMode('days')} /> Specific days
                  </label>
                </div>
              </label>
              <label className="block">
                <div className="mb-1 text-sm text-white/80">Platform</div>
                <select
                  className="w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 text-white"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value as Platform)}
                >
                  <option value="instagram">Instagram</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="facebook">Facebook</option>
                </select>
              </label>
            </div>
            {mode === 'once' ? (
              <div className="grid md:grid-cols-2 gap-3">
                <label className="block">
                  <div className="mb-1 text-sm text-white/80">Pick date and time</div>
                  <input
                    type="datetime-local"
                    className="w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 text-white"
                    value={onceWhen}
                    onChange={(e) => setOnceWhen(e.target.value)}
                  />
                </label>
              </div>
            ) : (
              <div className="space-y-3">
                <label className="block">
                  <div className="mb-1 text-sm text-white/80">Start date</div>
                  <input
                    type="date"
                    className="w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 text-white"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </label>
                {mode === 'days' ? (
                  <div>
                    <div className="mb-1 text-sm text-white/80">Pick days</div>
                    <div className="grid grid-cols-7 gap-2 text-sm">
                      {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d, idx) => (
                        <label key={d} className={`flex items-center justify-center gap-2 px-2 py-1 rounded-md border cursor-pointer ${selectedDays.includes(idx) ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/10'}`}>
                          <input
                            type="checkbox"
                            checked={selectedDays.includes(idx)}
                            onChange={(e) => {
                              setSelectedDays((prev) => {
                                const set = new Set(prev);
                                if (e.target.checked) set.add(idx); else set.delete(idx);
                                return Array.from(set).sort();
                              });
                            }}
                          />
                          {d}
                        </label>
                      ))}
                    </div>
                  </div>
                ) : null}
                <div>
                  <div className="mb-1 text-sm text-white/80">Times in a day</div>
                  <div className="space-y-2">
                    {times.map((t, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          type="time"
                          className="rounded-md bg-white/5 border border-white/10 px-3 py-1.5 text-white"
                          value={t}
                          onChange={(e) => setTimes((arr) => arr.map((v, idx) => idx === i ? e.target.value : v))}
                        />
                        <button className="px-2 py-1 rounded-md bg-white/10 border border-white/10 text-xs" onClick={() => setTimes((arr) => arr.filter((_, idx) => idx !== i))}>Remove</button>
                      </div>
                    ))}
                    <button className="px-2 py-1 rounded-md bg-white/10 border border-white/10 text-xs" onClick={() => setTimes((arr) => [...arr, '09:00'])}>Add time</button>
                  </div>
                </div>
              </div>
            )}
            {plan.length > 1 ? (
              <div className="text-xs text-white/60">Planned posts: {plan.length} over next period</div>
            ) : null}
            <div className="flex items-center gap-2 pt-2">
              <button
                className="px-3 py-1.5 rounded-md bg-white/10 border border-white/10 text-sm"
                onClick={() => {
                  if (mode === 'once') {
                    if (!onceWhen) return;
                    schedule({ platform, content, scheduledAt: new Date(onceWhen) });
                  } else {
                    if (plan.length === 0) return;
                    bulkSchedule(plan.map((w) => ({ platform, content, scheduledAt: w })));
                  }
                  setIsPickerOpen(false);
                  setOnceWhen('');
                }}
              >Schedule</button>
              <button
                className="px-3 py-1.5 rounded-md bg-white/10 border border-white/10 text-sm"
                onClick={() => setIsPickerOpen(false)}
              >Cancel</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

