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
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-3xl">🚗</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">LARA Auto Services</h1>
          <p className="text-slate-500 mt-2">Sign in to your account</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <Input
            id="username"
            type="text"
            label="Username"
            placeholder="admin"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <Input
            id="password"
            type="password"
            label="Password"
            placeholder="••••••••"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {(error || localError) && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600 text-center">
              {localError || error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            size="lg"
            isLoading={loading}
          >
            Sign In
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Login;

