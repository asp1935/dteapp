import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { login } from '../features/auth/authSlice';
import { ROLES, DASHBOARD_ROUTES } from '../constants/roles';
import { LayoutDashboard, ShieldCheck, UserCircle, School, Info } from 'lucide-react';
import { cn } from '../utils/cn';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('password123'); // Default for demo
  const [role, setRole] = useState(ROLES.CANDIDATE);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, isAuthenticated, role: userRole } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && userRole) {
      const from = location.state?.from?.pathname || DASHBOARD_ROUTES[userRole];
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, userRole, navigate, location]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ username, password, role }));
  };

  const roleCards = [
    { id: ROLES.ADMIN, label: 'Admin', icon: ShieldCheck, color: 'text-red-500' },
    { id: ROLES.PRINCIPAL, label: 'Principal', icon: School, color: 'text-blue-500' },
    { id: ROLES.RO, label: 'RO', icon: Info, color: 'text-amber-500' },
    { id: ROLES.CANDIDATE, label: 'Candidate', icon: UserCircle, color: 'text-emerald-500' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 bg-background rounded-2xl shadow-xl overflow-hidden border border-border">
        {/* Left Side - Branding */}
        <div className="bg-primary p-12 text-white flex flex-col justify-center">
          <div className="mb-8 flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <School size={28} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">DTE PORTAL</h1>
          </div>
          <h2 className="text-4xl font-bold mb-6 leading-tight">Access Your Dashboard</h2>
          <p className="text-white/70 text-lg">
            A unified system for administrators, regional officers, institute principals, and faculty candidates.
          </p>
          <div className="mt-12 space-y-4">
            <div className="flex items-center space-x-3 text-sm text-white/50">
              <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
              <span>Secure Role-Based Access</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-white/50">
              <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
              <span>Real-time Recruitment Tracking</span>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="p-8 md:p-12">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-foreground">Sign In</h3>
            <p className="text-secondary mt-2">Choose your role and enter credentials</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {roleCards.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id)}
                  className={cn(
                    "flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all",
                    role === r.id 
                      ? "border-accent bg-accent/5 ring-4 ring-accent/10" 
                      : "border-border hover:border-accent/50 hover:bg-muted/50"
                  )}
                >
                  <r.icon className={cn("mb-2", r.color)} size={20} />
                  <span className="text-xs font-semibold">{r.label}</span>
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">Username</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all"
                  placeholder="admin_amey"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all"
                  placeholder="••••••••"
                />
                <div className="text-right mt-1.5">
                  <a href="#" className="text-xs text-accent hover:underline font-medium">Forgot password?</a>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-70 flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-secondary">
              Don't have an account? <a href="#" className="text-accent font-semibold hover:underline">Contact Admin</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
