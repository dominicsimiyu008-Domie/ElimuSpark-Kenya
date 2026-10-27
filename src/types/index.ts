export type EducationLevel = 'primary' | 'jss' | 'secondary';

export interface Subject {
  id: string;
  name: string;
  level: EducationLevel;
  gradeLevels: string[];
  iconName: string;
  category: 'Sciences' | 'Languages' | 'Mathematics' | 'Humanities' | 'Technical';
  description: string;
  weeklyPriceKES: number;
  syllabus: string;
  activeTutorsCount: number;
}

export interface Teacher {
  id: string;
  fullName: string;
  tscNumber?: string;
  phone: string;
  email: string;
  county: string;
  qualification: string;
  teachingLevels: EducationLevel[];
  subjects: string[];
  experienceYears: number;
  rating: number;
  reviewsCount: number;
  hourlyRateKES: number;
  bio: string;
  avatarUrl: string;
  isVerifiedTSC: boolean;
  activeStudents: number;
  status?: 'active' | 'on_leave' | 'vetted';
  assignedTasksCount?: number;
  nextSessionTime?: string;
}

export interface TeacherTask {
  id: string;
  title: string;
  taskType: 'marking' | 'live_session' | 'curriculum_prep' | 'remedial';
  subject: string;
  level: string;
  teacherId: string;
  teacherName: string;
  assignedBy: string;
  priority: 'urgent' | 'high' | 'normal';
  dueDate: string;
  instructions: string;
  status: 'assigned' | 'in_progress' | 'completed';
  targetStudent?: string;
  createdAt: string;
  completedAt?: string;
}

export interface Assignment {
  id: string;
  subjectId: string;
  subjectName: string;
  title: string;
  description: string;
  dueDate: string;
  totalMarks: number;
  level: string;
  status: 'pending' | 'submitted' | 'graded';
  submittedFile?: {
    name: string;
    size: string;
    uploadDate: string;
    url?: string;
  };
  score?: number;
  teacherRemarks?: string;
  gradedDate?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  subject: string;
  examType: 'KPSEA' | 'KCSE' | 'CBC Check';
  difficulty: 'Foundation' | 'Intermediate' | 'KCSE Standard';
}

export interface LiveSession {
  id: string;
  subject: string;
  grade: string;
  teacherName: string;
  teacherAvatar: string;
  startTime: string;
  endTime: string;
  topic: string;
  status: 'upcoming' | 'live' | 'completed';
  meetingCode: string;
  participantsCount: number;
}

export interface StudentProgress {
  studentName: string;
  grade: string;
  parentName: string;
  parentPhone: string;
  attendanceRate: number;
  weeklyHoursLogged: number;
  totalAssessmentsTaken: number;
  averageScore: number;
  competencies: {
    name: string;
    level: 'Exceeding' | 'Meeting' | 'Approaching';
    score: number;
  }[];
  weeklyProgressTrend: {
    week: string;
    score: number;
    hours: number;
  }[];
  subjectBreakdown: {
    subject: string;
    score: number;
    completedAssignments: number;
    totalAssignments: number;
    status: 'Excellent' | 'Good' | 'Needs Support';
  }[];
}

export interface MpesaTransaction {
  id: string;
  receiptNumber: string;
  phoneNumber: string;
  amount: number;
  subjectName: string;
  timestamp: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  merchantRequestId?: string;
  checkoutRequestId?: string;
  responseDesc?: string;
}

export interface Subscription {
  subjectId: string;
  subjectName: string;
  status: 'active' | 'expiring_soon' | 'expired';
  subscribedOn: string;
  expiresOn: string;
  amountKES: number;
  mpesaReceipt: string;
}
