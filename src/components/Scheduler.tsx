import { useMemo, useState } from 'react';
import Card from './Card';
import Button from './Button';
import Input from './Input';
import { Platform } from '../lib/types';

type Repeat = 'none' | 'daily' | 'weekly';

export default function Scheduler({ onSchedule, onBulk }: { onSchedule: (when: Date, platform: Platform) => void; onBulk?: (whens: Date[], platform: Platform) => void }) {
  const [when, setWhen] = useState<string>('');
  const [platform, setPlatform] = useState<Platform>('instagram');
  const [repeat, setRepeat] = useState<Repeat>('none');
  const [timesPerDay, setTimesPerDay] = useState<number>(1);
  const [daysPerWeek, setDaysPerWeek] = useState<number>(5);

  const plan = useMemo(() => {
    const base = when ? new Date(when) : null;
    if (!base) return [] as Date[];
    if (repeat === 'none') return [base];
    const out: Date[] = [];
    if (repeat === 'daily') {
      for (let d = 0; d < 7; d++) {
        for (let t = 0; t < Math.max(1, timesPerDay); t++) {
          const dt = new Date(base);
          dt.setDate(base.getDate() + d);
          dt.setHours(base.getHours());
          dt.setMinutes(base.getMinutes());
          dt.setSeconds(0);
          dt.setMilliseconds(0);
          dt.setMinutes(dt.getMinutes() + t * 90);
          out.push(dt);
        }
      }
    }
    if (repeat === 'weekly') {
      const weeks = 4;
      for (let w = 0; w < weeks; w++) {
        for (let d = 0; d < Math.max(1, daysPerWeek); d++) {
          const dt = new Date(base);
          dt.setDate(base.getDate() + w * 7 + d);
          out.push(dt);
        }
      }
    }
    return out;
  }, [when, repeat, timesPerDay, daysPerWeek]);

  return (
    <Card className="space-y-3">
      <div className="grid md:grid-cols-2 gap-3">
        <Input type="datetime-local" label="Schedule time" value={when} onChange={(e) => setWhen(e.target.value)} />
        <label className="block">
          <div className="mb-1 text-sm text-white/80">Platform</div>
          <select
            className="w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-white/20"
            value={platform}
            onChange={(e) => setPlatform(e.target.value as Platform)}
          >
            <option value="instagram">Instagram</option>
            <option value="linkedin">LinkedIn</option>
            <option value="facebook">Facebook</option>
          </select>
        </label>
      </div>
      <div className="grid md:grid-cols-3 gap-3">
        <label className="block">
          <div className="mb-1 text-sm text-white/80">Repeat</div>
          <select className="w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 text-white" value={repeat} onChange={(e) => setRepeat(e.target.value as Repeat)}>
            <option value="none">None</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </label>
        {repeat === 'daily' ? (
          <Input type="number" min={1} max={10} label="Times per day" value={timesPerDay} onChange={(e) => setTimesPerDay(Number(e.target.value))} />
        ) : null}
        {repeat === 'weekly' ? (
          <Input type="number" min={1} max={7} label="Days per week" value={daysPerWeek} onChange={(e) => setDaysPerWeek(Number(e.target.value))} />
        ) : null}
      </div>
      {plan.length > 1 ? (
        <div className="text-xs text-white/60">Planned posts: {plan.length} over next period</div>
      ) : null}
      <Button
        onClick={() => {
          if (!when) return;
          if (plan.length > 1 && onBulk) {
            onBulk(plan, platform);
          } else {
            onSchedule(new Date(when), platform);
          }
          setWhen('');
        }}
        className="w-full"
      >
        Schedule
      </Button>
    </Card>
  );
}

