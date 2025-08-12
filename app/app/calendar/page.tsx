"use client";
import { useAppStore } from '@/lib/store';
import { format } from 'date-fns';
import { useState } from 'react';

export default function CalendarPage() {
  const posts = useAppStore((s) => s.scheduledPosts);
  const update = useAppStore((s) => s.updateScheduledPost);
  const remove = useAppStore((s) => s.deleteScheduledPost);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newWhen, setNewWhen] = useState<string>('');
  const [newContent, setNewContent] = useState<string>('');
  const sorted = [...posts].sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime());

  return (
    <div className="space-y-4">
      {sorted.length === 0 ? (
        <div className="glass-card p-4 text-sm text-white/70">No scheduled posts yet. Try creating one on the Compose page.</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {sorted.map((p) => (
            <div key={p.id} className="glass-card p-4 space-y-2">
              {editingId === p.id ? (
                <>
                  <input
                    type="datetime-local"
                    className="w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 text-white"
                    value={newWhen}
                    onChange={(e) => setNewWhen(e.target.value)}
                  />
                  <textarea
                    className="w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 text-sm text-white"
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                  />
                  <div className="flex items-center gap-2">
                    <button
                      className="px-3 py-1.5 rounded-md bg-white/10 border border-white/10 text-sm"
                      onClick={() => {
                        const dt = newWhen ? new Date(newWhen) : p.scheduledAt;
                        update(p.id, { scheduledAt: dt, content: newContent });
                        setEditingId(null);
                      }}
                    >Save</button>
                    <button className="px-3 py-1.5 rounded-md bg-white/10 border border-white/10 text-sm" onClick={() => setEditingId(null)}>Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-xs text-white/60">{format(p.scheduledAt, 'EEE, MMM d yyyy • HH:mm')}</div>
                  <div className="text-sm">
                    <span className="uppercase text-white/60 text-xs mr-2">{p.platform}</span>
                    {p.content}
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      className="px-3 py-1.5 rounded-md bg-white/10 border border-white/10 text-sm"
                      onClick={() => {
                        setEditingId(p.id);
                        setNewWhen(p.scheduledAt.toISOString().slice(0, 16));
                        setNewContent(p.content);
                      }}
                    >Edit</button>
                    <button
                      className="px-3 py-1.5 rounded-md bg-white/10 border border-rose-500/40 text-rose-300 text-sm"
                      onClick={() => remove(p.id)}
                    >Delete</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

