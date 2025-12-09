import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card } from './ui/Card';

const Login: React.FC = () => {
  const { login, loading, error } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLocalError(null);
    try {
      await login(username, password);
    } catch (e) {
      setLocalError('Unable to sign in. Check your credentials.');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-gray-50">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -right-[10%] w-[800px] h-[800px] rounded-full bg-blue-100/50 blur-3xl"></div>
        <div className="absolute top-[20%] -left-[10%] w-[600px] h-[600px] rounded-full bg-indigo-100/40 blur-3xl"></div>
      </div>

      <Card className="w-full max-w-md relative z-10 bg-white shadow-xl border-0">
        <div className="text-center mb-10">
          <div className="inline-block h-16 w-16 bg-blue-600 rounded-xl mb-6 shadow-lg shadow-blue-500/30 flex items-center justify-center">
            <span className="text-2xl font-black text-white">OI</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-2">OPEN INVOICE</h1>
          <p className="text-slate-500 font-medium text-sm">Sign in to your account</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <Input
            id="username"
            type="text"
            label="Username"
            placeholder="Enter username"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <Input
            id="password"
            type="password"
            label="Password"
            placeholder="Enter password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {(error || localError) && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 text-center font-medium">
              {localError || error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            size="lg"
            isLoading={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Login;

