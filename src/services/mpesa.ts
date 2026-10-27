import { MpesaTransaction, Subscription } from '../types';
import { KENYA_PHONE_TARGET, WEEKLY_SUBSCRIPTION_FEE_KES } from '../data/mockData';

const STORAGE_KEYS = {
  TRANSACTIONS: 'elimu_mpesa_transactions',
  SUBSCRIPTIONS: 'elimu_user_subscriptions',
};

// Generates authentic Safaricom 10-character alphanumeric transaction code
export function generateMpesaReceipt(): string {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const alphanumeric = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let code = letters.charAt(Math.floor(Math.random() * letters.length));
  code += letters.charAt(Math.floor(Math.random() * letters.length));
  for (let i = 0; i < 8; i++) {
    code += alphanumeric.charAt(Math.floor(Math.random() * alphanumeric.length));
  }
  return code;
}

// Format Kenyan phone numbers to standard 2547XXXXXXXX or 07XXXXXXXX
export function formatKenyanPhone(phone: string): { standard: string; e164: string; isValid: boolean } {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.startsWith('254') && cleaned.length === 12) {
    return {
      standard: '0' + cleaned.substring(3),
      e164: '+' + cleaned,
      isValid: true,
    };
  }
  
  if ((cleaned.startsWith('07') || cleaned.startsWith('01')) && cleaned.length === 10) {
    return {
      standard: cleaned,
      e164: '+254' + cleaned.substring(1),
      isValid: true,
    };
  }
  
  if ((cleaned.startsWith('7') || cleaned.startsWith('1')) && cleaned.length === 9) {
    return {
      standard: '0' + cleaned,
      e164: '+254' + cleaned,
      isValid: true,
    };
  }

  return {
    standard: phone,
    e164: phone,
    isValid: false,
  };
}

export interface StkPushParams {
  phoneNumber: string;
  subjectId: string;
  subjectName: string;
  amount?: number;
}

export interface StkPushResponse {
  success: boolean;
  merchantRequestId: string;
  checkoutRequestId: string;
  responseCode: string;
  responseDescription: string;
  customerMessage: string;
  transaction?: MpesaTransaction;
  receiptText?: string;
}

// Daraja STK Push Initiator
export async function initiateDarajaStkPush(params: StkPushParams): Promise<StkPushResponse> {
  const { phoneNumber, subjectId, subjectName, amount = WEEKLY_SUBSCRIPTION_FEE_KES } = params;
  const formatted = formatKenyanPhone(phoneNumber);

  const merchantRequestId = `MR-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const checkoutRequestId = `ws_CO_${Date.now()}_${Math.floor(Math.random() * 100000)}`;

  // Simulate realistic network latency of Safaricom Daraja gateway
  await new Promise((resolve) => setTimeout(resolve, 1400));

  const receipt = generateMpesaReceipt();
  const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' });
  const timeStr = new Date().toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' });

  const transaction: MpesaTransaction = {
    id: checkoutRequestId,
    receiptNumber: receipt,
    phoneNumber: formatted.standard,
    amount,
    subjectName,
    timestamp: new Date().toISOString(),
    status: 'SUCCESS',
    merchantRequestId,
    checkoutRequestId,
    responseDesc: 'The service request is processed successfully.',
  };

  const receiptText = `${receipt} Confirmed. Ksh${amount}.00 sent to ELIMU TUITION on ${KENYA_PHONE_TARGET} for ${subjectName} weekly tuition on ${dateStr} at ${timeStr}.`;

  saveTransaction(transaction);

  activateSubscription({
    subjectId,
    subjectName,
    amountKES: amount,
    mpesaReceipt: receipt,
    status: 'active',
    subscribedOn: new Date().toISOString().split('T')[0],
    expiresOn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  return {
    success: true,
    merchantRequestId,
    checkoutRequestId,
    responseCode: '0',
    responseDescription: 'Success. Request accepted for processing',
    customerMessage: `STK push sent to ${formatted.standard}. Please enter your M-Pesa PIN on your phone to complete KES ${amount} payment to 0704641901.`,
    transaction,
    receiptText,
  };
}

export function getStoredTransactions(): MpesaTransaction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveTransaction(tx: MpesaTransaction) {
  try {
    const existing = getStoredTransactions();
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify([tx, ...existing]));
  } catch (e) {
    console.error('Failed to save transaction', e);
  }
}

export function getStoredSubscriptions(): Subscription[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTIONS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function activateSubscription(sub: Subscription) {
  try {
    const existing = getStoredSubscriptions();
    const updated = [sub, ...existing.filter((s) => s.subjectId !== sub.subjectId)];
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save subscription', e);
  }
}
