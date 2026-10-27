import React, { useState } from 'react';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Award, Clock, Lightbulb } from 'lucide-react';
import { triggerConfetti } from '../services/confetti';
import { QUIZ_QUESTIONS } from '../data/mockData';
import { QuizQuestion } from '../types';

interface AssessmentQuizProps {
  onComplete?: (scorePercentage: number) => void;
}

export const AssessmentQuiz: React.FC<AssessmentQuizProps> = ({ onComplete }) => {
  const [questions] = useState<QuizQuestion[]>(QUIZ_QUESTIONS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [index: number]: number }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQ = questions[currentIndex];
  const isAnswered = selectedAnswers[currentIndex] !== undefined;

  const handleSelectOption = (idx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: idx,
    }));
  };

  const handleNext = () => {
    setShowExplanation(false);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Calculate score and complete
      setIsSubmitted(true);
      let correct = 0;
      questions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correctIndex) correct++;
      });
      const pct = Math.round((correct / questions.length) * 100);
      if (pct >= 60) {
        triggerConfetti();
      }
      if (onComplete) onComplete(pct);
    }
  };

  const handlePrev = () => {
    setShowExplanation(false);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setCurrentIndex(0);
    setShowExplanation(false);
  };

  // Calculation
  let totalCorrect = 0;
  questions.forEach((q, idx) => {
    if (selectedAnswers[idx] === q.correctIndex) totalCorrect++;
  });
  const scorePct = Math.round((totalCorrect / questions.length) * 100);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              KNEC Standard • Real-time Mock
            </span>
            <span className="text-xs text-slate-500">• 5 Timed Questions</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mt-1">National Exam Practice Assessment</h3>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
            <Clock className="h-4 w-4 text-emerald-600" />
            <span>Progress: {currentIndex + 1} / {questions.length}</span>
          </div>
          {isSubmitted && (
            <button
              onClick={handleReset}
              className="flex items-center space-x-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Retry Quiz</span>
            </button>
          )}
        </div>
      </div>

      {!isSubmitted ? (
        <div className="space-y-6">
          {/* Question Stem */}
          <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
              <span className="text-emerald-700 font-bold uppercase tracking-wider">
                {currentQ.subject} • {currentQ.examType}
              </span>
              <span className="rounded bg-slate-200 px-2 py-0.5 text-[10px] text-slate-700 font-medium">
                Difficulty: {currentQ.difficulty}
              </span>
            </div>
            <p className="text-base font-semibold text-slate-900 leading-relaxed">
              Q{currentIndex + 1}. {currentQ.question}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedAnswers[currentIndex] === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full flex items-center justify-between rounded-xl border p-4 text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#008751] bg-emerald-50/70 shadow-sm ring-1 ring-[#008751]'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold ${
                        isSelected ? 'bg-[#008751] text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-sm font-medium text-slate-800">{option}</span>
                  </div>
                  {isSelected && <CheckCircle2 className="h-5 w-5 text-[#008751]" />}
                </button>
              );
            })}
          </div>

          {/* Explanation Toggle */}
          {isAnswered && (
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowExplanation(!showExplanation)}
                className="flex items-center space-x-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 transition-colors"
              >
                <Lightbulb className="h-4 w-4" />
                <span>{showExplanation ? 'Hide Marking Scheme & Working' : 'Preview Step-by-Step Marking Scheme'}</span>
              </button>

              {showExplanation && (
                <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50/80 p-4 text-xs text-amber-950">
                  <p className="font-bold text-amber-900 mb-1">Mwalimu's Explanation:</p>
                  <p className="leading-relaxed">{currentQ.explanation}</p>
                </div>
              )}
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            >
              Previous
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={!isAnswered}
              className="flex items-center space-x-1.5 rounded-xl bg-[#008751] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#007043] disabled:opacity-50 cursor-pointer"
            >
              <span>{currentIndex === questions.length - 1 ? 'Finish & Mark Assessment' : 'Next Question'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Results View */
        <div className="py-6 text-center space-y-6 animate-in fade-in">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-[#008751]">
            <Award className="h-10 w-10" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Assessment Summary
            </span>
            <h4 className="text-2xl font-extrabold text-slate-900 mt-1">
              You Scored {scorePct}% ({totalCorrect} / {questions.length} Correct)
            </h4>
            <p className="text-sm text-slate-600 max-w-md mx-auto mt-1">
              {scorePct >= 80
                ? 'Exceeding Expectations! Solid preparation for upcoming national examinations.'
                : scorePct >= 60
                ? 'Meeting Expectations. A few specific topics need revision with your assigned tutor.'
                : 'Approaching Expectations. Book a 1-on-1 live session to drill down on these core concepts.'}
            </p>
          </div>

          {/* Breakdown cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-xl mx-auto">
            {questions.map((q, i) => {
              const isCorrect = selectedAnswers[i] === q.correctIndex;
              return (
                <div
                  key={q.id}
                  className={`rounded-xl border p-3 text-xs ${
                    isCorrect ? 'border-emerald-200 bg-emerald-50/60' : 'border-red-200 bg-red-50/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-800">Question {i + 1} ({q.subject})</span>
                    {isCorrect ? (
                      <span className="flex items-center space-x-1 text-emerald-700 font-semibold">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Correct</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-1 text-red-600 font-semibold">
                        <XCircle className="h-3.5 w-3.5" />
                        <span>Needs Revision</span>
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 line-clamp-1">{q.question}</p>
                </div>
              );
            })}
          </div>

          <div className="pt-2">
            <button
              onClick={handleReset}
              className="inline-flex items-center space-x-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition-colors shadow-sm"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Take Another Practice Assessment</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
