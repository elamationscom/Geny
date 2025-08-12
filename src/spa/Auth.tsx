import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import { useAppStore } from '../lib/store';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const signIn = useAppStore((s) => s.signIn);
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !name) return;
    signIn({ id: crypto.randomUUID(), email, name });
    navigate('/dashboard');
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-md mx:auto px-6 md:px-10 py-16">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Welcome to Geny</h2>
          <p className="text-sm text-white/70 mb-6">Sign in to start composing and scheduling posts. No password needed for this demo.</p>
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input label="Name" placeholder="Taylor" value={name} onChange={(e) => setName(e.target.value)} />
            <Input label="Email" type="email" placeholder="taylor@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Button className="w-full" type="submit">Continue</Button>
          </form>
        </Card>
      </main>
    </div>
  );
}

