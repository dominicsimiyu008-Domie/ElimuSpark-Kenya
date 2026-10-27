import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, ShieldCheck, GraduationCap, Users, Loader2 } from 'lucide-react';
import { useAuth, UserRole } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: UserRole;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultRole = 'student' }) => {
  const { loginWithEmail, registerWithEmail, loginWithGoogle } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [role, setRole] = useState<UserRole>(defaultRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('0704641901');
  const [county, setCounty] = useState('Nairobi');
  const [grade, setGrade] = useState('Form 3 (KCSE)');
  const [tscNumber, setTscNumber] = useState('');
  const [qualification, setQualification] = useState('B.Ed (Science)');
  const [childName, setChildName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signin') {
        await loginWithEmail(email, password);
      } else {
        await registerWithEmail(email, password, {
          fullName,
          phone,
          role,
          county,
          grade: role === 'student' ? grade : undefined,
          tscNumber: role === 'teacher' ? tscNumber : undefined,
          qualification: role === 'teacher' ? qualification : undefined,
          childName: role === 'parent' ? childName : undefined,
        });
      }
      onClose();
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password. Please check your credentials or create a new account.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please sign in instead.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else {
        setError(err.message || 'Authentication failed. Please retry.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickCreate = async (presetRole: UserRole) => {
    setLoading(true);
    setError('');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const testEmail = `${presetRole}.${randomSuffix}@elimuspark.co.ke`;
    const testPass = 'Kenya2026!';

    try {
      await registerWithEmail(testEmail, testPass, {
        fullName:
          presetRole === 'teacher'
            ? 'Mwalimu John Mutua'
            : presetRole === 'parent'
            ? 'David Kimani (Parent)'
            : 'Brian Kimani',
        phone: '0704641901',
        role: presetRole,
        county: 'Nairobi',
        grade: 'Form 3 (KCSE)',
        tscNumber: presetRole === 'teacher' ? `TSC/${randomSuffix}` : undefined,
        qualification: presetRole === 'teacher' ? 'B.Ed (Science)' : undefined,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to initialize account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#008751] font-bold text-white shadow-sm">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold">
                  {mode === 'signin' ? 'Sign In to ElimuSpark' : 'Create Real Account'}
                </h3>
                <p className="text-xs text-emerald-200">Firebase Powered Authentication</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-white/80 hover:bg-white/20 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Mode Tabs */}
          <div className="mt-4 flex rounded-xl bg-white/10 p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setError('');
              }}
              className={`flex-1 rounded-lg py-1.5 transition-all ${
                mode === 'signin' ? 'bg-[#008751] text-white shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setError('');
              }}
              className={`flex-1 rounded-lg py-1.5 transition-all ${
                mode === 'signup' ? 'bg-[#008751] text-white shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'signup' && (
              <>
                {/* Role Switcher */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Select Your Role *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'student', label: 'Student' },
                      { id: 'parent', label: 'Parent' },
                      { id: 'teacher', label: 'Teacher' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setRole(item.id as UserRole)}
                        className={`rounded-xl border py-2 text-xs font-bold transition-all ${
                          role === item.id
                            ? 'border-[#008751] bg-emerald-50 text-emerald-900 ring-1 ring-[#008751]'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={role === 'teacher' ? 'Tr. John Mutua' : 'Brian Kimani'}
                      className="w-full rounded-xl border border-slate-300 py-2.5 pl-9 pr-3 text-sm focus:border-[#008751] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    M-Pesa Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0704641901"
                      className="w-full rounded-xl border border-slate-300 py-2.5 pl-9 pr-3 text-sm focus:border-[#008751] outline-none"
                    />
                  </div>
                </div>

                {role === 'student' && (
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Current Grade / Level
                    </label>
                    <select
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 py-2.5 px-3 text-sm focus:border-[#008751] outline-none bg-white"
                    >
                      <option value="Grade 5 (KPSEA)">Grade 5 (Primary KPSEA)</option>
                      <option value="Grade 6 (KPSEA)">Grade 6 (Primary KPSEA)</option>
                      <option value="Grade 7 (JSS)">Grade 7 (Junior Secondary CBC)</option>
                      <option value="Grade 8 (JSS)">Grade 8 (Junior Secondary CBC)</option>
                      <option value="Form 1">Form 1 (Secondary)</option>
                      <option value="Form 2">Form 2 (Secondary)</option>
                      <option value="Form 3 (KCSE)">Form 3 (KCSE Candidate Prep)</option>
                      <option value="Form 4 (KCSE)">Form 4 (KCSE Candidate Class)</option>
                    </select>
                  </div>
                )}

                {role === 'teacher' && (
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      TSC Number (Optional / Recommended)
                    </label>
                    <input
                      type="text"
                      value={tscNumber}
                      onChange={(e) => setTscNumber(e.target.value)}
                      placeholder="TSC/482910"
                      className="w-full rounded-xl border border-slate-300 py-2.5 px-3 text-sm focus:border-[#008751] outline-none font-mono"
                    />
                  </div>
                )}

                {role === 'parent' && (
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Child's Name
                    </label>
                    <input
                      type="text"
                      value={childName}
                      onChange={(e) => setChildName(e.target.value)}
                      placeholder="e.g. Brian Kimani"
                      className="w-full rounded-xl border border-slate-300 py-2.5 px-3 text-sm focus:border-[#008751] outline-none"
                    />
                  </div>
                )}
              </>
            )}

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-slate-300 py-2.5 pl-9 pr-3 text-sm focus:border-[#008751] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-300 py-2.5 pl-9 pr-3 text-sm focus:border-[#008751] outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 rounded-xl bg-[#008751] hover:bg-[#007043] py-3 px-4 font-bold text-white shadow-md shadow-emerald-700/20 disabled:opacity-50 transition-all cursor-pointer"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <span>{mode === 'signin' ? 'Sign In to Account' : 'Complete Registration'}</span>
              )}
            </button>
          </form>

          {/* Quick Real Account Creator buttons for rapid evaluation */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 text-center">
              Quick Test Sign-In via Firebase
            </p>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => handleQuickCreate('student')}
                disabled={loading}
                className="rounded-lg bg-slate-100 hover:bg-slate-200 py-2 px-1 text-center font-bold text-slate-700 transition-colors"
              >
                🎓 Student
              </button>
              <button
                type="button"
                onClick={() => handleQuickCreate('parent')}
                disabled={loading}
                className="rounded-lg bg-slate-100 hover:bg-slate-200 py-2 px-1 text-center font-bold text-slate-700 transition-colors"
              >
                👨‍👩‍👧 Parent
              </button>
              <button
                type="button"
                onClick={() => handleQuickCreate('teacher')}
                disabled={loading}
                className="rounded-lg bg-slate-100 hover:bg-slate-200 py-2 px-1 text-center font-bold text-slate-700 transition-colors"
              >
                👨‍🏫 Teacher
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
