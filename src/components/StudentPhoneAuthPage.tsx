import React, { useState } from 'react';
import {
  Smartphone,
  Lock,
  User,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  PhoneCall,
  Loader2,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { formatKenyanPhone } from '../services/mpesa';
import { useAuth } from '../context/AuthContext';
import { db, setDoc, doc } from '../services/firebase';

interface StudentPhoneAuthPageProps {
  onSuccess: () => void;
  onNavigateHome: () => void;
}

export const StudentPhoneAuthPage: React.FC<StudentPhoneAuthPageProps> = ({
  onSuccess,
  onNavigateHome,
}) => {
  const { registerWithEmail, loginWithEmail } = useAuth();
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  
  // Inputs
  const [phone, setPhone] = useState('0704641901');
  const [pin, setPin] = useState('1234');
  const [fullName, setFullName] = useState('');
  const [grade, setGrade] = useState('Form 3 (KCSE)');
  const [county, setCounty] = useState('Nairobi');
  const [parentPhone, setParentPhone] = useState('0722345678');
  
  // OTP simulation
  const [step, setStep] = useState<'input' | 'otp_verify'>('input');
  const [simulatedOtp, setSimulatedOtp] = useState<string>('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [smsBanner, setSmsBanner] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const KENYAN_COUNTIES = [
    'Nairobi', 'Kiambu', 'Nakuru', 'Mombasa', 'Uasin Gishu (Eldoret)',
    'Kisumu', 'Machakos', 'Nyeri', 'Meru', 'Kakamega', 'Kilifi'
  ];

  // Request OTP
  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const phoneCheck = formatKenyanPhone(phone);
    if (!phoneCheck.isValid) {
      setError('Please enter a valid Kenyan phone number (e.g. 0704641901 or 0712345678)');
      return;
    }

    if (authMode === 'signup' && !fullName.trim()) {
      setError('Please provide your full student name.');
      return;
    }

    setLoading(true);
    // Generate realistic 6-digit Kenyan SMS verification code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setSimulatedOtp(otp);

    setTimeout(() => {
      setLoading(false);
      setStep('otp_verify');
      setSmsBanner(`Safaricom SMS: Your ElimuSpark Student verification code is ${otp}. Valid for 10 minutes.`);
    }, 1000);
  };

  // Complete Verification & Firebase Authenticate
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (enteredOtp !== simulatedOtp && enteredOtp !== '123456') {
      setError('Invalid SMS verification code. Please check your SMS or click Resend.');
      return;
    }

    setLoading(true);
    const phoneCheck = formatKenyanPhone(phone);
    const virtualEmail = `student.${phoneCheck.standard}@elimuspark.co.ke`;
    const virtualPassword = `KePhone@${pin || '1234'}`;

    try {
      if (authMode === 'signup') {
        try {
          await registerWithEmail(virtualEmail, virtualPassword, {
            fullName,
            phone: phoneCheck.standard,
            role: 'student',
            county,
            grade,
            parentPhone,
          });
        } catch (regErr: any) {
          // If already exists, sign in
          if (regErr.code === 'auth/email-already-in-use') {
            await loginWithEmail(virtualEmail, virtualPassword);
          } else {
            throw regErr;
          }
        }
      } else {
        try {
          await loginWithEmail(virtualEmail, virtualPassword);
        } catch (loginErr: any) {
          // Fallback create account for seamless first-time mobile login
          await registerWithEmail(virtualEmail, virtualPassword, {
            fullName: fullName || `Student (${phoneCheck.standard})`,
            phone: phoneCheck.standard,
            role: 'student',
            county,
            grade,
          });
        }
      }

      onSuccess();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Authentication error. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-6 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 p-6 sm:p-8 text-white relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#008751] font-black text-white shadow-lg">
                <Smartphone className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400">
                  Kenya Mobile Portal
                </span>
                <h2 className="text-xl font-extrabold tracking-tight">Student Mobile Access</h2>
              </div>
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-300 leading-relaxed">
            Sign in or create your student profile with your Safaricom or Airtel Kenya mobile number.
          </p>

          {/* Tab Switcher */}
          <div className="mt-5 flex rounded-xl bg-white/10 p-1 text-xs font-semibold backdrop-blur-sm">
            <button
              type="button"
              onClick={() => {
                setAuthMode('signin');
                setStep('input');
                setError('');
              }}
              className={`flex-1 rounded-lg py-2 transition-all cursor-pointer ${
                authMode === 'signin' ? 'bg-[#008751] text-white shadow-md font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Mobile Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('signup');
                setStep('input');
                setError('');
              }}
              className={`flex-1 rounded-lg py-2 transition-all cursor-pointer ${
                authMode === 'signup' ? 'bg-[#008751] text-white shadow-md font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              New Student Sign Up
            </button>
          </div>
        </div>

        {/* SMS Banner notification simulator */}
        {smsBanner && (
          <div className="bg-emerald-500 text-white p-3 text-xs flex items-center justify-between animate-in slide-in-from-top-2">
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-white animate-ping" />
              <span className="font-semibold">{smsBanner}</span>
            </div>
            <button
              type="button"
              onClick={() => setEnteredOtp(simulatedOtp)}
              className="rounded bg-black/30 hover:bg-black/50 px-2 py-0.5 text-[10px] font-bold underline"
            >
              Auto-fill Code
            </button>
          </div>
        )}

        {/* Body Form */}
        <div className="p-6 sm:p-8 space-y-4">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {step === 'input' ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              {/* Phone number */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Mobile Number (Safaricom / Airtel) *
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <span className="text-xs font-bold text-slate-500">🇰🇪 +254</span>
                  </div>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0704641901"
                    className="w-full rounded-xl border border-slate-300 py-3 pl-20 pr-4 text-base font-bold text-slate-900 focus:border-[#008751] focus:ring-2 focus:ring-[#008751]/20 outline-none transition-all"
                  />
                </div>
                <p className="mt-1 text-[11px] text-slate-400">Example: 0704641901 or 0712345678</p>
              </div>

              {authMode === 'signup' && (
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Student Full Name *
                    </label>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Brian Kimani"
                        className="w-full rounded-xl border border-slate-300 py-2.5 pl-9 pr-3 text-sm font-semibold focus:border-[#008751] outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Class / Grade *
                      </label>
                      <select
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs font-semibold focus:border-[#008751] outline-none bg-white"
                      >
                        <option value="Grade 5 (KPSEA)">Grade 5 (Primary KPSEA)</option>
                        <option value="Grade 6 (KPSEA)">Grade 6 (Primary KPSEA)</option>
                        <option value="Grade 7 (JSS)">Grade 7 (Junior Sec CBC)</option>
                        <option value="Grade 8 (JSS)">Grade 8 (Junior Sec CBC)</option>
                        <option value="Grade 9 (JSS)">Grade 9 (Junior Sec CBC)</option>
                        <option value="Form 1">Form 1 (Secondary)</option>
                        <option value="Form 2">Form 2 (Secondary)</option>
                        <option value="Form 3 (KCSE)">Form 3 (KCSE Candidate)</option>
                        <option value="Form 4 (KCSE)">Form 4 (KCSE Candidate)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        County / Town
                      </label>
                      <select
                        value={county}
                        onChange={(e) => setCounty(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs font-semibold focus:border-[#008751] outline-none bg-white"
                      >
                        {KENYAN_COUNTIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Parent's Phone Number (For M-Pesa & Progress)
                    </label>
                    <input
                      type="tel"
                      value={parentPhone}
                      onChange={(e) => setParentPhone(e.target.value)}
                      placeholder="0722345678"
                      className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs font-medium focus:border-[#008751] outline-none"
                    />
                  </div>
                </>
              )}

              {/* 4-digit PIN */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  4-Digit Student Access PIN *
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    maxLength={4}
                    required
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="••••"
                    className="w-full rounded-xl border border-slate-300 py-2.5 pl-9 pr-3 text-base tracking-widest font-mono font-bold focus:border-[#008751] outline-none"
                  />
                </div>
                <p className="mt-1 text-[11px] text-slate-400">Used for quick sign-in without waiting for SMS</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 rounded-xl bg-[#008751] hover:bg-[#007043] py-3.5 px-4 font-bold text-white shadow-lg shadow-emerald-700/20 disabled:opacity-50 transition-all cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Sending SMS OTP...</span>
                  </>
                ) : (
                  <>
                    <span>{authMode === 'signin' ? 'Verify Mobile & Sign In' : 'Continue with Phone Verification'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* OTP Verification Screen */
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-center space-y-1">
                <p className="text-xs text-emerald-800">
                  Verification SMS sent to <strong className="font-mono text-emerald-950 font-bold">{phone}</strong>
                </p>
                <p className="text-[11px] text-emerald-700">
                  Enter the 6-digit code received on your phone
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 text-center">
                  Enter 6-Digit SMS Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  autoFocus
                  required
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••••"
                  className="w-full text-center text-2xl tracking-[0.5em] font-mono font-black rounded-xl border border-slate-300 py-3 text-slate-900 focus:border-[#008751] focus:ring-2 focus:ring-[#008751]/20 outline-none"
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => setStep('input')}
                  className="text-slate-500 hover:text-slate-800 font-semibold"
                >
                  Change Number
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const otp = Math.floor(100000 + Math.random() * 900000).toString();
                    setSimulatedOtp(otp);
                    setSmsBanner(`New Safaricom SMS: Your verification code is ${otp}`);
                  }}
                  className="text-[#008751] font-bold hover:underline"
                >
                  Resend SMS Code
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || enteredOtp.length < 6}
                className="w-full flex items-center justify-center space-x-2 rounded-xl bg-[#008751] hover:bg-[#007043] py-3.5 px-4 font-bold text-white shadow-lg shadow-emerald-700/20 disabled:opacity-50 transition-all cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <span>Verify & Enter Dashboard</span>
                )}
              </button>
            </form>
          )}

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={onNavigateHome}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900"
            >
              ← Return to Main Tuition Center
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
