import Card from '../components/Card';
import Input from '../components/Input';
import { useAppStore } from '../lib/store';

export default function Settings() {
  const user = useAppStore((s) => s.user)!;
  const updateUser = useAppStore((s) => s.updateUser);
  return (
    <div className="space-y-4">
      <Card className="space-y-3">
        <div className="font-medium">Profile</div>
        <div className="grid md:grid-cols-2 gap-3">
          <Input label="Name" value={user.name} onChange={(e) => updateUser({ name: e.target.value })} />
          <Input label="Email" value={user.email} onChange={(e) => updateUser({ email: e.target.value })} />
        </div>
      </Card>
      <Card className="space-y-2">
        <div className="font-medium">Theme</div>
        <div className="text-sm text-white/60">Dark theme is enabled by default in this demo.</div>
      </Card>
    </div>
  );
}

