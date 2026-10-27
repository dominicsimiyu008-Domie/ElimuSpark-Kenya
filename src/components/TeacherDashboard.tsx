import React, { useState } from 'react';
import {
  Users,
  Calendar,
  Clock,
  PlayCircle,
  FileCheck2,
  DollarSign,
  Award,
  CheckCircle2,
  AlertCircle,
  Search,
  MessageSquare,
  Sparkles,
  Briefcase,
  ArrowRight
} from 'lucide-react';
import { Teacher, LiveSession, Assignment, TeacherTask } from '../types';

interface TeacherDashboardProps {
  teacher: Teacher;
  liveSessions: LiveSession[];
  assignments: Assignment[];
  tasks?: TeacherTask[];
  onStartLiveClass: (session: LiveSession) => void;
  onGradeAssignment: (assignmentId: string, score: number, remarks: string) => void;
  onUpdateTaskStatus?: (taskId: string, status: TeacherTask['status']) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  teacher,
  liveSessions,
  assignments,
  tasks = [],
  onStartLiveClass,
  onGradeAssignment,
  onUpdateTaskStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'schedule' | 'marking' | 'earnings'>('tasks');
  const [gradingAssignment, setGradingAssignment] = useState<Assignment | null>(null);
  const [gradeScore, setGradeScore] = useState<number>(28);
  const [gradeRemarks, setGradeRemarks] = useState('');

  // Filter tasks for this teacher or show active assigned tasks
  const myTasks = tasks.filter((t) => !t.teacherId || t.teacherId === teacher.id || t.teacherName === teacher.fullName);
  const pendingTasksCount = myTasks.filter((t) => t.status !== 'completed').length;
  const pendingMarking = assignments.filter((a) => a.status === 'submitted');

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingAssignment) return;
    onGradeAssignment(gradingAssignment.id, gradeScore, gradeRemarks || 'Good work. Keep practicing with previous exam questions.');
    setGradingAssignment(null);
    setGradeRemarks('');
  };

  return (
    <div className="space-y-6">
      {/* Teacher Profile Header */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <img
              src={teacher.avatarUrl}
              alt={teacher.fullName}
              className="h-16 w-16 md:h-20 md:w-20 rounded-2xl object-cover border-2 border-emerald-400 shadow-lg"
            />
            <div>
              <div className="flex items-center space-x-2">
                <span className="rounded bg-[#008751] px-2 py-0.5 text-xs font-bold text-white">
                  TSC Verified
                </span>
                <span className="font-mono text-xs text-emerald-300">{teacher.tscNumber}</span>
              </div>
              <h1 className="text-2xl font-bold mt-1">{teacher.fullName}</h1>
              <p className="text-xs text-slate-300">
                {teacher.qualification} • {teacher.county} • {teacher.experienceYears} Years Exp
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center space-x-3">
            <div className="rounded-2xl bg-white/10 backdrop-blur-md p-4 text-center min-w-[100px]">
              <p className="text-xs text-emerald-200">Admin Tasks</p>
              <p className="text-2xl font-extrabold text-amber-300">{pendingTasksCount}</p>
            </div>
            <div className="rounded-2xl bg-white/10 backdrop-blur-md p-4 text-center min-w-[100px]">
              <p className="text-xs text-emerald-200">Active Students</p>
              <p className="text-2xl font-extrabold text-white">{teacher.activeStudents || 38}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-3 md:gap-5 text-sm font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('tasks')}
          className={`pb-3 px-2 border-b-2 transition-colors cursor-pointer flex items-center space-x-1.5 whitespace-nowrap ${
            activeTab === 'tasks'
              ? 'border-indigo-600 text-indigo-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Briefcase className="h-4 w-4" />
          <span>Assigned Tasks From Admin</span>
          {pendingTasksCount > 0 && (
            <span className="rounded-full bg-indigo-600 text-white px-2 py-0.2 text-[10px] font-extrabold">
              {pendingTasksCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('schedule')}
          className={`pb-3 px-2 border-b-2 transition-colors cursor-pointer flex items-center space-x-1 whitespace-nowrap ${
            activeTab === 'schedule'
              ? 'border-[#008751] text-[#008751] font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="h-4 w-4" />
          <span>My Live Classes ({liveSessions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('marking')}
          className={`pb-3 px-2 border-b-2 transition-colors cursor-pointer flex items-center space-x-1.5 whitespace-nowrap ${
            activeTab === 'marking'
              ? 'border-[#008751] text-[#008751] font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileCheck2 className="h-4 w-4" />
          <span>Marking Queue</span>
          {pendingMarking.length > 0 && (
            <span className="rounded-full bg-amber-500 text-slate-950 px-1.5 py-0.2 text-[10px] font-extrabold">
              {pendingMarking.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('earnings')}
          className={`pb-3 px-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'earnings'
              ? 'border-[#008751] text-[#008751] font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Earnings & M-Pesa Payouts
        </button>
      </div>

      {/* Tab: Admin Assigned Tasks */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-100 gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900">Tasks Delegated by Administration</h3>
              <p className="text-xs text-slate-500">Homework marking, exam formulation, and remedial sessions assigned to your roster</p>
            </div>
            <span className="rounded bg-indigo-50 text-indigo-700 font-bold px-3 py-1 text-xs">
              {myTasks.length} Tasks Assigned
            </span>
          </div>

          {myTasks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-500">
              <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500 mb-2" />
              <p className="font-semibold text-slate-800">No pending admin tasks right now.</p>
              <p className="text-xs text-slate-400 mt-1">When an admin dispatches a task to you, it will appear here instantly.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myTasks.map((task) => (
                <div
                  key={task.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3 transition-all hover:border-indigo-300"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`rounded px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          task.priority === 'urgent'
                            ? 'bg-red-100 text-red-800'
                            : task.priority === 'high'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {task.priority} Priority
                      </span>
                      <span className="font-bold text-slate-900 text-base">{task.title}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          task.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : task.status === 'in_progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {task.status === 'completed' ? '✓ Completed' : task.status === 'in_progress' ? 'In Progress' : 'Pending Action'}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                    <strong className="text-slate-900">Admin Instructions:</strong> {task.instructions}
                  </p>

                  <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500 gap-2">
                    <div className="flex items-center space-x-3">
                      <span>Subject: <strong className="text-slate-800">{task.subject}</strong></span>
                      <span>Due: <strong className="text-slate-800">{task.dueDate}</strong></span>
                      {task.targetStudent && (
                        <span>Student: <strong className="text-emerald-700">{task.targetStudent}</strong></span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      {task.status === 'assigned' && onUpdateTaskStatus && (
                        <button
                          onClick={() => onUpdateTaskStatus(task.id, 'in_progress')}
                          className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 text-xs transition-colors cursor-pointer"
                        >
                          Accept & Start Task
                        </button>
                      )}

                      {task.status !== 'completed' && onUpdateTaskStatus && (
                        <button
                          onClick={() => onUpdateTaskStatus(task.id, 'completed')}
                          className="rounded-xl bg-[#008751] hover:bg-[#007043] text-white font-bold px-3 py-1.5 text-xs transition-colors cursor-pointer"
                        >
                          Mark Completed
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Schedule */}
      {activeTab === 'schedule' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Today's Class Schedule</h3>
            <span className="text-xs text-slate-500">Video sessions are streamed in HD with blackboard</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {liveSessions.map((session) => (
              <div
                key={session.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-[#008751]">
                      {session.startTime} - {session.endTime}
                    </span>
                    <span className="font-mono text-xs text-slate-400">{session.meetingCode}</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900">{session.subject}</h4>
                  <p className="text-xs text-slate-600">{session.topic}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">{session.participantsCount} students registered</span>
                  <button
                    onClick={() => onStartLiveClass(session)}
                    className="flex items-center space-x-1.5 rounded-xl bg-[#008751] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#007043] cursor-pointer"
                  >
                    <PlayCircle className="h-4 w-4" />
                    <span>Launch Live Classroom</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Marking Queue */}
      {activeTab === 'marking' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Student Submissions for Review</h3>
              <p className="text-xs text-slate-500">Grade handwritten solution sets and provide exam feedback</p>
            </div>
            <span className="rounded bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
              {pendingMarking.length} Pending
            </span>
          </div>

          {pendingMarking.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-500">
              <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500 mb-2" />
              <p className="font-semibold text-slate-800">All student submissions are marked!</p>
              <p className="text-xs text-slate-400 mt-1">New homework submissions will appear here automatically.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingMarking.map((asg) => (
                <div
                  key={asg.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-700">{asg.subjectName}</span>
                    <span className="text-slate-400">Total Marks: {asg.totalMarks}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{asg.title}</h4>
                    <p className="text-xs text-slate-600 mt-0.5">{asg.description}</p>
                  </div>
                  {asg.submittedFile && (
                    <div className="rounded-xl bg-slate-50 p-2 text-xs text-slate-700 flex items-center justify-between border border-slate-200/70">
                      <span>Attached: <strong className="font-semibold">{asg.submittedFile.name}</strong></span>
                      <span className="text-slate-400">{asg.submittedFile.size}</span>
                    </div>
                  )}
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => {
                        setGradingAssignment(asg);
                        setGradeScore(Math.floor(asg.totalMarks * 0.85));
                      }}
                      className="rounded-xl bg-[#008751] px-4 py-2 text-xs font-bold text-white hover:bg-[#007043] cursor-pointer"
                    >
                      Grade & Give Feedback
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Modal to grade assignment */}
          {gradingAssignment && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
              <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h4 className="font-bold text-slate-900">Mark Submission</h4>
                  <button onClick={() => setGradingAssignment(null)} className="text-slate-400 hover:text-slate-700">
                    ✕
                  </button>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Student: Brian Kimani</p>
                  <p className="text-sm font-bold text-slate-900">{gradingAssignment.title}</p>
                </div>

                <form onSubmit={handleSaveGrade} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                      Awarded Score (Out of {gradingAssignment.totalMarks})
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={gradingAssignment.totalMarks}
                      value={gradeScore}
                      onChange={(e) => setGradeScore(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-300 py-2 px-3 text-sm font-bold text-slate-900 focus:border-[#008751] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                      Mwalimu's Remarks & Recommendations
                    </label>
                    <textarea
                      rows={3}
                      value={gradeRemarks}
                      onChange={(e) => setGradeRemarks(e.target.value)}
                      placeholder="e.g. Excellent grasp of formula. Pay closer attention to units in step 3."
                      className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-[#008751] outline-none"
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setGradingAssignment(null)}
                      className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-xl bg-[#008751] px-5 py-2 text-xs font-bold text-white hover:bg-[#007043]"
                    >
                      Publish Grade
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab: Earnings */}
      {activeTab === 'earnings' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase text-slate-500">Available Balance</p>
              <p className="text-2xl font-extrabold text-[#008751] mt-1">KES 18,500.00</p>
              <p className="text-xs text-slate-500 mt-1">37 Active Weekly Subscriptions</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase text-slate-500">This Month's Earnings</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">KES 74,000.00</p>
              <p className="text-xs text-emerald-600 mt-1">+14% vs last month</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase text-slate-500">M-Pesa Payout Number</p>
              <p className="text-lg font-mono font-bold text-slate-900 mt-1">0712 345 678</p>
              <p className="text-xs text-slate-500 mt-1">Instant B2C Payout Enabled</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h4 className="text-base font-bold text-slate-900">Recent Payout Ledger</h4>
              <button
                onClick={() => alert('Withdrawal request of KES 18,500 submitted to M-Pesa B2C payout gateway!')}
                className="rounded-xl bg-[#008751] px-4 py-2 text-xs font-bold text-white hover:bg-[#007043] cursor-pointer"
              >
                Withdraw KES 18,500 to M-Pesa
              </button>
            </div>

            <div className="mt-4 space-y-2 text-xs">
              {[
                { date: '2026-10-25', amount: 'KES 14,000.00', ref: 'QK91048291', status: 'PAID' },
                { date: '2026-10-18', amount: 'KES 16,500.00', ref: 'QJ84920194', status: 'PAID' },
                { date: '2026-10-11', amount: 'KES 12,000.00', ref: 'QI71930284', status: 'PAID' },
              ].map((tx, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-slate-500">{tx.ref}</span>
                    <span className="text-slate-700">{tx.date}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-slate-900">{tx.amount}</span>
                    <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
