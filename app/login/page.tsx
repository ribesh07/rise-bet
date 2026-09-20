'use client';

import { useState } from 'react';
import { Shield, Eye, EyeOff, Loader2 } from 'lucide-react';
import { mockLogin, setToken, setRole, getRole } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      const result = await mockLogin(email, password);
      setToken(result.token);
      setRole(result.role);
      localStorage.setItem('admin_role', result.role);
      toast.success('Welcome back!');
      router.replace('/');
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-card/50 to-background px-4 py-8">
      <div className="w-full max-w-md mx-auto">
        <div className="glass-card p-8 md:p-10">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gold-gradient flex items-center justify-center mb-4 shadow-gold-lg">
              <Shield className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-3xl font-bold gold-text mb-2">RiseBet Admin</h1>
            <p className="text-muted text-sm">Secure operator panel</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@risebet.com"
                className="w-full bg-background/50 border border-border rounded-lg px-4 py-2.5 text-white placeholder-muted focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-background/50 border border-border rounded-lg px-4 py-2.5 pr-12 text-white placeholder-muted focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-gold transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-xs text-muted text-center mb-2">Demo credentials</p>
            <p className="text-xs text-gray-400 text-center font-mono">
              admin@risebet.com / admin123
              <span className="text-gold ml-2">(Superadmin)</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
