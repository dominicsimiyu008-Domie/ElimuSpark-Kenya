import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Upload, User, Phone } from 'lucide-react';
import { EducationLevel } from '../types';

interface TeacherRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegistered: (teacherData: any) => void;
}

export const TeacherRegistrationModal: React.FC<TeacherRegistrationModalProps> = ({
  isOpen,
  onClose,
  onRegistered,
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    tscNumber: '',
    phone: '',
    email: '',
    county: 'Nairobi',
    qualification: 'B.Ed (Science)',
    levels: ['secondary'] as EducationLevel[],
    subjects: ['Mathematics', 'Physics'],
    experienceYears: 5,
    bio: '',
  });

  const [hasUploadedCerts, setHasUploadedCerts] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleLevelToggle = (lvl: EducationLevel) => {
    setFormData((prev) => {
      const exists = prev.levels.includes(lvl);
      return {
        ...prev,
        levels: exists ? prev.levels.filter((l) => l !== lvl) : [...prev.levels, lvl],
      };
    });
  };

  const handleSubjectToggle = (subj: string) => {
    setFormData((prev) => {
      const exists = prev.subjects.includes(subj);
      return {
        ...prev,
        subjects: exists ? prev.subjects.filter((s) => s !== subj) : [...prev.subjects, subj],
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone) {
      alert('Please fill out all required fields.');
      return;
    }

    setIsSuccess(true);
    setTimeout(() => {
      onRegistered({
        ...formData,
        id: `tch-${Date.now()}`,
        rating: 5.0,
        reviewsCount: 1,
        hourlyRateKES: 500,
        isVerifiedTSC: !!formData.tscNumber,
        activeStudents: 0,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      });
    }, 1200);
  };

  const KENYAN_COUNTIES = [
    'Nairobi',
    'Kiambu',
    'Mombasa',
    'Nakuru',
    'Uasin Gishu (Eldoret)',
    'Kisumu',
    'Machakos',
    'Nyeri',
    'Meru',
    'Kakamega',
    'Kilifi',
    'Kajiado',
  ];

  const KENYAN_SUBJECT_OPTIONS = [
    'Mathematics',
    'Chemistry',
    'Physics',
    'Biology',
    'English & Literature',
    'Kiswahili (Lugha & Fasihi)',
    'Integrated Science (JSS)',
    'Primary Mathematics (KPSEA)',
    'Business Studies',
    'CRE / Social Studies',
    'Agriculture',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-slate-100 overflow-hidden my-8">
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 p-6 text-white flex items-center justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-300">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>TSC Registered & Verified Educator Portal</span>
            </div>
            <h3 className="text-xl font-bold">Join ElimuSpark as a Qualified Tutor</h3>
            <p className="text-xs text-slate-300">Connect with primary and secondary students across Kenya for live online classes.</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-white/70 hover:bg-white/20 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Full Name (Mwalimu) *
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Tr. John Mutua"
                    className="w-full rounded-xl border border-slate-300 py-2.5 pl-9 pr-3 text-sm focus:border-[#008751] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  TSC Number (Optional / Recommended)
                </label>
                <input
                  type="text"
                  value={formData.tscNumber}
                  onChange={(e) => setFormData({ ...formData, tscNumber: e.target.value })}
                  placeholder="e.g. TSC/482910"
                  className="w-full rounded-xl border border-slate-300 py-2.5 px-3 text-sm focus:border-[#008751] outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  M-Pesa Phone Number *
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Phone className="h-4 w-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0712 345 678"
                    className="w-full rounded-xl border border-slate-300 py-2.5 pl-9 pr-3 text-sm focus:border-[#008751] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  County / Town
                </label>
                <select
                  value={formData.county}
                  onChange={(e) => setFormData({ ...formData, county: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 py-2.5 px-3 text-sm focus:border-[#008751] outline-none bg-white"
                >
                  {KENYAN_COUNTIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Highest Qualification
                </label>
                <select
                  value={formData.qualification}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 py-2.5 px-3 text-sm focus:border-[#008751] outline-none bg-white"
                >
                  <option value="B.Ed (Science)">Bachelor of Education (Science)</option>
                  <option value="B.Ed (Arts)">Bachelor of Education (Arts)</option>
                  <option value="PGDE">Postgraduate Diploma in Education (PGDE)</option>
                  <option value="Diploma in Education">Diploma in Primary / Secondary Education</option>
                  <option value="Masters in Education">Master of Education (M.Ed)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Years of Teaching Experience
                </label>
                <input
                  type="number"
                  min={1}
                  max={40}
                  value={formData.experienceYears}
                  onChange={(e) => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
                  className="w-full rounded-xl border border-slate-300 py-2.5 px-3 text-sm focus:border-[#008751] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Target Curriculum Levels Taught
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'primary', label: 'Primary (Grade 4-6 / KPSEA)' },
                  { id: 'jss', label: 'Junior Secondary (Grade 7-9 CBC)' },
                  { id: 'secondary', label: 'Senior Secondary (Form 1-4 KCSE)' },
                ].map((item) => {
                  const isChecked = formData.levels.includes(item.id as EducationLevel);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleLevelToggle(item.id as EducationLevel)}
                      className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
                        isChecked
                          ? 'border-[#008751] bg-emerald-50 text-emerald-900 ring-1 ring-[#008751]'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Subjects You Can Tutor
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {KENYAN_SUBJECT_OPTIONS.map((sub) => {
                  const isSelected = formData.subjects.includes(sub);
                  return (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => handleSubjectToggle(sub)}
                      className={`rounded-lg border px-2.5 py-1.5 text-xs text-left truncate transition-all ${
                        isSelected
                          ? 'border-[#008751] bg-[#008751] text-white font-semibold'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {sub}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Tutor Bio & KCSE/KPSEA Success Record
              </label>
              <textarea
                rows={2}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Highlight past national exam results, schools taught at, and your teaching style..."
                className="w-full rounded-xl border border-slate-300 p-3 text-xs focus:border-[#008751] outline-none"
              />
            </div>

            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center">
              {hasUploadedCerts ? (
                <div className="flex items-center justify-center space-x-2 text-xs font-bold text-emerald-800">
                  <CheckCircle2 className="h-4 w-4 text-[#008751]" />
                  <span>TSC Certificate & ID Verified & Attached (2 Documents)</span>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-700">Attach TSC Certificate & Degree Transcripts</p>
                  <button
                    type="button"
                    onClick={() => setHasUploadedCerts(true)}
                    className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#008751] hover:underline cursor-pointer"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    <span>Upload Certificates (PDF / Image)</span>
                  </button>
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-[#008751] px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-700/20 hover:bg-[#007043] cursor-pointer"
              >
                Submit Application for Vetting
              </button>
            </div>
          </form>
        ) : (
          <div className="p-8 text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-[#008751]">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-slate-900">Application Received, Mwalimu!</h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto mt-1">
                Our TSC Verification board has received your profile and documents. You will receive an SMS confirmation on {formData.phone} within 24 hours to schedule your demo video session.
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-xl bg-slate-900 px-6 py-2.5 text-xs font-semibold text-white hover:bg-slate-800"
            >
              Done & Return to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
