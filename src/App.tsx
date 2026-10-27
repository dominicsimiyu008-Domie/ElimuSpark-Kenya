import React, { useState, useEffect } from 'react';
import { Navbar, AppView } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { StudentDashboard } from './components/StudentDashboard';
import { StudentPhoneAuthPage } from './components/StudentPhoneAuthPage';
import { AdminTeacherPoolPortal } from './components/AdminTeacherPoolPortal';
import { ParentDashboard } from './components/ParentDashboard';
import { TeacherDashboard } from './components/TeacherDashboard';
import { LiveClassroom } from './components/LiveClassroom';
import { MpesaModal } from './components/MpesaModal';
import { AssignmentUploadModal } from './components/AssignmentUploadModal';
import { TeacherRegistrationModal } from './components/TeacherRegistrationModal';
import { AuthModal } from './components/AuthModal';
import { AuthProvider, useAuth } from './context/AuthContext';
import {
  SUBJECTS,
  TEACHERS,
  INITIAL_ASSIGNMENTS,
  INITIAL_LIVE_SESSIONS,
  INITIAL_STUDENT_PROGRESS,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_TASKS,
  KENYA_PHONE_TARGET,
  WEEKLY_SUBSCRIPTION_FEE_KES
} from './data/mockData';
import { Subject, Teacher, Assignment, LiveSession, StudentProgress, Subscription, TeacherTask } from './types';
import { db, collection, onSnapshot, setDoc, doc, addDoc, updateDoc, deleteDoc } from './services/firebase';
import { ShieldCheck, Smartphone, LogIn, UserCheck, Briefcase } from 'lucide-react';

function MainApp() {
  const { currentUser, userProfile } = useAuth();
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [subjects] = useState<Subject[]>(SUBJECTS);
  const [teachers, setTeachers] = useState<Teacher[]>(TEACHERS);
  const [tasks, setTasks] = useState<TeacherTask[]>(INITIAL_TASKS);
  const [assignments, setAssignments] = useState<Assignment[]>(INITIAL_ASSIGNMENTS);
  const [liveSessions] = useState<LiveSession[]>(INITIAL_LIVE_SESSIONS);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(INITIAL_SUBSCRIPTIONS);

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [mpesaModalOpen, setMpesaModalOpen] = useState(false);
  const [selectedSubjectForMpesa, setSelectedSubjectForMpesa] = useState<Subject | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadTargetAssignment, setUploadTargetAssignment] = useState<Assignment | null>(null);
  const [teacherRegisterModalOpen, setTeacherRegisterModalOpen] = useState(false);

  // Active Live Classroom Session
  const [activeSession, setActiveSession] = useState<LiveSession>(INITIAL_LIVE_SESSIONS[0]);

  // Synchronize Firestore Collections in real-time
  useEffect(() => {
    try {
      // 1. Listen to tasks collection
      const unsubTasks = onSnapshot(
        collection(db, 'tasks'),
        (snapshot) => {
          if (!snapshot.empty) {
            const list: TeacherTask[] = [];
            snapshot.forEach((d) => {
              const data = d.data();
              list.push({
                id: d.id,
                title: data.title || '',
                taskType: data.taskType || 'marking',
                subject: data.subject || 'Mathematics',
                level: data.level || 'Form 3 / KCSE',
                teacherId: data.teacherId || '',
                teacherName: data.teacherName || 'Mwalimu',
                assignedBy: data.assignedBy || 'Admin',
                priority: data.priority || 'normal',
                dueDate: data.dueDate || '',
                instructions: data.instructions || '',
                status: data.status || 'assigned',
                targetStudent: data.targetStudent,
                createdAt: data.createdAt || '2026-10-27',
              });
            });
            setTasks(list);
          }
        },
        (err) => console.warn('Firestore tasks listener notice:', err.message)
      );

      // 2. Listen to teachers collection
      const unsubTeachers = onSnapshot(
        collection(db, 'teachers'),
        (snapshot) => {
          if (!snapshot.empty) {
            const list: Teacher[] = [];
            snapshot.forEach((d) => {
              const data = d.data();
              list.push({
                id: d.id,
                fullName: data.fullName,
                tscNumber: data.tscNumber,
                phone: data.phone,
                email: data.email,
                county: data.county,
                qualification: data.qualification,
                teachingLevels: data.teachingLevels || ['secondary'],
                subjects: data.subjects || ['Mathematics'],
                experienceYears: data.experienceYears || 5,
                rating: data.rating || 4.9,
                reviewsCount: data.reviewsCount || 1,
                hourlyRateKES: data.hourlyRateKES || 500,
                bio: data.bio || '',
                avatarUrl: data.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
                isVerifiedTSC: data.isVerifiedTSC ?? true,
                activeStudents: data.activeStudents || 0,
                status: data.status || 'active',
              });
            });
            setTeachers(list);
          }
        },
        (err) => console.warn('Firestore teachers listener notice:', err.message)
      );

      // 3. Listen to assignments
      const unsubAssignments = onSnapshot(
        collection(db, 'assignments'),
        (snapshot) => {
          if (!snapshot.empty) {
            const list: Assignment[] = [];
            snapshot.forEach((d) => {
              const data = d.data();
              list.push({
                id: d.id,
                subjectId: data.subjectId || 'math-sec',
                subjectName: data.subjectName || 'Mathematics',
                title: data.title || '',
                description: data.description || '',
                dueDate: data.dueDate || '',
                totalMarks: data.totalMarks || 30,
                level: data.level || 'Form 3',
                status: data.status || 'pending',
                score: data.score,
                teacherRemarks: data.teacherRemarks,
                gradedDate: data.gradedDate,
                submittedFile: data.fileName ? {
                  name: data.fileName,
                  size: data.fileSize || '2.0 MB',
                  uploadDate: data.createdAt || 'Today',
                } : undefined
              });
            });
            setAssignments(list);
          }
        },
        (err) => console.warn('Firestore assignments listener:', err.message)
      );

      // 4. Listen to subscriptions
      const unsubSubs = onSnapshot(
        collection(db, 'subscriptions'),
        (snapshot) => {
          if (!snapshot.empty) {
            const list: Subscription[] = [];
            snapshot.forEach((d) => {
              const data = d.data();
              list.push({
                subjectId: data.subjectId,
                subjectName: data.subjectName,
                status: data.status,
                subscribedOn: data.subscribedOn,
                expiresOn: data.expiresOn,
                amountKES: data.amountKES,
                mpesaReceipt: data.mpesaReceipt,
              });
            });
            setSubscriptions(list);
          }
        },
        (err) => console.warn('Firestore subscriptions listener:', err.message)
      );

      return () => {
        unsubTasks();
        unsubTeachers();
        unsubAssignments();
        unsubSubs();
      };
    } catch (e) {
      console.warn('Firestore initialization notice:', e);
    }
  }, []);

  // Admin assigns task
  const handleAssignTask = async (newTask: TeacherTask) => {
    setTasks((prev) => [newTask, ...prev]);

    // Save to Firestore /tasks
    try {
      await addDoc(collection(db, 'tasks'), {
        title: newTask.title,
        taskType: newTask.taskType,
        subject: newTask.subject,
        level: newTask.level,
        teacherId: newTask.teacherId,
        teacherName: newTask.teacherName,
        assignedBy: 'Administrator',
        priority: newTask.priority,
        dueDate: newTask.dueDate,
        instructions: newTask.instructions,
        status: 'assigned',
        targetStudent: newTask.targetStudent || '',
        createdAt: new Date().toISOString().split('T')[0],
      });
    } catch (e) {
      console.error('Failed to sync task to Firestore:', e);
    }
  };

  // Update Task Status
  const handleUpdateTaskStatus = async (taskId: string, newStatus: TeacherTask['status']) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      await updateDoc(doc(db, 'tasks', taskId), {
        status: newStatus,
        completedAt: newStatus === 'completed' ? new Date().toISOString().split('T')[0] : null,
      });
    } catch (e) {
      console.warn('Firestore task update note:', e);
    }
  };

  // Admin adds teacher to pool
  const handleAddTeacherToPool = async (newTeacher: Teacher) => {
    setTeachers((prev) => [newTeacher, ...prev]);

    try {
      await setDoc(doc(db, 'teachers', newTeacher.id), {
        userId: newTeacher.id,
        fullName: newTeacher.fullName,
        tscNumber: newTeacher.tscNumber || '',
        phone: newTeacher.phone,
        email: newTeacher.email,
        county: newTeacher.county,
        qualification: newTeacher.qualification,
        teachingLevels: newTeacher.teachingLevels,
        subjects: newTeacher.subjects,
        experienceYears: newTeacher.experienceYears,
        rating: 5.0,
        reviewsCount: 1,
        hourlyRateKES: 500,
        bio: newTeacher.bio,
        avatarUrl: newTeacher.avatarUrl,
        isVerifiedTSC: newTeacher.isVerifiedTSC,
        status: newTeacher.status || 'active',
        activeStudents: 0,
        createdAt: new Date().toISOString(),
      });
    } catch (e) {
      console.error('Failed to persist teacher in Firestore:', e);
    }
  };

  // Admin deletes teacher from pool
  const handleDeleteTeacher = async (teacherId: string) => {
    setTeachers((prev) => prev.filter((t) => t.id !== teacherId));

    try {
      await deleteDoc(doc(db, 'teachers', teacherId));
    } catch (e) {
      console.warn('Firestore delete doc notice:', e);
    }
  };

  // Admin updates teacher in pool
  const handleUpdateTeacher = async (teacherId: string, updatedData: Partial<Teacher>) => {
    setTeachers((prev) =>
      prev.map((t) => (t.id === teacherId ? { ...t, ...updatedData } : t))
    );

    try {
      await updateDoc(doc(db, 'teachers', teacherId), updatedData);
    } catch (e) {
      console.warn('Firestore update doc notice:', e);
    }
  };

  const handleOpenMpesa = (subject: Subject) => {
    setSelectedSubjectForMpesa(subject);
    setMpesaModalOpen(true);
  };

  const handleMpesaSuccess = async (receipt: string) => {
    if (selectedSubjectForMpesa) {
      const newSub: Subscription = {
        subjectId: selectedSubjectForMpesa.id,
        subjectName: selectedSubjectForMpesa.name,
        amountKES: WEEKLY_SUBSCRIPTION_FEE_KES,
        mpesaReceipt: receipt,
        status: 'active',
        subscribedOn: new Date().toISOString().split('T')[0],
        expiresOn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      };

      setSubscriptions((prev) => [newSub, ...prev.filter((s) => s.subjectId !== selectedSubjectForMpesa.id)]);

      try {
        await addDoc(collection(db, 'subscriptions'), {
          userId: currentUser?.uid || 'guest-learner',
          subjectId: selectedSubjectForMpesa.id,
          subjectName: selectedSubjectForMpesa.name,
          amountKES: WEEKLY_SUBSCRIPTION_FEE_KES,
          mpesaReceipt: receipt,
          status: 'active',
          subscribedOn: newSub.subscribedOn,
          expiresOn: newSub.expiresOn,
          phoneNumber: KENYA_PHONE_TARGET,
          createdAt: new Date().toISOString(),
        });
      } catch (err) {
        console.error('Failed to sync subscription to Firestore:', err);
      }
    }
  };

  const handleOpenUpload = (asg?: Assignment) => {
    setUploadTargetAssignment(asg || null);
    setUploadModalOpen(true);
  };

  const handleUploadSuccess = async (newAsg: Assignment) => {
    setAssignments((prev) => {
      const exists = prev.some((a) => a.id === newAsg.id);
      if (exists) {
        return prev.map((a) => (a.id === newAsg.id ? newAsg : a));
      }
      return [newAsg, ...prev];
    });

    try {
      await addDoc(collection(db, 'assignments'), {
        studentId: currentUser?.uid || 'learner',
        studentName: userProfile?.fullName || 'Student Learner',
        subjectId: newAsg.subjectId,
        subjectName: newAsg.subjectName,
        title: newAsg.title,
        description: newAsg.description,
        dueDate: newAsg.dueDate,
        totalMarks: newAsg.totalMarks,
        level: newAsg.level,
        status: 'submitted',
        fileName: newAsg.submittedFile?.name || 'Exercise_Book_Scan.pdf',
        fileSize: newAsg.submittedFile?.size || '1.8 MB',
        createdAt: new Date().toISOString(),
      });
    } catch (e) {
      console.error('Failed to persist assignment in Firestore:', e);
    }
  };

  const handleJoinLiveClass = (session: LiveSession) => {
    setActiveSession(session);
    setCurrentView('live_class');
  };

  const handleGradeAssignment = async (assignmentId: string, score: number, remarks: string) => {
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === assignmentId
          ? {
              ...a,
              status: 'graded' as const,
              score,
              teacherRemarks: remarks,
              gradedDate: new Date().toISOString().split('T')[0],
            }
          : a
      )
    );

    try {
      await updateDoc(doc(db, 'assignments', assignmentId), {
        status: 'graded',
        score,
        teacherRemarks: remarks,
        gradedDate: new Date().toISOString().split('T')[0],
      });
    } catch (e) {
      console.warn('Firestore doc update note:', e);
    }
  };

  const activeStudentProgress: StudentProgress = {
    ...INITIAL_STUDENT_PROGRESS,
    studentName: userProfile?.fullName || 'Active Student',
    grade: userProfile?.grade || 'Form 3 (KCSE Prep)',
    parentName: userProfile?.role === 'parent' ? userProfile.fullName : 'David Kimani (Parent)',
  };

  const activeTeacher = userProfile?.role === 'teacher'
    ? {
        ...teachers[0],
        fullName: userProfile.fullName,
        tscNumber: userProfile.tscNumber || 'TSC/592014',
        qualification: userProfile.qualification || teachers[0].qualification,
        county: userProfile.county || 'Nairobi',
      }
    : teachers[0];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-[#008751] selection:text-white">
      {/* Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        onOpenTeacherRegister={() => setTeacherRegisterModalOpen(true)}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* Quick Navigation Control Bar */}
      <div className="bg-slate-900 border-b border-slate-800 text-white py-2.5 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
            <span className="font-bold text-amber-300">Quick Navigation:</span>
            {currentUser ? (
              <span className="text-slate-200">
                Logged in as <strong className="text-white">{userProfile?.fullName || currentUser.email}</strong> ({userProfile?.role || 'student'})
              </span>
            ) : (
              <button
                onClick={() => setCurrentView('student_auth')}
                className="underline hover:text-white text-emerald-300 font-semibold cursor-pointer"
              >
                Sign in with mobile number →
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5 font-semibold">
            <button
              onClick={() => setCurrentView('landing')}
              className={`rounded-lg px-2.5 py-1 transition-colors cursor-pointer ${
                currentView === 'landing' ? 'bg-[#008751] text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              Landing Page
            </button>
            <button
              onClick={() => setCurrentView('student_auth')}
              className={`rounded-lg px-2.5 py-1 transition-colors cursor-pointer flex items-center space-x-1 ${
                currentView === 'student_auth' ? 'bg-[#008751] text-white' : 'bg-slate-800 hover:bg-slate-700 text-emerald-300'
              }`}
            >
              <Smartphone className="h-3 w-3" />
              <span>Student Phone Sign In</span>
            </button>
            <button
              onClick={() => setCurrentView('student')}
              className={`rounded-lg px-2.5 py-1 transition-colors cursor-pointer ${
                currentView === 'student' ? 'bg-[#008751] text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              Student Portal
            </button>
            <button
              onClick={() => setCurrentView('admin')}
              className={`rounded-lg px-2.5 py-1 transition-colors cursor-pointer flex items-center space-x-1 ${
                currentView === 'admin' ? 'bg-indigo-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-indigo-300'
              }`}
            >
              <Briefcase className="h-3 w-3" />
              <span>Admin: Teacher Pool & Tasks</span>
            </button>
            <button
              onClick={() => setCurrentView('teacher')}
              className={`rounded-lg px-2.5 py-1 transition-colors cursor-pointer ${
                currentView === 'teacher' ? 'bg-[#008751] text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              Teacher Tasks ({tasks.filter(t => t.status !== 'completed').length})
            </button>
            <button
              onClick={() => setCurrentView('parent')}
              className={`rounded-lg px-2.5 py-1 transition-colors cursor-pointer ${
                currentView === 'parent' ? 'bg-[#008751] text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              Parent View
            </button>
            <button
              onClick={() => handleOpenMpesa(subjects[0])}
              className="rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-2.5 py-1 flex items-center space-x-1 cursor-pointer"
            >
              <Smartphone className="h-3 w-3" />
              <span>M-Pesa STK (500 KES)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {currentView === 'landing' && (
          <LandingPage
            subjects={subjects}
            teachers={teachers}
            onSelectSubject={handleOpenMpesa}
            onOpenTeacherRegister={() => setTeacherRegisterModalOpen(true)}
            onNavigateToStudent={() => setCurrentView('student')}
            onNavigateToParent={() => setCurrentView('parent')}
            onNavigateToStudentAuth={() => setCurrentView('student_auth')}
            onNavigateToAdmin={() => setCurrentView('admin')}
          />
        )}

        {currentView === 'student_auth' && (
          <StudentPhoneAuthPage
            onSuccess={() => setCurrentView('student')}
            onNavigateHome={() => setCurrentView('landing')}
          />
        )}

        {currentView === 'admin' && (
          <AdminTeacherPoolPortal
            teachers={teachers}
            tasks={tasks}
            onAddTeacher={handleAddTeacherToPool}
            onAssignTask={handleAssignTask}
            onUpdateTaskStatus={handleUpdateTaskStatus}
            onDeleteTeacher={handleDeleteTeacher}
            onUpdateTeacher={handleUpdateTeacher}
          />
        )}

        {currentView === 'student' && (
          <StudentDashboard
            subjects={subjects}
            assignments={assignments}
            liveSessions={liveSessions}
            subscriptions={subscriptions}
            onOpenUpload={handleOpenUpload}
            onJoinLiveClass={handleJoinLiveClass}
            onOpenMpesa={handleOpenMpesa}
          />
        )}

        {currentView === 'parent' && (
          <ParentDashboard
            progress={activeStudentProgress}
            subscriptions={subscriptions}
            subjects={subjects}
            onOpenMpesa={handleOpenMpesa}
          />
        )}

        {currentView === 'teacher' && (
          <TeacherDashboard
            teacher={activeTeacher}
            liveSessions={liveSessions}
            assignments={assignments}
            tasks={tasks}
            onStartLiveClass={handleJoinLiveClass}
            onGradeAssignment={handleGradeAssignment}
            onUpdateTaskStatus={handleUpdateTaskStatus}
          />
        )}

        {currentView === 'live_class' && (
          <LiveClassroom
            session={activeSession}
            onLeave={() => setCurrentView('student')}
            userRole={userProfile?.role || 'student'}
          />
        )}
      </main>

      {/* Firebase Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultRole="student"
      />

      {/* M-Pesa Daraja STK Push Modal */}
      <MpesaModal
        isOpen={mpesaModalOpen}
        subject={selectedSubjectForMpesa}
        onClose={() => setMpesaModalOpen(false)}
        onSuccess={handleMpesaSuccess}
      />

      {/* Assignment Upload Modal */}
      <AssignmentUploadModal
        isOpen={uploadModalOpen}
        assignment={uploadTargetAssignment}
        onClose={() => setUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />

      {/* Teacher Registration Modal */}
      <TeacherRegistrationModal
        isOpen={teacherRegisterModalOpen}
        onClose={() => setTeacherRegisterModalOpen(false)}
        onRegistered={handleAddTeacherToPool}
      />

      {/* Modern Kenya Educational Footer */}
      <footer className="border-t border-slate-200 bg-white pt-12 pb-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base text-slate-900">ElimuSpark Kenya</span>
                <span className="rounded bg-emerald-100 text-[#008751] px-1.5 py-0.5 text-[10px] font-bold">
                  CBC & KCSE
                </span>
              </div>
              <p className="text-slate-500 leading-relaxed">
                Kenya's premier online tuition center connecting qualified TSC teachers with students for live video sessions, homework assistance, and national examination success.
              </p>
              <div className="flex items-center space-x-2 font-mono text-emerald-800">
                <Smartphone className="h-4 w-4 text-[#008751]" />
                <span className="font-bold">M-Pesa Till: {KENYA_PHONE_TARGET}</span>
              </div>
            </div>

            <div>
              <p className="font-bold text-slate-800 uppercase tracking-wider mb-3">Curriculum Levels</p>
              <ul className="space-y-2">
                <li><button onClick={() => setCurrentView('landing')} className="hover:text-slate-900">Primary (Grade 4–6 / KPSEA)</button></li>
                <li><button onClick={() => setCurrentView('landing')} className="hover:text-slate-900">Junior Secondary School (Grade 7–9 CBC)</button></li>
                <li><button onClick={() => setCurrentView('landing')} className="hover:text-slate-900">Form 1 & 2 Foundation Studies</button></li>
                <li><button onClick={() => setCurrentView('landing')} className="hover:text-slate-900">Form 3 & 4 KCSE Candidate Revision</button></li>
              </ul>
            </div>

            <div>
              <p className="font-bold text-slate-800 uppercase tracking-wider mb-3">Major Kenyan Subjects</p>
              <ul className="space-y-2">
                <li><span>Mathematics & Sciences (Chem, Bio, Phy)</span></li>
                <li><span>Kiswahili (Lugha & Fasihi)</span></li>
                <li><span>English & Literature (The Samaritan, etc.)</span></li>
                <li><span>Integrated Science & Social Studies</span></li>
              </ul>
            </div>

            <div className="space-y-3">
              <p className="font-bold text-slate-800 uppercase tracking-wider">M-Pesa Weekly Billing</p>
              <p className="leading-relaxed">
                Flat weekly rate of <strong className="text-slate-900">KES 500 per subject</strong>. Integrated with Safaricom Daraja API for automated STK pushes to <span className="font-mono font-bold text-slate-800">{KENYA_PHONE_TARGET}</span>.
              </p>
              <div className="rounded-xl bg-emerald-50 border border-emerald-200/80 p-3 text-emerald-900 space-y-1">
                <p className="font-bold flex items-center space-x-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#008751]" />
                  <span>TSC Verified Educators</span>
                </p>
                <p className="text-[11px] text-emerald-800">Every teacher is vetted for quality and national syllabus mastery.</p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between text-slate-400 gap-3">
            <p>© {new Date().getFullYear()} ElimuSpark Kenya Online Tuition Center. All rights reserved.</p>
            <p className="flex items-center space-x-1">
              <span>Backed by Cloud Firestore & Firebase Auth</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
