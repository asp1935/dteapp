import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Phone, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { Button, Input } from '../components/common/UIComponents';
import { registerCandidate } from '../features/auth/authSlice';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone_number: ''
  });

  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setValidationError('Password must be at least 6 characters');
      return;
    }

    const result = await dispatch(registerCandidate(formData));
    if (registerCandidate.fulfilled.match(result)) {
      navigate('/login', { state: { message: 'Registration successful! Please login.' } });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-accent p-3 rounded-2xl shadow-lg shadow-accent/20">
            <UserPlus className="text-white" size={32} />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          Candidate Registration
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-accent hover:text-accent/80 transition-colors">
            Login here
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-10 px-6 shadow-2xl shadow-slate-200/50 sm:rounded-3xl border border-slate-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {validationError && (
              <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl flex items-center text-sm animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={18} className="mr-2 shrink-0" />
                {validationError}
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl flex items-center text-sm animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={18} className="mr-2 shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-[42px] -translate-y-1/2 text-slate-400" size={18} />
                <Input
                  label="Full Name"
                  placeholder="Enter your full name"
                  className="pl-12 h-12 bg-slate-50/50 border-slate-200 focus:bg-white transition-all rounded-xl"
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  required
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-4 top-[42px] -translate-y-1/2 text-slate-400" size={18} />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-12 h-12 bg-slate-50/50 border-slate-200 focus:bg-white transition-all rounded-xl"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>

              <div className="relative">
                <Phone className="absolute left-4 top-[42px] -translate-y-1/2 text-slate-400" size={18} />
                <Input
                  label="Phone Number"
                  placeholder="10-digit mobile number"
                  className="pl-12 h-12 bg-slate-50/50 border-slate-200 focus:bg-white transition-all rounded-xl"
                  value={formData.phone_number}
                  onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-[42px] -translate-y-1/2 text-slate-400" size={18} />
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-12 h-12 bg-slate-50/50 border-slate-200 focus:bg-white transition-all rounded-xl"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-[42px] -translate-y-1/2 text-slate-400" size={18} />
                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-12 h-12 bg-slate-50/50 border-slate-200 focus:bg-white transition-all rounded-xl"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  required
                />
              </div>
            </div>

            <Button
              variant="accent"
              className="w-full h-12 text-base font-bold shadow-lg shadow-accent/25 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <span>Register as Candidate</span>
                  <ArrowRight size={18} className="ml-2" />
                </div>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100">
            <div className="grid grid-cols-2 gap-4 text-center text-xs text-slate-400">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center mb-1">
                  <CheckCircle size={14} className="text-accent" />
                </div>
                <span>Official Registration</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center mb-1">
                  <Lock size={14} className="text-accent" />
                </div>
                <span>Secure Data</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
