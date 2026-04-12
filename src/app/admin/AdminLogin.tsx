import { useState } from 'react';
import { Lock, Mail } from 'lucide-react';
import { useAdmin } from './AdminContext';

export default function AdminLogin({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const { login, loading: authLoading } = useAdmin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        onLoginSuccess();
      } else {
        setError('Invalid email or password');
        setPassword('');
      }
    } catch (error) {
      setError('Login failed. Please check your connection and try again.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-[32px] shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="Pawan Hans" className="w-16 h-16 mx-auto mb-4 object-contain" />
          <h1 className="text-3xl font-semibold text-slate-900">Admin Panel</h1>
          <p className="text-slate-600 mt-2">Pawan Hans Yatra</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Admin@pawanhans.com"
              className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              <Lock className="w-4 h-4 inline mr-2" />
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 text-sm font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white py-3 rounded-full font-semibold transition"
          >
            {loading ? 'Logging in...' : 'Login to Admin Panel'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          <p>Protected Admin Area</p>
          <p>Unauthorized access is prohibited</p>
        </div>
      </div>
    </div>
  );
}
