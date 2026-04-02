import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Smartphone, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp) {
      const { error } = await signUp(email, password, fullName);
      if (error) {
        toast.error(error);
      } else {
        toast.success('Account created! Check your email to verify.');
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error(error);
      } else {
        toast.success('Welcome back!');
        navigate('/');
      }
    }
    setLoading(false);
  };

  return (
    <div className="container max-w-md py-16 animate-fade-slide-up">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Smartphone className="h-10 w-10 text-white" />
          <span className="font-heading text-3xl font-extrabold text-white">Cell Point</span>
        </div>
        <p className="text-muted-foreground text-sm">
          {isSignUp ? 'Create your account' : 'Sign in to your account'}
        </p>
      </div>

      <div className="glass-card p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
                className="w-full h-10 px-3 rounded-lg bg-secondary border border-border/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="John Doe"
              />
            </div>
          )}

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full h-10 px-3 rounded-lg bg-secondary border border-border/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Password</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full h-10 px-3 pr-10 rounded-lg bg-secondary border border-border/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg btn-glow text-sm font-semibold disabled:opacity-50"
          >
            {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-primary hover:underline font-medium"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
}
