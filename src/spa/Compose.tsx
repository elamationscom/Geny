import { useState } from 'react';
import TextArea from '../components/TextArea';
import Scheduler from '../components/Scheduler';
import AIHelperPanel from '../components/AIHelperPanel';
import Card from '../components/Card';
import Button from '../components/Button';
import { Platform } from '../lib/types';
import { useAppStore } from '../lib/store';

export default function Compose() {
  const [platform, setPlatform] = useState<Platform>('instagram');
  const [content, setContent] = useState('');
  const createScheduled = useAppStore((s) => s.schedulePost);

  function handleSchedule(when: Date, chosenPlatform: Platform) {
    createScheduled({ platform: chosenPlatform, content, scheduledAt: when });
    setContent('');
    alert('Post scheduled!');
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <div className="flex items-center gap-3 mb-3">
            <label className="text-sm text-white/80">Platform</label>
            <select
              className="rounded-md bg:white/5 border border-white/10 px-3 py-1.5 text-white outline-none focus:ring-2 focus:ring-white/20"
              value={platform}
              onChange={(e) => setPlatform(e.target.value as Platform)}
            >
              <option value="instagram">Instagram</option>
              <option value="linkedin">LinkedIn</option>
              <option value="facebook">Facebook</option>
            </select>
          </div>
          <TextArea
            label="Caption"
            placeholder="Write something great…"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="mt-3">
            <Button onClick={() => navigator.clipboard.writeText(content)} variant="ghost">Copy</Button>
          </div>
        </Card>
        <Scheduler onSchedule={handleSchedule} />
      </div>
      <AIHelperPanel platform={platform} onPick={(t) => setContent(t)} />
    </div>
  );
}

