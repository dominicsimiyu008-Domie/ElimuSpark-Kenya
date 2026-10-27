import React, { useState } from 'react';
import { X, Smartphone, ShieldCheck, CheckCircle2, Copy, ArrowRight, Loader2, RefreshCw } from 'lucide-react';
import { triggerConfetti } from '../services/confetti';
import { KENYA_PHONE_TARGET, WEEKLY_SUBSCRIPTION_FEE_KES } from '../data/mockData';
import { initiateDarajaStkPush, formatKenyanPhone } from '../services/mpesa';
import { Subject } from '../types';

interface MpesaModalProps {
  subject: Subject | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (receipt: string) => void;
}

type PaymentStep = 'input' | 'push_sent' | 'pin_prompt' | 'success';

export const MpesaModal: React.FC<MpesaModalProps> = ({
  subject,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [phoneNumber, setPhoneNumber] = useState('0704641901');
  const [step, setStep] = useState<PaymentStep>('input');
  const [loading, setLoading] = useState(false);
  const [pin, setPin] = useState('');
  const [receiptData, setReceiptData] = useState<{ receipt: string; text: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [pinError, setPinError] = useState('');

  if (!isOpen || !subject) return null;

  const handleSendStkPush = async (e: React.FormEvent) => {
    e.preventDefault();
    const phoneCheck = formatKenyanPhone(phoneNumber);
    if (!phoneCheck.isValid) {
      alert('Please enter a valid Kenyan phone number (e.g., 0704641901 or 0712345678)');
      return;
    }

    setLoading(true);
    setStep('push_sent');

    // Show simulated phone STK popup prompt after 1.5 seconds
    setTimeout(() => {
      setLoading(false);
      setStep('pin_prompt');
    }, 1500);
  };

  const handleConfirmPin = async () => {
    if (pin.length !== 4) {
      setPinError('Please enter a 4-digit M-Pesa PIN');
      return;
    }
    setPinError('');
    setLoading(true);

    try {
      const res = await initiateDarajaStkPush({
        phoneNumber,
        subjectId: subject.id,
        subjectName: subject.name,
        amount: WEEKLY_SUBSCRIPTION_FEE_KES,
      });

      if (res.success && res.transaction) {
        setReceiptData({
          receipt: res.transaction.receiptNumber,
          text: res.receiptText || '',
        });
        setStep('success');
        triggerConfetti();
        onSuccess(res.transaction.receiptNumber);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to process payment. Please retry.');
      setStep('input');
    } finally {
      setLoading(false);
    }
  };

  const copyReceipt = () => {
    if (receiptData?.text) {
      navigator.clipboard.writeText(receiptData.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-100">
        {/* Header with Safaricom M-Pesa Signature Green */}
        <div className="bg-gradient-to-r from-[#008751] to-[#005a36] p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 font-bold backdrop-blur-md">
                <Smartphone className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-xs font-semibold tracking-wider uppercase text-emerald-200">
                  Lipa Na M-Pesa Online (Daraja API)
                </span>
                <h3 className="text-lg font-bold">Weekly Subject Tuition Pass</h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4 flex items-baseline justify-between rounded-xl bg-black/20 p-3 backdrop-blur-sm">
            <div>
              <p className="text-xs text-emerald-100">Selected Subject</p>
              <p className="font-semibold text-white">{subject.name} ({subject.gradeLevels[0]})</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-emerald-100">Weekly Fee</p>
              <p className="text-xl font-extrabold text-amber-300">KES {WEEKLY_SUBSCRIPTION_FEE_KES}</p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {step === 'input' && (
            <form onSubmit={handleSendStkPush} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  M-Pesa Registered Phone Number
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <span className="text-sm font-semibold text-slate-500">🇰🇪 +254</span>
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="0704641901"
                    required
                    className="w-full rounded-xl border border-slate-300 py-3 pl-24 pr-4 text-base font-semibold text-slate-900 focus:border-[#008751] focus:ring-2 focus:ring-[#008751]/20 outline-none transition-all"
                  />
                </div>
                <p className="mt-1.5 text-xs text-slate-500">
                  Target payment line: <strong className="text-slate-800 font-mono">{KENYA_PHONE_TARGET}</strong> (Elimu Tuition Services)
                </p>
              </div>

              <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-4 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-emerald-900">
                  <ShieldCheck className="h-4 w-4 text-[#008751]" />
                  <span>What happens when you click proceed:</span>
                </div>
                <ol className="list-decimal pl-5 text-xs text-emerald-800 space-y-1">
                  <li>Daraja API sends an instant STK push prompt to your phone.</li>
                  <li>Enter your 4-digit M-Pesa PIN on the prompt screen.</li>
                  <li>Instant confirmation unlocks 7 days unlimited live classes & materials!</li>
                </ol>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-2 rounded-xl bg-[#008751] py-3.5 px-4 font-bold text-white shadow-lg shadow-emerald-700/20 hover:bg-[#007043] active:scale-[0.99] transition-all cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Initiating Daraja STK Push...</span>
                    </>
                  ) : (
                    <>
                      <span>Pay KES {WEEKLY_SUBSCRIPTION_FEE_KES} via M-Pesa STK Push</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {step === 'push_sent' && (
            <div className="py-8 text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-[#008751] animate-bounce">
                <Smartphone className="h-8 w-8" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900">Pushing STK Request to Phone...</h4>
                <p className="text-sm text-slate-600 mt-1">
                  Connecting to Safaricom Daraja API for <span className="font-mono font-semibold text-slate-800">{phoneNumber}</span>
                </p>
              </div>
              <div className="flex items-center justify-center space-x-2 text-xs text-slate-400">
                <RefreshCw className="h-4 w-4 animate-spin text-[#008751]" />
                <span>Awaiting handset handshake...</span>
              </div>
            </div>
          )}

          {step === 'pin_prompt' && (
            <div className="space-y-5">
              {/* Realistic Safaricom STK Phone Popup Dialog */}
              <div className="mx-auto max-w-xs rounded-2xl bg-slate-900 p-4 text-white shadow-2xl border-4 border-slate-700">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px] text-slate-400">
                  <span className="font-semibold text-emerald-400">SIM TOOLKIT</span>
                  <span>Safaricom</span>
                </div>
                <div className="py-4 text-center space-y-2">
                  <p className="text-xs text-slate-300">
                    Do you want to pay <span className="font-bold text-white">KES {WEEKLY_SUBSCRIPTION_FEE_KES}.00</span> to{' '}
                    <span className="font-semibold text-emerald-300">ELIMU TUITION</span> on{' '}
                    <span className="font-mono text-white">{KENYA_PHONE_TARGET}</span>?
                  </p>
                  <p className="text-xs font-semibold text-amber-300">Enter M-PESA PIN:</p>
                  
                  <div className="pt-1">
                    <input
                      type="password"
                      maxLength={4}
                      value={pin}
                      autoFocus
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        setPin(val);
                      }}
                      placeholder="••••"
                      className="w-36 text-center text-xl tracking-[0.4em] font-mono rounded-lg bg-slate-800 border border-slate-600 py-1.5 px-3 text-white focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                  {pinError && <p className="text-[11px] text-red-400">{pinError}</p>}
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setStep('input')}
                    className="rounded-lg bg-slate-800 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmPin}
                    disabled={loading}
                    className="rounded-lg bg-[#008751] py-1.5 text-xs font-bold text-white hover:bg-emerald-600 flex items-center justify-center space-x-1"
                  >
                    {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <span>Send (OK)</span>}
                  </button>
                </div>
              </div>

              <p className="text-center text-xs text-slate-500">
                Interactive Daraja simulation: Enter any 4-digit PIN (e.g. 1234) and click Send.
              </p>
            </div>
          )}

          {step === 'success' && receiptData && (
            <div className="space-y-5 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-[#008751]">
                <CheckCircle2 className="h-8 w-8" />
              </div>

              <div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                  Payment Confirmed • 7 Days Active
                </span>
                <h4 className="text-xl font-bold text-slate-900 mt-1">Subscription Activated!</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  You now have full access to live classes, quizzes, and homework reviews for {subject.name}.
                </p>
              </div>

              {/* M-Pesa SMS format card */}
              <div className="relative rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 text-left">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-emerald-200/60">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-emerald-900">MPESA Official Receipt</span>
                    <span className="rounded bg-emerald-200/80 px-1.5 py-0.2 text-[10px] font-mono font-bold text-emerald-950">
                      {receiptData.receipt}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={copyReceipt}
                    className="flex items-center space-x-1 text-xs font-semibold text-[#008751] hover:text-emerald-900 transition-colors cursor-pointer"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    <span>{copied ? 'Copied' : 'Copy SMS'}</span>
                  </button>
                </div>
                <p className="font-mono text-xs text-emerald-950 leading-relaxed">
                  {receiptData.text}
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-xl bg-slate-900 py-3 px-4 font-semibold text-white hover:bg-slate-800 transition-colors"
              >
                Go to Classroom & Materials
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
