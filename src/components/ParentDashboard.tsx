import React, { useState } from 'react';
import {
  TrendingUp,
  Clock,
  Award,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  MessageSquare,
  ShieldCheck,
  CreditCard,
  Send,
  Download,
  BookOpen,
  UserCheck,
  ArrowUpRight
} from 'lucide-react';
import { StudentProgress, Subscription, Subject } from '../types';
import { KENYA_PHONE_TARGET, WEEKLY_SUBSCRIPTION_FEE_KES } from '../data/mockData';

interface ParentDashboardProps {
  progress: StudentProgress;
  subscriptions: Subscription[];
  subjects: Subject[];
  onOpenMpesa: (subject: Subject) => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  progress,
  subscriptions,
  subjects,
  onOpenMpesa,
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'attendance' | 'subscriptions' | 'reports'>('analytics');
  const [whatsappSent, setWhatsappSent] = useState(false);

  const handleSimulateWhatsAppReport = () => {
    setWhatsappSent(true);
    setTimeout(() => setWhatsappSent(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Parent View Identification & Student Summary */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 p-6 md:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 text-xs font-semibold text-emerald-300">
              <UserCheck className="h-3.5 w-3.5" />
              <span>Parental Monitoring Mode • Live Synced</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {progress.studentName}'s Academic Report
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-xl">
              Real-time attendance, CBC competencies, KNEC mock assessment marks, and teacher remarks for {progress.grade}.
            </p>
          </div>

          {/* Quick M-Pesa Subscription Status Card */}
          <div className="rounded-2xl bg-white/10 backdrop-blur-md p-4 border border-white/10 flex flex-col justify-between space-y-3 min-w-[240px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-emerald-200">Active Subscriptions</span>
              <span className="rounded bg-[#008751] px-2 py-0.5 text-[11px] font-bold text-white">
                {subscriptions.length} Subjects
              </span>
            </div>
            <div>
              <p className="text-xs text-slate-300">Target M-Pesa Line</p>
              <p className="text-lg font-mono font-bold text-amber-300">{KENYA_PHONE_TARGET}</p>
            </div>
            <p className="text-[11px] text-slate-300">KES {WEEKLY_SUBSCRIPTION_FEE_KES} / week per subject</p>
          </div>
        </div>

        {/* Decorative circle */}
        <div className="absolute -right-12 -bottom-12 h-64 w-64 rounded-full bg-emerald-600/10 blur-3xl pointer-events-none" />
      </div>

      {/* High-level KPI metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Attendance */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Attendance Rate</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-[#008751]">
              <Calendar className="h-5 w-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{progress.attendanceRate}%</p>
          <div className="flex items-center space-x-1 text-xs text-emerald-700 font-semibold mt-1">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Regular attendance</span>
          </div>
        </div>

        {/* Average Score */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Average Mock Mark</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Award className="h-5 w-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{progress.averageScore}%</p>
          <div className="flex items-center space-x-1 text-xs text-emerald-700 font-semibold mt-1">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>+8% over 4 weeks</span>
          </div>
        </div>

        {/* Study Hours */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Weekly Study Hours</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{progress.weeklyHoursLogged} hrs</p>
          <p className="text-xs text-slate-500 mt-1">Goal: 8.0 hrs/week</p>
        </div>

        {/* Total Assessments */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Assessments Done</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <BookOpen className="h-5 w-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{progress.totalAssessmentsTaken}</p>
          <p className="text-xs text-slate-500 mt-1">100% submission rate</p>
        </div>
      </div>

      {/* Main Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Real-time Progression Chart & CBC Competencies */}
        <div className="lg:col-span-2 space-y-6">
          {/* Week-by-Week Progress Chart (SVG Data Visualization) */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900">5-Week Performance Progression</h3>
                <p className="text-xs text-slate-500">Continuous assessment marks tracked across live tutoring sessions</p>
              </div>
              <div className="flex items-center space-x-3 text-xs">
                <span className="flex items-center space-x-1.5 font-semibold text-[#008751]">
                  <span className="h-3 w-3 rounded-full bg-[#008751]" />
                  <span>Exam Score (%)</span>
                </span>
                <span className="flex items-center space-x-1.5 font-semibold text-amber-600">
                  <span className="h-3 w-3 rounded-full bg-amber-500" />
                  <span>Hours Tutored</span>
                </span>
              </div>
            </div>

            {/* Visual Bars Chart */}
            <div className="pt-6">
              <div className="grid grid-cols-5 gap-3 sm:gap-6 items-end h-56 pb-6 border-b border-slate-200">
                {progress.weeklyProgressTrend.map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center h-full justify-end group">
                    <span className="text-xs font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                      {item.score}%
                    </span>
                    <div className="w-full flex justify-center items-end space-x-1.5 sm:space-x-2 h-full">
                      {/* Score Bar */}
                      <div
                        className="w-5 sm:w-8 rounded-t-lg bg-gradient-to-t from-[#008751] to-emerald-400 transition-all duration-500 group-hover:brightness-110 shadow-sm"
                        style={{ height: `${item.score}%` }}
                      />
                      {/* Hours Bar */}
                      <div
                        className="w-3 sm:w-5 rounded-t-lg bg-amber-400 transition-all duration-500 group-hover:brightness-110"
                        style={{ height: `${(item.hours / 10) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-600 mt-2">{item.week}</span>
                    <span className="text-[10px] text-slate-400">{item.hours} hrs</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
              <span>Baseline: Wk 1 (72%)</span>
              <span className="font-bold text-emerald-700">Latest: Wk 5 (88% - Distinction)</span>
            </div>
          </div>

          {/* CBC Competencies & Core Learning Pillars */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Kenyan CBC Core Competencies Mastery</h3>
              <p className="text-xs text-slate-500">Holistic rubric evaluation in line with Kenya Institute of Curriculum Development (KICD)</p>
            </div>

            <div className="pt-4 space-y-4">
              {progress.competencies.map((comp, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{comp.name}</span>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                          comp.level === 'Exceeding'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {comp.level} Expectations
                      </span>
                      <span className="font-mono font-bold text-slate-700">{comp.score}%</span>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        comp.score >= 90
                          ? 'bg-[#008751]'
                          : comp.score >= 80
                          ? 'bg-emerald-500'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${comp.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Tutor Remarks, M-Pesa Subscriptions & WhatsApp Alerts */}
        <div className="space-y-6">
          {/* M-Pesa Weekly Subscription Management */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Weekly Tuition Fees</h3>
                <p className="text-xs text-slate-500">500 KES/wk per subject</p>
              </div>
              <span className="rounded-full bg-emerald-100 p-1.5 text-[#008751]">
                <CreditCard className="h-4 w-4" />
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {subscriptions.map((sub) => {
                const isExpiring = sub.status === 'expiring_soon';
                const subjectObj = subjects.find((s) => s.id === sub.subjectId) || subjects[0];
                return (
                  <div
                    key={sub.subjectId}
                    className={`rounded-xl border p-3 text-xs transition-all ${
                      isExpiring ? 'border-amber-300 bg-amber-50/50' : 'border-slate-200 bg-slate-50/60'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>{sub.subjectName}</span>
                      <span className="text-[#008751]">KES {sub.amountKES}/wk</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                      <span>Receipt: <strong className="font-mono text-slate-700">{sub.mpesaReceipt}</strong></span>
                      <span className={isExpiring ? 'text-amber-700 font-bold' : 'text-emerald-700'}>
                        {isExpiring ? 'Expires in 1 day' : 'Active'}
                      </span>
                    </div>

                    {isExpiring && (
                      <button
                        onClick={() => onOpenMpesa(subjectObj)}
                        className="mt-2 w-full flex items-center justify-center space-x-1.5 rounded-lg bg-[#008751] py-1.5 text-xs font-bold text-white hover:bg-[#007043] cursor-pointer"
                      >
                        <span>Renew 500 KES via M-Pesa</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-center">
              <p className="text-[11px] text-slate-500">
                Lipa Na M-Pesa Till: <strong className="font-mono text-slate-800">{KENYA_PHONE_TARGET}</strong>
              </p>
            </div>
          </div>

          {/* Teacher's Direct Confidential Note to Parent */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                alt="Mwalimu John Mutua"
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <h4 className="text-sm font-bold text-slate-900">Mwalimu John Mutua</h4>
                <p className="text-xs text-[#008751] font-semibold">Senior Tutor • Mathematics & Physics</p>
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-slate-50 p-4 text-xs text-slate-700 border border-slate-200/80 leading-relaxed">
              <p className="italic font-medium text-slate-800">
                “Mr. Kimani, Brian has shown exceptional discipline with his quadratic equations assignment this week. His confidence in matrix inverses has jumped from 60% to 92%. We are now introducing Paper 2 vectors.”
              </p>
              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                <span>Verified Teacher Remark</span>
                <span>Yesterday, 7:15 PM</span>
              </div>
            </div>
          </div>

          {/* Send Weekly Summary to Parent WhatsApp / SMS */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 shadow-sm">
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-900 mb-1">
              <MessageSquare className="h-4 w-4 text-[#008751]" />
              <span>Parent WhatsApp & SMS Updates</span>
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed mb-3">
              We send automated weekly academic progress digests to your phone ({progress.parentPhone}).
            </p>
            <button
              onClick={handleSimulateWhatsAppReport}
              className="w-full flex items-center justify-center space-x-2 rounded-xl bg-[#008751] py-2.5 px-4 text-xs font-bold text-white shadow-sm hover:bg-[#007043] transition-all cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{whatsappSent ? 'Weekly Report Sent to WhatsApp!' : 'Send Instant Progress Digest Now'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
