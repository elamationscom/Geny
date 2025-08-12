import Card from '../components/Card';
import { useAppStore } from '../lib/store';
import { format } from 'date-fns';

export default function Calendar() {
  const posts = useAppStore((s) => s.scheduledPosts);

  const sorted = [...posts].sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime());

  return (
    <div className="space-y-4">
      {sorted.length === 0 ? (
        <Card>
          <div className="text-sm text-white/70">No scheduled posts yet. Try creating one on the Compose page.</div>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {sorted.map((p) => (
            <Card key={p.id} className="space-y-2">
              <div className="text-xs text-white/60">{format(p.scheduledAt, 'EEE, MMM d yyyy • HH:mm')}</div>
              <div className="text-sm">
                <span className="uppercase text-white/60 text-xs mr-2">{p.platform}</span>
                {p.content}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

