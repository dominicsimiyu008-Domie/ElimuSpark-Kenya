import React, { useState } from 'react';
import { X, UploadCloud, Camera, FileText, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { Assignment } from '../types';

interface AssignmentUploadModalProps {
  assignment?: Assignment | null;
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (newAssignment: Assignment) => void;
}

export const AssignmentUploadModal: React.FC<AssignmentUploadModalProps> = ({
  assignment,
  isOpen,
  onClose,
  onUploadSuccess,
}) => {
  const [subjectName, setSubjectName] = useState(assignment?.subjectName || 'Mathematics Form 3');
  const [title, setTitle] = useState(assignment?.title || 'Form 3 Quadratic Equations Worked Solutions');
  const [studentRemarks, setStudentRemarks] = useState('');
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: string } | null>(
    assignment?.submittedFile ? { name: assignment.submittedFile.name, size: assignment.submittedFile.size } : null
  );
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isCapturingCamera, setIsCapturingCamera] = useState(false);

  if (!isOpen) return null;

  const handleSimulateCameraSnap = () => {
    setIsCapturingCamera(true);
    setTimeout(() => {
      setSelectedFile({
        name: `Exercise_Book_Snap_${new Date().toISOString().slice(0, 10)}.jpg`,
        size: '3.1 MB',
      });
      setIsCapturingCamera(false);
    }, 1200);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Please select or photograph your assignment page first.');
      return;
    }

    setUploadProgress(15);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (!prev) return 30;
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const updated: Assignment = {
              id: assignment?.id || `asg-${Date.now()}`,
              subjectId: assignment?.subjectId || 'math-sec',
              subjectName,
              title,
              description: assignment?.description || 'Student uploaded homework solution set.',
              dueDate: assignment?.dueDate || new Date().toISOString().split('T')[0],
              totalMarks: assignment?.totalMarks || 30,
              level: assignment?.level || 'Form 3',
              status: 'submitted',
              submittedFile: {
                name: selectedFile.name,
                size: selectedFile.size,
                uploadDate: `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
              },
            };
            onUploadSuccess(updated);
            onClose();
          }, 400);
          return 100;
        }
        return prev + 35;
      });
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-6 py-4">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Upload Assignment / Homework</h3>
            <p className="text-xs text-slate-500">Submit handwritten work or documents for teacher marking</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Subject & Topic
            </label>
            <input
              type="text"
              value={`${subjectName} - ${title}`}
              readOnly
              className="w-full rounded-xl bg-slate-100 border border-slate-200 px-3.5 py-2.5 text-sm font-semibold text-slate-700 outline-none"
            />
          </div>

          {/* Upload Drop Zone / Camera Scan */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Assignment File or Exercise Book Photo
            </label>

            <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/60 p-5 text-center transition-all hover:border-[#008751]/60">
              {selectedFile ? (
                <div className="flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-left">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-lg bg-[#008751] flex items-center justify-center text-white">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 line-clamp-1">{selectedFile.name}</p>
                      <p className="text-xs text-slate-500">{selectedFile.size} • Ready for tutor</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    className="text-xs text-red-600 font-semibold hover:underline"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-[#008751]">
                    <UploadCloud className="h-6 w-6" />
                  </div>
                  <div>
                    <label className="cursor-pointer text-sm font-bold text-[#008751] hover:underline">
                      <span>Click to upload PDF or Document</span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                        className="sr-only"
                      />
                    </label>
                    <p className="text-xs text-slate-500 mt-0.5">PDF, Word, or Scanned Images up to 15MB</p>
                  </div>

                  <div className="relative flex items-center py-1">
                    <div className="flex-grow border-t border-slate-200" />
                    <span className="flex-shrink mx-3 text-[11px] font-bold text-slate-400 uppercase">Or snap with phone camera</span>
                    <div className="flex-grow border-t border-slate-200" />
                  </div>

                  <button
                    type="button"
                    onClick={handleSimulateCameraSnap}
                    disabled={isCapturingCamera}
                    className="inline-flex items-center space-x-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
                  >
                    <Camera className="h-4 w-4" />
                    <span>{isCapturingCamera ? 'Snapping Exercise Book...' : 'Snap Exercise Book Page'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Note to Tutor (Optional)
            </label>
            <textarea
              rows={2}
              value={studentRemarks}
              onChange={(e) => setStudentRemarks(e.target.value)}
              placeholder="e.g. Mwalimu, please check Question 4 where I struggled with finding the determinant."
              className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-800 placeholder-slate-400 focus:border-[#008751] focus:ring-2 focus:ring-[#008751]/20 outline-none"
            />
          </div>

          {uploadProgress !== null && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-slate-600">
                <span>Uploading to Kenya Tuition Cloud...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-[#008751] transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedFile || uploadProgress !== null}
              className="flex items-center space-x-1.5 rounded-xl bg-[#008751] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-700/20 hover:bg-[#007043] disabled:opacity-50 cursor-pointer"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Submit for Marking</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
