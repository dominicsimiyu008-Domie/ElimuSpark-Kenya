import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
  BookOpen,
  ShieldCheck,
  Send,
  Plus,
  Filter,
  Search,
  Sparkles,
  ChevronRight,
  Briefcase,
  Trash2,
  Edit3,
  Phone,
  MapPin,
  X,
  AlertCircle
} from 'lucide-react';
import { Teacher, TeacherTask } from '../types';

interface AdminTeacherPoolPortalProps {
  teachers: Teacher[];
  tasks: TeacherTask[];
  onAddTeacher: (teacher: Teacher) => void;
  onAssignTask: (task: TeacherTask) => void;
  onUpdateTaskStatus: (taskId: string, status: TeacherTask['status']) => void;
  onDeleteTeacher: (teacherId: string) => void;
  onUpdateTeacher?: (teacherId: string, updatedData: Partial<Teacher>) => void;
}

export const AdminTeacherPoolPortal: React.FC<AdminTeacherPoolPortalProps> = ({
  teachers,
  tasks,
  onAddTeacher,
  onAssignTask,
  onUpdateTaskStatus,
  onDeleteTeacher,
  onUpdateTeacher,
}) => {
  const [activeTab, setActiveTab] = useState<'pool' | 'assign_task' | 'all_tasks'>('pool');
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'on_leave'>('all');

  // Deletion state
  const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null);
  const [notificationMsg, setNotificationMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Edit Teacher state
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [editFormData, setEditFormData] = useState({
    fullName: '',
    tscNumber: '',
    phone: '',
    county: '',
    qualification: '',
    status: 'active' as Teacher['status'],
    subjects: ''
  });

  // Form states: New Teacher
  const [newTeacherModalOpen, setNewTeacherModalOpen] = useState(false);
  const [teacherForm, setTeacherForm] = useState({
    fullName: '',
    tscNumber: '',
    phone: '0712345678',
    email: '',
    county: 'Nairobi',
    qualification: 'B.Ed (Science)',
    levels: ['secondary'],
    subjects: ['Mathematics'],
    experienceYears: 5,
    bio: '',
  });

  // Form states: Assign Task
  const [taskForm, setTaskForm] = useState({
    title: '',
    taskType: 'marking' as TeacherTask['taskType'],
    subject: 'Mathematics',
    level: 'Form 3 / KCSE',
    teacherId: teachers[0]?.id || '',
    priority: 'high' as TeacherTask['priority'],
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    instructions: '',
    targetStudent: 'Brian Kimani',
  });

  const [taskSuccessBanner, setTaskSuccessBanner] = useState(false);

  // Filter teachers
  const filteredTeachers = teachers.filter((t) => {
    const matchesSearch =
      t.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subjects.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      t.county.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = subjectFilter === 'all' || t.subjects.includes(subjectFilter);
    const matchesStatus = statusFilter === 'all' || (t.status || 'active') === statusFilter;
    return matchesSearch && matchesSubject && matchesStatus;
  });

  const handleCreateTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherForm.fullName) return;

    const newTeacher: Teacher = {
      id: `tch-${Date.now()}`,
      fullName: teacherForm.fullName,
      tscNumber: teacherForm.tscNumber || `TSC/${Math.floor(100000 + Math.random() * 900000)}`,
      phone: teacherForm.phone,
      email: teacherForm.email || `${teacherForm.fullName.toLowerCase().replace(/\s+/g, '.')}@elimupark.co.ke`,
      county: teacherForm.county,
      qualification: teacherForm.qualification,
      teachingLevels: teacherForm.levels as any,
      subjects: teacherForm.subjects,
      experienceYears: teacherForm.experienceYears,
      rating: 5.0,
      reviewsCount: 1,
      hourlyRateKES: 500,
      bio: teacherForm.bio || 'Vetted educator added to ElimuSpark pool by Administrator.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      isVerifiedTSC: true,
      activeStudents: 0,
      status: 'active',
      assignedTasksCount: 0,
    };

    onAddTeacher(newTeacher);
    setNewTeacherModalOpen(false);
    setTeacherForm({
      fullName: '',
      tscNumber: '',
      phone: '0712345678',
      email: '',
      county: 'Nairobi',
      qualification: 'B.Ed (Science)',
      levels: ['secondary'],
      subjects: ['Mathematics'],
      experienceYears: 5,
      bio: '',
    });

    setNotificationMsg({ type: 'success', text: `${newTeacher.fullName} added to the educator pool!` });
    setTimeout(() => setNotificationMsg(null), 3000);
  };

  const confirmDeleteTeacher = () => {
    if (!teacherToDelete) return;
    const name = teacherToDelete.fullName;
    onDeleteTeacher(teacherToDelete.id);
    setTeacherToDelete(null);
    setNotificationMsg({ type: 'success', text: `${name} has been removed from the teacher pool.` });
    setTimeout(() => setNotificationMsg(null), 3500);
  };

  const handleOpenEdit = (t: Teacher) => {
    setEditingTeacher(t);
    setEditFormData({
      fullName: t.fullName,
      tscNumber: t.tscNumber || '',
      phone: t.phone,
      county: t.county,
      qualification: t.qualification,
      status: t.status || 'active',
      subjects: t.subjects.join(', ')
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeacher || !onUpdateTeacher) return;

    onUpdateTeacher(editingTeacher.id, {
      fullName: editFormData.fullName,
      tscNumber: editFormData.tscNumber,
      phone: editFormData.phone,
      county: editFormData.county,
      qualification: editFormData.qualification,
      status: editFormData.status,
      subjects: editFormData.subjects.split(',').map((s) => s.trim()).filter(Boolean)
    });

    setEditingTeacher(null);
    setNotificationMsg({ type: 'success', text: `Profile updated for ${editFormData.fullName}` });
    setTimeout(() => setNotificationMsg(null), 3000);
  };

  const handleAssignTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskForm.title) return;

    const assignedTeacherObj = teachers.find((t) => t.id === taskForm.teacherId) || teachers[0];

    const newTask: TeacherTask = {
      id: `tsk-${Date.now()}`,
      title: taskForm.title,
      taskType: taskForm.taskType,
      subject: taskForm.subject,
      level: taskForm.level,
      teacherId: assignedTeacherObj.id,
      teacherName: assignedTeacherObj.fullName,
      assignedBy: 'Administrator',
      priority: taskForm.priority,
      dueDate: taskForm.dueDate,
      instructions: taskForm.instructions,
      status: 'assigned',
      targetStudent: taskForm.targetStudent,
      createdAt: new Date().toISOString().split('T')[0],
    };

    onAssignTask(newTask);
    setTaskSuccessBanner(true);
    setTimeout(() => setTaskSuccessBanner(false), 3500);

    setTaskForm({
      ...taskForm,
      title: '',
      instructions: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Admin Top Dashboard Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 px-3 py-1 text-xs font-semibold text-indigo-300">
            <Briefcase className="h-3.5 w-3.5" />
            <span>ElimuSpark Administrator Command Center</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-2">
            Teacher Pool & Task Assignment Control
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-xl mt-1">
            Manage your educator roster, edit qualifications, remove teachers from the pool, and dispatch tasks to teacher dashboards.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setNewTeacherModalOpen(true)}
            className="flex items-center space-x-1.5 rounded-xl bg-[#008751] hover:bg-[#007043] px-4 py-3 text-xs font-bold text-white shadow-md transition-all cursor-pointer"
          >
            <UserPlus className="h-4 w-4" />
            <span>Add Teacher to Pool</span>
          </button>
          <button
            onClick={() => setActiveTab('assign_task')}
            className="flex items-center space-x-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 px-4 py-3 text-xs font-extrabold text-slate-950 shadow-md transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Dispatch New Task</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notificationMsg && (
        <div
          className={`rounded-2xl p-4 text-xs font-bold flex items-center justify-between shadow-md animate-in fade-in ${
            notificationMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
              : 'bg-red-50 text-red-900 border border-red-200'
          }`}
        >
          <div className="flex items-center space-x-2">
            {notificationMsg.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-[#008751]" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <span>{notificationMsg.text}</span>
          </div>
          <button onClick={() => setNotificationMsg(null)} className="text-slate-400 hover:text-slate-700">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-4 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('pool')}
          className={`pb-3 px-2 border-b-2 transition-colors cursor-pointer flex items-center space-x-1.5 ${
            activeTab === 'pool'
              ? 'border-indigo-600 text-indigo-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Manage Teacher Pool ({teachers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('assign_task')}
          className={`pb-3 px-2 border-b-2 transition-colors cursor-pointer flex items-center space-x-1.5 ${
            activeTab === 'assign_task'
              ? 'border-indigo-600 text-indigo-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Plus className="h-4 w-4" />
          <span>Assign Task Form</span>
        </button>

        <button
          onClick={() => setActiveTab('all_tasks')}
          className={`pb-3 px-2 border-b-2 transition-colors cursor-pointer flex items-center space-x-1.5 ${
            activeTab === 'all_tasks'
              ? 'border-indigo-600 text-indigo-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <CheckCircle2 className="h-4 w-4" />
          <span>Active Dispatched Tasks ({tasks.length})</span>
        </button>
      </div>

      {/* Tab: Teacher Pool View with Manage & Delete actions */}
      {activeTab === 'pool' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Manage Educator Pool</h3>
              <p className="text-xs text-slate-500">Edit qualifications, assign work, or remove teachers from the active roster</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search name, county..."
                  className="rounded-xl border border-slate-300 py-1.5 pl-8 pr-3 text-xs outline-none focus:border-indigo-500"
                />
              </div>

              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="rounded-xl border border-slate-300 py-1.5 px-3 text-xs bg-white outline-none"
              >
                <option value="all">All Subjects</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Physics">Physics</option>
                <option value="Biology">Biology</option>
                <option value="English & Literature">English</option>
                <option value="Kiswahili (Lugha & Fasihi)">Kiswahili</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="rounded-xl border border-slate-300 py-1.5 px-3 text-xs bg-white outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active Only</option>
                <option value="on_leave">On Leave</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTeachers.map((t) => {
              const teacherAssignedTasks = tasks.filter((tk) => tk.teacherId === t.id);
              const isOnLeave = t.status === 'on_leave';

              return (
                <div
                  key={t.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3 flex flex-col justify-between hover:border-indigo-300 hover:shadow-md transition-all group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={t.avatarUrl}
                          alt={t.fullName}
                          className="h-12 w-12 rounded-xl object-cover border border-slate-200"
                        />
                        <div>
                          <h4 className="font-bold text-sm text-slate-900">{t.fullName}</h4>
                          <span className="font-mono text-[11px] text-emerald-700 font-semibold">{t.tscNumber || 'TSC Verified'}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            isOnLeave ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {t.status || 'Active'}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-600 space-y-1">
                      <p><strong className="text-slate-800">Phone:</strong> {t.phone}</p>
                      <p><strong className="text-slate-800">County:</strong> {t.county}</p>
                      <p><strong className="text-slate-800">Degree:</strong> {t.qualification}</p>
                      <p><strong className="text-slate-800">Experience:</strong> {t.experienceYears} Years</p>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {t.subjects.map((s) => (
                        <span key={s} className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <p className="text-[10px] text-slate-400">Tasks in Queue</p>
                        <p className="font-bold text-slate-800">{teacherAssignedTasks.length} Active</p>
                      </div>

                      <button
                        onClick={() => {
                          setTaskForm({ ...taskForm, teacherId: t.id, subject: t.subjects[0] || 'Mathematics' });
                          setActiveTab('assign_task');
                        }}
                        className="rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-3 py-1.5 text-xs transition-colors cursor-pointer"
                      >
                        Assign Task →
                      </button>
                    </div>

                    {/* Admin Management Buttons: Edit & Delete */}
                    <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-50">
                      <button
                        onClick={() => handleOpenEdit(t)}
                        className="flex items-center space-x-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer"
                        title="Edit teacher details and status"
                      >
                        <Edit3 className="h-3.5 w-3.5 text-slate-500" />
                        <span>Manage / Edit</span>
                      </button>

                      <button
                        onClick={() => setTeacherToDelete(t)}
                        className="flex items-center space-x-1 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer"
                        title="Delete teacher from pool"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-red-600" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Assign Task Form */}
      {activeTab === 'assign_task' && (
        <div className="max-w-2xl mx-auto rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-5">
          <div>
            <div className="inline-flex items-center space-x-1 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
              <Plus className="h-3.5 w-3.5" />
              <span>Admin Task Dispatcher</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Assign Work to Teacher's Dashboard</h3>
            <p className="text-xs text-slate-500">The assigned teacher will see this immediately in their dashboard task queue.</p>
          </div>

          {taskSuccessBanner && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-800 flex items-center space-x-2 animate-in fade-in">
              <CheckCircle2 className="h-5 w-5 text-[#008751]" />
              <span>Task successfully dispatched and assigned to teacher's dashboard!</span>
            </div>
          )}

          <form onSubmit={handleAssignTaskSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Task Title *
              </label>
              <input
                type="text"
                required
                value={taskForm.title}
                onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                placeholder="e.g. Mark 12 Form 3 Mathematics Quadratic Equations Papers"
                className="w-full rounded-xl border border-slate-300 py-2.5 px-3 text-sm focus:border-indigo-600 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Assign To Teacher (From Pool) *
                </label>
                <select
                  value={taskForm.teacherId}
                  onChange={(e) => setTaskForm({ ...taskForm, teacherId: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 py-2.5 px-3 text-sm focus:border-indigo-600 outline-none bg-white font-semibold"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.fullName} ({t.subjects.join(', ')})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Task Category
                </label>
                <select
                  value={taskForm.taskType}
                  onChange={(e) => setTaskForm({ ...taskForm, taskType: e.target.value as any })}
                  className="w-full rounded-xl border border-slate-300 py-2.5 px-3 text-sm focus:border-indigo-600 outline-none bg-white"
                >
                  <option value="marking">📝 Homework Marking & Feedback</option>
                  <option value="live_session">📹 Live Video Masterclass Session</option>
                  <option value="curriculum_prep">📚 KCSE/KPSEA Exam Prep Setting</option>
                  <option value="remedial">🎯 1-on-1 Remedial Student Tutoring</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={taskForm.subject}
                  onChange={(e) => setTaskForm({ ...taskForm, subject: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Priority
                </label>
                <select
                  value={taskForm.priority}
                  onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value as any })}
                  className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs outline-none bg-white font-bold"
                >
                  <option value="urgent">🔴 Urgent</option>
                  <option value="high">🟡 High</option>
                  <option value="normal">🟢 Normal</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={taskForm.dueDate}
                  onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Admin Instructions for Mwalimu
              </label>
              <textarea
                rows={3}
                value={taskForm.instructions}
                onChange={(e) => setTaskForm({ ...taskForm, instructions: e.target.value })}
                placeholder="Specify marking schemes, focal concepts to emphasize, or specific student difficulties..."
                className="w-full rounded-xl border border-slate-300 p-3 text-xs outline-none focus:border-indigo-600"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 py-3 text-xs font-bold text-white shadow-md transition-all cursor-pointer"
            >
              <Send className="h-4 w-4" />
              <span>Dispatch Task to Teacher's Dashboard</span>
            </button>
          </form>
        </div>
      )}

      {/* Tab: All Dispatched Tasks Table */}
      {activeTab === 'all_tasks' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Task Management Ledger</h3>
              <p className="text-xs text-slate-500">Track task progression across the teacher pool</p>
            </div>
            <span className="text-xs font-semibold text-slate-600">{tasks.length} Total Dispatched</span>
          </div>

          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-xs space-y-3 hover:bg-white transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                        task.priority === 'urgent'
                          ? 'bg-red-100 text-red-800'
                          : task.priority === 'high'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {task.priority}
                    </span>
                    <span className="font-bold text-slate-900 text-sm">{task.title}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                        task.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : task.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {task.status === 'completed' ? '✓ Completed' : task.status === 'in_progress' ? 'In Progress' : 'Assigned'}
                    </span>
                  </div>
                </div>

                <p className="text-slate-600">{task.instructions}</p>

                <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-200/60 text-slate-500 gap-2">
                  <span>Assigned to: <strong className="text-slate-800 font-semibold">{task.teacherName}</strong></span>
                  <span>Due: <strong className="text-slate-800">{task.dueDate}</strong></span>
                  <div className="flex items-center space-x-1.5">
                    {task.status !== 'completed' && (
                      <button
                        onClick={() => onUpdateTaskStatus(task.id, 'completed')}
                        className="rounded bg-emerald-600 text-white font-bold px-2 py-1 text-[11px] hover:bg-emerald-700 cursor-pointer"
                      >
                        Mark Completed
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirmation Modal: Delete Teacher */}
      {teacherToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl p-6 space-y-4">
            <div className="flex items-center space-x-3 text-red-600">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100">
                <Trash2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">Delete Teacher from Pool?</h3>
                <p className="text-xs text-slate-500">Action cannot be undone</p>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center space-x-3">
                <img src={teacherToDelete.avatarUrl} alt="" className="h-10 w-10 rounded-xl object-cover" />
                <div>
                  <p className="font-bold text-slate-900">{teacherToDelete.fullName}</p>
                  <p className="text-slate-500">{teacherToDelete.qualification} • {teacherToDelete.county}</p>
                </div>
              </div>
              <p className="text-slate-600 pt-2 border-t border-slate-200/70">
                Are you sure you want to remove <strong className="text-slate-900">{teacherToDelete.fullName}</strong> from the ElimuSpark educator pool? Their profile will be deleted from Cloud Firestore.
              </p>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setTeacherToDelete(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteTeacher}
                className="rounded-xl bg-red-600 hover:bg-red-700 px-5 py-2 text-xs font-bold text-white shadow-md shadow-red-600/20 cursor-pointer"
              >
                Yes, Delete Teacher
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Edit / Manage Teacher */}
      {editingTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl p-6 sm:p-8 space-y-4 my-8">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-lg text-slate-900">Manage Teacher Profile</h3>
                <p className="text-xs text-slate-500">Update qualifications, subjects, or active status</p>
              </div>
              <button onClick={() => setEditingTeacher(null)} className="text-slate-400 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Mwalimu Full Name *</label>
                <input
                  type="text"
                  required
                  value={editFormData.fullName}
                  onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs focus:border-indigo-600 outline-none font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">TSC Number</label>
                  <input
                    type="text"
                    value={editFormData.tscNumber}
                    onChange={(e) => setEditFormData({ ...editFormData, tscNumber: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">County</label>
                  <input
                    type="text"
                    value={editFormData.county}
                    onChange={(e) => setEditFormData({ ...editFormData, county: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Status</label>
                  <select
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value as any })}
                    className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs outline-none bg-white font-bold"
                  >
                    <option value="active">Active (Available for classes)</option>
                    <option value="on_leave">On Leave</option>
                    <option value="vetted">Vetted</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Teaching Subjects</label>
                <input
                  type="text"
                  value={editFormData.subjects}
                  onChange={(e) => setEditFormData({ ...editFormData, subjects: e.target.value })}
                  placeholder="Mathematics, Chemistry, Physics"
                  className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Highest Qualification</label>
                <input
                  type="text"
                  value={editFormData.qualification}
                  onChange={(e) => setEditFormData({ ...editFormData, qualification: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingTeacher(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#008751] px-5 py-2 text-xs font-bold text-white hover:bg-[#007043]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Teacher To Pool */}
      {newTeacherModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl p-6 sm:p-8 space-y-4 my-8">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-900">Add Teacher to Pool</h3>
              <button onClick={() => setNewTeacherModalOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleCreateTeacher} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Mwalimu Full Name *</label>
                <input
                  type="text"
                  required
                  value={teacherForm.fullName}
                  onChange={(e) => setTeacherForm({ ...teacherForm, fullName: e.target.value })}
                  placeholder="e.g. Tr. Brian Otieno"
                  className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs focus:border-indigo-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">TSC Number</label>
                  <input
                    type="text"
                    value={teacherForm.tscNumber}
                    onChange={(e) => setTeacherForm({ ...teacherForm, tscNumber: e.target.value })}
                    placeholder="TSC/694820"
                    className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">County</label>
                  <input
                    type="text"
                    value={teacherForm.county}
                    onChange={(e) => setTeacherForm({ ...teacherForm, county: e.target.value })}
                    placeholder="Nairobi"
                    className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Teaching Subjects (Comma Separated)</label>
                <input
                  type="text"
                  value={teacherForm.subjects.join(', ')}
                  onChange={(e) => setTeacherForm({ ...teacherForm, subjects: e.target.value.split(',').map((s) => s.trim()) })}
                  placeholder="Mathematics, Physics"
                  className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Qualification</label>
                <input
                  type="text"
                  value={teacherForm.qualification}
                  onChange={(e) => setTeacherForm({ ...teacherForm, qualification: e.target.value })}
                  placeholder="B.Ed (Science) - Kenyatta University"
                  className="w-full rounded-xl border border-slate-300 py-2 px-3 text-xs outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setNewTeacherModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#008751] px-5 py-2 text-xs font-bold text-white hover:bg-[#007043]"
                >
                  Add to Teacher Pool
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
