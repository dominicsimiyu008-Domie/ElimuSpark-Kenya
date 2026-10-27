import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Play,
  ArrowRight,
  Smartphone,
  ShieldCheck,
  Award,
  Video,
  FileCheck2,
  Users,
  Search,
  BookOpen,
  Calendar,
  Clock,
  Star,
  Zap,
  HelpCircle
} from 'lucide-react';
import { Subject, Teacher, EducationLevel } from '../types';
import { KENYA_PHONE_TARGET, WEEKLY_SUBSCRIPTION_FEE_KES } from '../data/mockData';

interface LandingPageProps {
  subjects: Subject[];
  teachers: Teacher[];
  onSelectSubject: (subject: Subject) => void;
  onOpenTeacherRegister: () => void;
  onNavigateToStudent: () => void;
  onNavigateToParent: () => void;
  onNavigateToStudentAuth?: () => void;
  onNavigateToAdmin?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  subjects,
  teachers,
  onSelectSubject,
  onOpenTeacherRegister,
  onNavigateToStudent,
  onNavigateToParent,
  onNavigateToStudentAuth,
  onNavigateToAdmin,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<'all' | EducationLevel>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const filteredSubjects = subjects.filter((s) => {
    const matchesLevel = selectedLevel === 'all' || s.level === selectedLevel;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  return (
    <div className="space-y-16 md:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-950 via-slate-900 to-emerald-950 px-6 py-16 md:px-12 md:py-24 text-white shadow-2xl border border-slate-800">
        {/* Decorative Kenyan Accent Glows */}
        <div className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-emerald-600/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center space-x-2 rounded-full bg-emerald-500/15 border border-emerald-400/30 px-4 py-1.5 text-xs font-bold text-emerald-300">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Kenya's #1 Online Tuition Center • CBC & KCSE Focused</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Connect With Qualified TSC Teachers For{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
              Live Video Tutoring
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Personalized 1-on-1 and small group live classes for Primary (Grade 4–6 / KPSEA), Junior Secondary (JSS), and Secondary (Form 1–4 KCSE). Weekly subscription of only{' '}
            <span className="font-bold text-amber-300">500 KES per subject</span> via M-Pesa.
          </p>

          {/* Call to Actions */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            {onNavigateToStudentAuth && (
              <button
                onClick={onNavigateToStudentAuth}
                className="flex items-center justify-center space-x-2 rounded-xl bg-amber-400 hover:bg-amber-300 px-6 py-3.5 text-sm font-black text-slate-950 shadow-lg shadow-amber-400/20 transition-all cursor-pointer"
              >
                <Smartphone className="h-4 w-4" />
                <span>Student Sign In With Mobile</span>
              </button>
            )}

            <button
              onClick={() => {
                const el = document.getElementById('subjects-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center justify-center space-x-2 rounded-xl bg-[#008751] hover:bg-[#007043] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-700/25 transition-all cursor-pointer"
            >
              <span>Explore Subjects & Fees</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            {onNavigateToAdmin && (
              <button
                onClick={onNavigateToAdmin}
                className="flex items-center justify-center space-x-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 px-5 py-3.5 text-xs font-bold text-white transition-all cursor-pointer"
              >
                <Users className="h-4 w-4 text-indigo-300" />
                <span>Admin Teacher Pool & Tasks</span>
              </button>
            )}

            <button
              onClick={onOpenTeacherRegister}
              className="flex items-center space-x-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 px-6 py-3.5 text-sm font-bold text-white transition-all cursor-pointer"
            >
              <Users className="h-4 w-4 text-emerald-300" />
              <span>Register as a Teacher</span>
            </button>

            <button
              onClick={onNavigateToParent}
              className="flex items-center space-x-1.5 rounded-xl border border-amber-400/30 bg-amber-500/10 hover:bg-amber-500/20 px-5 py-3.5 text-xs font-bold text-amber-300 transition-all cursor-pointer"
            >
              <Award className="h-4 w-4" />
              <span>Parent Progress Mode</span>
            </button>
          </div>

          {/* Trust Highlights */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-800/80 text-left">
            <div>
              <p className="text-2xl font-extrabold text-white">350+</p>
              <p className="text-xs text-slate-400">Vetted TSC Teachers</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-amber-400">500 KES</p>
              <p className="text-xs text-slate-400">Weekly/Sub via M-Pesa</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-emerald-400">96.8%</p>
              <p className="text-xs text-slate-400">KCSE Exam Improvement</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-white">0704641901</p>
              <p className="text-xs text-slate-400">Daraja STK Push Active</p>
            </div>
          </div>
        </div>
      </section>

      {/* Grade Levels & Subject Finder Section */}
      <section id="subjects-section" className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-[#008751] mb-1">
              <BookOpen className="h-4 w-4" />
              <span>Kenyan Curriculum Subjects</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              All Major Subjects for Primary & Secondary Levels
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Aligned with KICD standards: CBC Junior Secondary (Grade 7-9) and 8-4-4 Senior Secondary (Form 1-4).
            </p>
          </div>

          {/* Level Filter Tabs */}
          <div className="flex items-center space-x-1 rounded-xl bg-slate-100 p-1 text-xs font-semibold">
            {[
              { id: 'all', label: 'All Levels' },
              { id: 'primary', label: 'Primary (KPSEA)' },
              { id: 'jss', label: 'Junior Sec (JSS)' },
              { id: 'secondary', label: 'Form 1-4 (KCSE)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedLevel(tab.id as any)}
                className={`rounded-lg px-3 py-1.5 transition-all cursor-pointer ${
                  selectedLevel === tab.id
                    ? 'bg-white text-slate-900 shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Mathematics, Chemistry, Kiswahili..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-[#008751] focus:ring-2 focus:ring-[#008751]/20 outline-none"
          />
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSubjects.map((sub) => (
            <div
              key={sub.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="rounded bg-emerald-50 text-[#008751] px-2.5 py-1 text-xs font-bold">
                    {sub.syllabus}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {sub.activeTutorsCount} Tutors
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#008751] transition-colors">
                    {sub.name}
                  </h3>
                  <div className="flex flex-wrap gap-1 mt-1 mb-2">
                    {sub.gradeLevels.map((lvl) => (
                      <span key={lvl} className="text-[10px] font-medium text-slate-500 bg-slate-100 rounded px-1.5 py-0.5">
                        {lvl}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{sub.description}</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Weekly Fee</p>
                  <p className="text-base font-extrabold text-slate-900">
                    KES {sub.weeklyPriceKES} <span className="text-[11px] font-normal text-slate-500">/ week</span>
                  </p>
                </div>

                <button
                  onClick={() => onSelectSubject(sub)}
                  className="flex items-center space-x-1.5 rounded-xl bg-[#008751] hover:bg-[#007043] px-4 py-2 text-xs font-bold text-white shadow-sm transition-all cursor-pointer"
                >
                  <Smartphone className="h-3.5 w-3.5" />
                  <span>Subscribe (M-Pesa)</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* M-Pesa Daraja STK Push Step-by-Step Feature Banner */}
      <section className="rounded-3xl bg-slate-900 text-white p-8 md:p-12 relative overflow-hidden shadow-xl border border-slate-800">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-1 space-y-4">
            <div className="inline-flex items-center space-x-1.5 rounded-full bg-[#008751]/30 border border-[#008751]/40 px-3 py-1 text-xs font-bold text-emerald-300">
              <Zap className="h-3.5 w-3.5" />
              <span>Instant Daraja API Integration</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-extrabold">
              Weekly 500 KES Subscription via M-Pesa STK Push
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              No complicated paybill numbers or delayed vouchers. Enter your Safaricom number and approve the prompt directly on your phone.
            </p>
            <div className="rounded-xl bg-white/10 p-3 text-xs">
              <p className="text-slate-400">Official Payment Receiver Line:</p>
              <p className="font-mono text-base font-bold text-amber-300">{KENYA_PHONE_TARGET}</p>
              <p className="text-[10px] text-slate-400">Elimu Tuition Center Services</p>
            </div>
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                step: '01',
                title: 'Pick Subject',
                desc: 'Select your child’s Grade 4–6, JSS, or Form 1–4 subject and click Subscribe.',
              },
              {
                step: '02',
                title: 'Phone STK Push',
                desc: 'A prompt appears on your phone automatically asking to authorize KES 500 to 0704641901.',
              },
              {
                step: '03',
                title: 'Instant Access',
                desc: 'Receive official Safaricom M-Pesa SMS receipt and immediately access live classrooms.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-3"
              >
                <span className="font-mono text-2xl font-black text-emerald-400">{item.step}</span>
                <h4 className="text-base font-bold text-white">{item.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured TSC Qualified Teachers */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-[#008751] mb-1">
              <ShieldCheck className="h-4 w-4" />
              <span>Vetted & Experienced Faculty</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Learn From Kenya’s Top Secondary & Primary Teachers
            </h2>
          </div>
          <button
            onClick={onOpenTeacherRegister}
            className="text-xs font-bold text-[#008751] hover:underline self-start sm:self-auto cursor-pointer"
          >
            Are you a teacher? Join our faculty →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {teachers.map((teacher) => (
            <div
              key={teacher.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="relative h-44 rounded-xl overflow-hidden bg-slate-100">
                  <img
                    src={teacher.avatarUrl}
                    alt={teacher.fullName}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-2 right-2 rounded-full bg-black/60 backdrop-blur-md px-2 py-0.5 text-[11px] font-bold text-amber-300 flex items-center space-x-1">
                    <Star className="h-3 w-3 fill-amber-300" />
                    <span>{teacher.rating}</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="rounded bg-emerald-100 text-[#008751] px-1.5 py-0.2 text-[10px] font-bold">
                      {teacher.isVerifiedTSC ? 'TSC Verified' : 'Vetted'}
                    </span>
                    <span className="text-[10px] text-slate-400">{teacher.county}</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mt-1">{teacher.fullName}</h4>
                  <p className="text-xs text-slate-500 font-medium">{teacher.qualification}</p>
                </div>

                <div className="flex flex-wrap gap-1">
                  {teacher.subjects.map((s) => (
                    <span key={s} className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                      {s}
                    </span>
                  ))}
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{teacher.bio}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">{teacher.activeStudents} Students</span>
                <span className="text-xs font-bold text-[#008751]">Live Tutoring</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Real-time Progress Visualization & Parental Peace of Mind Feature */}
      <section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-emerald-50/50 via-white to-amber-50/40 p-8 md:p-12 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#008751] text-white">
              Parent & Student Collaboration
            </span>
            <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              Real-Time Progress Tracking For Parents & Candidates
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Never wonder if your child is attending classes or keeping up with homework. Our intuitive dual-view dashboard provides parents with live attendance records, CBC competency mastery charts, weekly mock assessment mark trends, and direct notes from teachers.
            </p>

            <ul className="space-y-2.5 text-xs text-slate-700">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-[#008751]" />
                <span>Weekly automated SMS and WhatsApp progress summaries</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-[#008751]" />
                <span>Instant upload & grading of handwritten exercise books</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-[#008751]" />
                <span>Transparent M-Pesa subscription management with renewal alerts</span>
              </li>
            </ul>

            <div className="pt-2">
              <button
                onClick={onNavigateToParent}
                className="inline-flex items-center space-x-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 text-xs font-bold transition-all cursor-pointer"
              >
                <span>Switch to Live Parent View</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Preview Mockup Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-bold text-xs text-slate-900">Brian Kimani • Form 3 Progress</span>
              <span className="rounded bg-emerald-100 text-[#008751] px-2 py-0.5 text-[10px] font-bold">
                94% Attendance
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Mathematics Form 3 (Quadratic Equations)</span>
                  <span className="font-bold text-[#008751]">91%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-[#008751]" style={{ width: '91%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Chemistry Form 3 (Mole Concept)</span>
                  <span className="font-bold text-emerald-600">84%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: '84%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>English & Literature (The Samaritan)</span>
                  <span className="font-bold text-amber-600">88%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-amber-500" style={{ width: '88%' }} />
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 p-3 text-[11px] text-slate-600 border border-slate-200/60 italic">
              “Brian solved 12 past KCSE problems independently this week. Remarkable progress.” — Mwalimu Mutua
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-500">Everything you need to know about Kenya tuition, CBC, and M-Pesa</p>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'How does the 500 KES weekly subscription work?',
              a: 'Each subject costs a flat fee of KES 500 per week. Payments are made directly through Safaricom M-Pesa to our registered tuition line 0704641901 via Daraja STK Push. Once paid, the student receives unlimited access to that subject’s live classes, homework grading, and mock tests for 7 days.',
            },
            {
              q: 'How are teachers vetted and selected?',
              a: 'All our tutors are verified with valid Teachers Service Commission (TSC) numbers or recognized education degrees from Kenyan universities (e.g., UoN, Kenyatta University, Egerton). They undergo background checks and demo lesson evaluations before teaching.',
            },
            {
              q: 'Can students upload handwritten homework from exercise books?',
              a: 'Yes! We know most Kenyan students do their working on physical lined or squared exercise books. Our assignment portal allows students to snap a clear photo with their phone or webcam and submit it directly to their mwalimu for marking and feedback.',
            },
            {
              q: 'Do you cover both CBC (Junior Secondary) and 8-4-4 (KCSE)?',
              a: 'Yes. We cater to Primary (KPSEA Grade 4–6), Junior Secondary School (Grade 7–9 CBC), and Senior Secondary (Form 1–4 KCSE candidates). Our curriculum materials are aligned with KICD standards.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 bg-white p-4 transition-all"
            >
              <button
                type="button"
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between text-left font-bold text-sm text-slate-900 cursor-pointer"
              >
                <span>{item.q}</span>
                <span className="text-emerald-700 text-lg">{activeFaq === idx ? '−' : '+'}</span>
              </button>
              {activeFaq === idx && (
                <p className="mt-2 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-2">
                  {item.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="rounded-3xl bg-[#008751] text-white p-8 md:p-12 text-center space-y-4 shadow-xl">
        <h3 className="text-2xl md:text-3xl font-extrabold">Ready to Boost Your Grades This Term?</h3>
        <p className="text-xs sm:text-sm text-emerald-100 max-w-xl mx-auto">
          Join thousands of Kenyan students preparing for their national exams with top teachers.
        </p>
        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <button
            onClick={onNavigateToStudent}
            className="rounded-xl bg-white text-emerald-950 font-bold px-6 py-3 text-xs hover:bg-emerald-50 transition-colors shadow-md cursor-pointer"
          >
            Launch Student Learning Portal
          </button>
          <button
            onClick={onOpenTeacherRegister}
            className="rounded-xl border border-white/30 bg-black/20 text-white font-semibold px-6 py-3 text-xs hover:bg-black/30 transition-colors cursor-pointer"
          >
            Teacher Registration (TSC)
          </button>
        </div>
      </section>
    </div>
  );
};
