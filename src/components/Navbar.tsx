import React, { useState } from 'react';
import {
  GraduationCap,
  Smartphone,
  Users,
  UserCheck,
  Video,
  Menu,
  X,
  BookOpen,
  ShieldCheck,
  LogIn,
  LogOut,
  User,
  Briefcase
} from 'lucide-react';
import { KENYA_PHONE_TARGET, WEEKLY_SUBSCRIPTION_FEE_KES } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

export type AppView = 'landing' | 'student' | 'student_auth' | 'parent' | 'teacher' | 'admin' | 'live_class';

interface NavbarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  onOpenTeacherRegister: () => void;
  onOpenAuth: () => void;
  activeLiveCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenTeacherRegister,
  onOpenAuth,
  activeLiveCount = 1,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, userProfile, signOut } = useAuth();

  const handleNavClick = (view: AppView) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      {/* Top micro-bar for M-Pesa Official Kenyan notice */}
      <div className="bg-emerald-900 text-white text-[11px] py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>Weekly tuition subscription: <strong className="text-amber-300">KES {WEEKLY_SUBSCRIPTION_FEE_KES} per subject</strong> via M-Pesa</span>
          </div>
          <div className="hidden sm:flex items-center space-x-2 font-mono">
            <span className="text-emerald-300">Daraja STK Push Target:</span>
            <span className="rounded bg-black/30 px-1.5 py-0.5 font-bold text-white">{KENYA_PHONE_TARGET}</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => handleNavClick('landing')}
          className="flex items-center space-x-2.5 text-left cursor-pointer group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#008751] to-emerald-500 text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center space-x-1">
              <span className="font-extrabold text-base tracking-tight text-slate-900">ElimuSpark</span>
              <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[10px] font-extrabold text-[#008751]">
                KENYA
              </span>
            </div>
            <p className="text-[10px] font-medium text-slate-500">Live CBC & KCSE Online Tuition</p>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 text-xs font-semibold">
          <button
            onClick={() => handleNavClick('landing')}
            className={`rounded-lg px-2.5 py-2 transition-colors cursor-pointer ${
              currentView === 'landing'
                ? 'bg-slate-100 text-slate-900 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => handleNavClick('student')}
            className={`rounded-lg px-2.5 py-2 transition-colors cursor-pointer ${
              currentView === 'student'
                ? 'bg-emerald-50 text-[#008751] font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Student Portal
          </button>

          <button
            onClick={() => handleNavClick('student_auth')}
            className={`rounded-lg px-2.5 py-2 transition-colors cursor-pointer flex items-center space-x-1 ${
              currentView === 'student_auth'
                ? 'bg-emerald-600 text-white font-bold'
                : 'text-emerald-700 hover:bg-emerald-50 font-bold'
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span>Student Mobile Sign In</span>
          </button>

          <button
            onClick={() => handleNavClick('parent')}
            className={`rounded-lg px-2.5 py-2 transition-colors cursor-pointer flex items-center space-x-1 ${
              currentView === 'parent'
                ? 'bg-amber-50 text-amber-800 font-bold border border-amber-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="h-3.5 w-3.5 text-amber-600" />
            <span>Parent View</span>
          </button>

          <button
            onClick={() => handleNavClick('teacher')}
            className={`rounded-lg px-2.5 py-2 transition-colors cursor-pointer ${
              currentView === 'teacher'
                ? 'bg-slate-100 text-slate-900 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Teacher Portal
          </button>

          <button
            onClick={() => handleNavClick('admin')}
            className={`rounded-lg px-2.5 py-2 transition-colors cursor-pointer flex items-center space-x-1 ${
              currentView === 'admin'
                ? 'bg-indigo-600 text-white font-bold'
                : 'text-indigo-700 hover:bg-indigo-50 font-bold'
            }`}
          >
            <Briefcase className="h-3.5 w-3.5" />
            <span>Admin Pool</span>
          </button>
        </nav>

        {/* Right Auth & CTA */}
        <div className="hidden lg:flex items-center space-x-2">
          {currentUser ? (
            <div className="flex items-center space-x-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1 text-left">
                <p className="text-xs font-bold text-slate-900 leading-tight">
                  {userProfile?.fullName || currentUser.email?.split('@')[0]}
                </p>
                <p className="text-[10px] font-semibold text-[#008751] capitalize">
                  {userProfile?.role || 'Student'} • Firebase
                </p>
              </div>
              <button
                onClick={() => signOut()}
                className="flex items-center space-x-1 rounded-xl border border-slate-200 bg-white hover:bg-red-50 hover:text-red-700 px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition-all cursor-pointer"
                title="Sign out of Firebase"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center space-x-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 transition-all cursor-pointer shadow-sm"
            >
              <LogIn className="h-3.5 w-3.5 text-[#008751]" />
              <span>Login</span>
            </button>
          )}

          <button
            onClick={() => handleNavClick('admin')}
            className="flex items-center space-x-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-3 py-2 text-xs font-bold transition-all cursor-pointer shadow-sm"
          >
            <span>Assign Tasks</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-1.5">
          <button
            onClick={() => handleNavClick('student_auth')}
            className="flex items-center space-x-1 rounded-lg bg-emerald-600 text-white px-2 py-1 text-xs font-bold"
          >
            <Smartphone className="h-3 w-3" />
            <span>Mobile Login</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-2 shadow-xl animate-in slide-in-from-top-2">
          {currentUser && (
            <div className="rounded-xl bg-slate-100 p-3 mb-2 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">{userProfile?.fullName || currentUser.email}</p>
                <p className="text-[10px] text-emerald-700 font-semibold capitalize">{userProfile?.role || 'Student'} (Firebase)</p>
              </div>
              <button onClick={() => signOut()} className="text-xs text-red-600 font-bold underline">
                Sign Out
              </button>
            </div>
          )}

          <button
            onClick={() => handleNavClick('landing')}
            className="w-full text-left rounded-xl p-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Home & Subjects
          </button>

          <button
            onClick={() => handleNavClick('student_auth')}
            className="w-full text-left rounded-xl p-2.5 text-sm font-bold text-white bg-[#008751] flex items-center space-x-2"
          >
            <Smartphone className="h-4 w-4" />
            <span>Student Mobile Sign Up / Sign In</span>
          </button>

          <button
            onClick={() => handleNavClick('student')}
            className="w-full text-left rounded-xl p-2.5 text-sm font-bold text-[#008751] bg-emerald-50"
          >
            Student Learning Dashboard
          </button>

          <button
            onClick={() => handleNavClick('admin')}
            className="w-full text-left rounded-xl p-2.5 text-sm font-bold text-indigo-700 bg-indigo-50 flex items-center space-x-2"
          >
            <Briefcase className="h-4 w-4" />
            <span>Admin Teacher Pool & Task Assignment</span>
          </button>

          <button
            onClick={() => handleNavClick('parent')}
            className="w-full text-left rounded-xl p-2.5 text-sm font-semibold text-amber-800 bg-amber-50 flex items-center space-x-2"
          >
            <UserCheck className="h-4 w-4" />
            <span>Parent Real-time Progress Mode</span>
          </button>

          <button
            onClick={() => handleNavClick('teacher')}
            className="w-full text-left rounded-xl p-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Teacher Portal & Assigned Tasks
          </button>

          <button
            onClick={() => handleNavClick('live_class')}
            className="w-full text-left rounded-xl p-2.5 text-sm font-semibold text-red-600 bg-red-50 flex items-center space-x-2"
          >
            <Video className="h-4 w-4" />
            <span>Live Video Classroom Demo</span>
          </button>
        </div>
      )}
    </header>
  );
};
