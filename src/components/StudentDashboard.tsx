import React, { useState } from 'react';
import {
  Video,
  BookOpen,
  FileCheck2,
  Upload,
  Calendar,
  Clock,
  Sparkles,
  Award,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  PlayCircle,
  ExternalLink,
  Plus
} from 'lucide-react';
import { Subject, Assignment, LiveSession, Subscription } from '../types';
import { AssessmentQuiz } from './AssessmentQuiz';
import { KENYA_PHONE_TARGET, WEEKLY_SUBSCRIPTION_FEE_KES } from '../data/mockData';

interface StudentDashboardProps {
  subjects: Subject[];
  assignments: Assignment[];
  liveSessions: LiveSession[];
  subscriptions: Subscription[];
  onOpenUpload: (assignment?: Assignment) => void;
  onJoinLiveClass: (session: LiveSession) => void;
  onOpenMpesa: (subject: Subject) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  subjects,
  assignments,
  liveSessions,
  subscriptions,
  onOpenUpload,
  onJoinLiveClass,
  onOpenMpesa,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'assignments' | 'assessments' | 'library'>('overview');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'submitted' | 'graded'>('all');

  const filteredAssignments = assignments.filter((a) => {
    if (selectedFilter === 'all') return true;
    return a.status === selectedFilter;
  });

  const nextLive = liveSessions.find((s) => s.status === 'live') || liveSessions[0];

  return (
    <div className="space-y-6">
      {/* Student Welcome & Live Session Alert Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-800 via-[#008751] to-teal-900 p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center space-x-2 rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-xs font-semibold text-emerald-100">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>Form 3 KCSE Candidate Portal • Active Term</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Habari, Brian Kimani! Ready for Today's Masterclass?
            </h1>
            <p className="text-xs md:text-sm text-emerald-100/90 leading-relaxed">
              Your next live session is live right now with <strong className="text-white">{nextLive.teacherName}</strong> covering {nextLive.topic}.
            </p>
          </div>

          {/* Quick Class Entry Card */}
          <div className="rounded-2xl bg-black/25 backdrop-blur-md p-4 border border-white/15 flex flex-col justify-between space-y-3 min-w-[260px]">
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-1.5 text-xs font-bold text-red-300">
                <span className="h-2 w-2 rounded-full bg-red-400 animate-ping" />
                <span>NOW HAPPENING</span>
              </span>
              <span className="text-xs text-emerald-200">{nextLive.participantsCount} Students online</span>
            </div>
            <div>
              <p className="text-sm font-bold text-white">{nextLive.subject}</p>
              <p className="text-xs text-emerald-200 line-clamp-1">{nextLive.topic}</p>
            </div>
            <button
              onClick={() => onJoinLiveClass(nextLive)}
              className="w-full flex items-center justify-center space-x-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold py-2.5 text-xs shadow-md transition-all cursor-pointer"
            >
              <PlayCircle className="h-4 w-4" />
              <span>Enter Live Classroom</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-2 md:gap-4 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 px-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'overview'
              ? 'border-[#008751] text-[#008751]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          My Subscribed Subjects ({subscriptions.length})
        </button>
        <button
          onClick={() => setActiveTab('assignments')}
          className={`pb-3 px-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'assignments'
              ? 'border-[#008751] text-[#008751]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Assignments & Homework ({assignments.length})
        </button>
        <button
          onClick={() => setActiveTab('assessments')}
          className={`pb-3 px-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'assessments'
              ? 'border-[#008751] text-[#008751]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          KCPE/KCSE Mock Assessment
        </button>
        <button
          onClick={() => setActiveTab('library')}
          className={`pb-3 px-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'library'
              ? 'border-[#008751] text-[#008751]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Revision Past Papers
        </button>
      </div>

      {/* Tab: Overview (Enrolled Subjects & Live Schedule) */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Subscribed Subjects */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">Weekly Tuition Subscriptions</h3>
                <span className="text-xs text-slate-500">M-Pesa: {KENYA_PHONE_TARGET}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {subjects.slice(0, 4).map((sub) => {
                  const subRecord = subscriptions.find((s) => s.subjectId === sub.id);
                  const isSubscribed = !!subRecord;
                  const isExpiring = subRecord?.status === 'expiring_soon';

                  return (
                    <div
                      key={sub.id}
                      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
                    >
                      <div>
                        <div className="flex items-start justify-between">
                          <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                            {sub.syllabus}
                          </span>
                          {isSubscribed ? (
                            <span
                              className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                                isExpiring
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {isExpiring ? 'Expiring in 1d' : 'Subscribed'}
                            </span>
                          ) : (
                            <span className="text-[11px] font-medium text-slate-400">Not Subscribed</span>
                          )}
                        </div>

                        <h4 className="text-base font-bold text-slate-900 mt-2">{sub.name}</h4>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1">{sub.description}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-slate-400">Weekly Rate</p>
                          <p className="text-xs font-bold text-slate-900">KES {sub.weeklyPriceKES}/wk</p>
                        </div>

                        {isSubscribed ? (
                          <button
                            onClick={() => onOpenMpesa(sub)}
                            className="rounded-xl border border-emerald-600 px-3 py-1.5 text-xs font-bold text-[#008751] hover:bg-emerald-50 cursor-pointer"
                          >
                            Renew M-Pesa
                          </button>
                        ) : (
                          <button
                            onClick={() => onOpenMpesa(sub)}
                            className="rounded-xl bg-[#008751] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#007043] cursor-pointer"
                          >
                            Subscribe (500 KES)
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Upcoming Live Sessions Schedule */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900">Today & Tomorrow's Live Classes</h3>
              <div className="space-y-3">
                {liveSessions.map((session) => (
                  <div
                    key={session.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#008751]">{session.startTime}</span>
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600 font-medium">
                        {session.meetingCode}
                      </span>
                    </div>

                    <div>
                      <h5 className="text-sm font-bold text-slate-900">{session.subject}</h5>
                      <p className="text-xs text-slate-600 mt-0.5">{session.topic}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <div className="flex items-center space-x-2">
                        <img
                          src={session.teacherAvatar}
                          alt={session.teacherName}
                          className="h-6 w-6 rounded-full object-cover"
                        />
                        <span className="text-xs text-slate-600 font-medium">{session.teacherName}</span>
                      </div>

                      <button
                        onClick={() => onJoinLiveClass(session)}
                        className={`rounded-lg px-3 py-1 text-xs font-bold cursor-pointer ${
                          session.status === 'live'
                            ? 'bg-red-600 text-white animate-pulse'
                            : 'bg-slate-900 text-white hover:bg-slate-800'
                        }`}
                      >
                        {session.status === 'live' ? 'Join Now' : 'Join Room'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Assignments & Homework */}
      {activeTab === 'assignments' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Assignments & Homework Vault</h3>
              <p className="text-xs text-slate-500">Upload handwritten or digital exercises for instant tutor grading</p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => onOpenUpload()}
                className="flex items-center space-x-1.5 rounded-xl bg-[#008751] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#007043] cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Upload New Assignment</span>
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-2 text-xs font-semibold">
            {(['all', 'pending', 'submitted', 'graded'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`rounded-lg px-3 py-1.5 capitalize transition-colors ${
                  selectedFilter === filter
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Assignments list */}
          <div className="space-y-3">
            {filteredAssignments.map((assignment) => (
              <div
                key={assignment.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="rounded bg-emerald-50 text-[#008751] px-2 py-0.5 text-xs font-bold">
                      {assignment.subjectName}
                    </span>
                    <span className="text-xs text-slate-400">• Due: {assignment.dueDate}</span>
                  </div>

                  <div>
                    {assignment.status === 'graded' && (
                      <span className="inline-flex items-center space-x-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Graded: {assignment.score} / {assignment.totalMarks} Marks</span>
                      </span>
                    )}
                    {assignment.status === 'submitted' && (
                      <span className="inline-flex items-center space-x-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-800">
                        <Clock className="h-3.5 w-3.5" />
                        <span>Under Tutor Review</span>
                      </span>
                    )}
                    {assignment.status === 'pending' && (
                      <span className="inline-flex items-center space-x-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
                        <AlertCircle className="h-3.5 w-3.5" />
                        <span>Pending Submission</span>
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-base font-bold text-slate-900">{assignment.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{assignment.description}</p>
                </div>

                {assignment.submittedFile && (
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 text-xs border border-slate-200/60">
                    <span className="font-medium text-slate-700">Uploaded: {assignment.submittedFile.name} ({assignment.submittedFile.size})</span>
                    <span className="text-slate-400">{assignment.submittedFile.uploadDate}</span>
                  </div>
                )}

                {assignment.teacherRemarks && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 text-xs text-emerald-950">
                    <p className="font-bold text-emerald-900 mb-0.5">Teacher Feedback:</p>
                    <p>{assignment.teacherRemarks}</p>
                  </div>
                )}

                <div className="pt-1 flex items-center justify-end space-x-2">
                  {assignment.status === 'pending' && (
                    <button
                      onClick={() => onOpenUpload(assignment)}
                      className="flex items-center space-x-1.5 rounded-xl bg-[#008751] px-4 py-2 text-xs font-bold text-white hover:bg-[#007043] cursor-pointer"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      <span>Upload Solutions</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Assessments & Quizzes */}
      {activeTab === 'assessments' && (
        <AssessmentQuiz />
      )}

      {/* Tab: Revision Past Papers */}
      {activeTab === 'library' && (
        <div className="space-y-4">
          <div className="pb-2">
            <h3 className="text-base font-bold text-slate-900">Kenyan National Exam Revision Library</h3>
            <p className="text-xs text-slate-500">Curated KCSE past papers, marking schemes, and KPSEA practice papers</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: '2024 KCSE Mathematics Paper 1 & 2', size: '4.2 MB', pages: '36 Pages', downloads: '1.2k' },
              { title: '2024 KCSE Chemistry Paper 1, 2, 3 (Practical)', size: '3.8 MB', pages: '28 Pages', downloads: '950' },
              { title: '2024 KCSE Biology Paper 1 & 2 with Marking Scheme', size: '5.1 MB', pages: '42 Pages', downloads: '1.4k' },
              { title: '2024 KCSE Kiswahili Karatasi 1, 2, 3 (Fasihi)', size: '3.1 MB', pages: '24 Pages', downloads: '890' },
              { title: '2024 KPSEA Grade 6 Integrated Science & Math', size: '2.5 MB', pages: '18 Pages', downloads: '2.1k' },
              { title: 'KCSE English Paper 2: The Samaritan Excerpt Analysis', size: '1.9 MB', pages: '16 Pages', downloads: '1.8k' },
            ].map((doc, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors"
              >
                <div>
                  <span className="rounded bg-emerald-100 text-[#008751] px-2 py-0.5 text-[10px] font-bold">
                    Official KNEC / Mock
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-2">{doc.title}</h4>
                  <p className="text-xs text-slate-400 mt-1">{doc.pages} • {doc.size}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">{doc.downloads} downloads</span>
                  <button
                    onClick={() => alert(`Downloading ${doc.title}...`)}
                    className="flex items-center space-x-1 text-xs font-bold text-[#008751] hover:underline cursor-pointer"
                  >
                    <span>Download PDF</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
