import SocialAccountCard from '../components/SocialAccountCard';
import Card from '../components/Card';
import Button from '../components/Button';
import { useAppStore } from '../lib/store';

export default function Dashboard() {
  const accounts = useAppStore((s) => s.accounts);
  const connect = useAppStore((s) => s.connectAccount);
  const disconnect = useAppStore((s) => s.disconnectAccount);
  const scheduled = useAppStore((s) => s.scheduledPosts);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white/70 text-sm">Upcoming posts</div>
              <div className="text-2xl font-semibold">{scheduled.length}</div>
            </div>
            <Button onClick={() => location.assign('/compose')}>New post</Button>
          </div>
        </Card>
        <Card>
          <div className="text-white/80 text-sm">Status</div>
          <div className="mt-2 text-white/60 text-sm">All systems operational.</div>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        {accounts.map((acc) => (
          <SocialAccountCard key={acc.platform} account={acc} onConnect={connect} onDisconnect={disconnect} />
        ))}
      </div>
    </div>
  );
}

