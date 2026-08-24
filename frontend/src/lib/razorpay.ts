import api from '@/lib/api';

export type PaymentContextType = 'shop' | 'course' | 'trial' | 'event' | 'reward' | 'other';

export interface RazorpayCoursePayload {
  courseId: string;
  courseTitle: string;
  trackSlug: string;
  price: number;
  pointsReward: number;
  teacher?: string;
  schedule?: string;
  lessons?: number;
}

export interface RazorpayCheckoutPayload {
  amount: number;
  currency?: string;
  contextType: PaymentContextType;
  contextRef?: string | null;
  description?: string;
  notes?: Record<string, unknown>;
  items?: unknown[];
  customerEmail?: string | null;
  customerPhone?: string | null;
  course?: RazorpayCoursePayload | null;
}

export interface RazorpayVerificationResult {
  paymentOrderId: number;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  status: 'paid' | 'failed';
  contextType: PaymentContextType;
  contextRef?: string | null;
  pointsAwarded?: number;
  balance?: number;
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, handler: () => void) => void;
    };
  }
}

type RazorpayResponsePayload = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

let razorpayScriptPromise: Promise<boolean> | null = null;

const loadRazorpayScript = () => {
  if (typeof window === 'undefined') {
    return Promise.resolve(false);
  }

  if (window.Razorpay) {
    return Promise.resolve(true);
  }

  if (razorpayScriptPromise) {
    return razorpayScriptPromise;
  }

  razorpayScriptPromise = new Promise((resolve, reject) => {
    const existing = document.getElementById('razorpay-checkout-script') as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener('load', () => resolve(true));
      existing.addEventListener('error', () => reject(new Error('Unable to load Razorpay checkout script')));
      return;
    }

    const script = document.createElement('script');
    script.id = 'razorpay-checkout-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error('Unable to load Razorpay checkout script'));
    document.body.appendChild(script);
  });

  return razorpayScriptPromise;
};

export const startRazorpayCheckout = async (
  payload: RazorpayCheckoutPayload,
): Promise<RazorpayVerificationResult> => {
  if (typeof window === 'undefined') {
    throw new Error('Razorpay checkout can only run in the browser');
  }

  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  if (!keyId) {
    throw new Error('NEXT_PUBLIC_RAZORPAY_KEY_ID is missing');
  }

  await loadRazorpayScript();

  const response = await api.post('/payments/orders', payload);
  const order = response.data?.data ?? response.data;
  if (!order?.razorpayOrderId) {
    throw new Error('Payment order could not be created');
  }

  return new Promise<RazorpayVerificationResult>((resolve, reject) => {
    const RazorpayCtor = window.Razorpay;
    if (!RazorpayCtor) {
      reject(new Error('Razorpay checkout could not be initialized'));
      return;
    }

    const razorpay = new RazorpayCtor({
      key: keyId,
      amount: Math.round(Number(order.amount || payload.amount) * 100),
      currency: order.currency || payload.currency || 'INR',
      name: 'K-CUBE',
      description: payload.description || 'K-CUBE payment',
      order_id: order.razorpayOrderId,
      prefill: {
        email: payload.customerEmail || undefined,
        contact: payload.customerPhone || undefined,
      },
      notes: order.notes || payload.notes || {},
      theme: {
        color: '#131921',
      },
      modal: {
        ondismiss: () => reject(new Error('Payment was cancelled')),
      },
      handler: async (responsePayload: RazorpayResponsePayload) => {
        try {
          const verifyResponse = await api.post('/payments/verify', {
            paymentOrderId: order.paymentOrderId,
            razorpayOrderId: responsePayload.razorpay_order_id,
            razorpayPaymentId: responsePayload.razorpay_payment_id,
            razorpaySignature: responsePayload.razorpay_signature,
          });
          resolve(verifyResponse.data?.data ?? verifyResponse.data);
        } catch (error) {
          reject(error);
        }
      },
    });

    razorpay.on('payment.failed', () => {
      reject(new Error('Payment failed or was cancelled'));
    });

    razorpay.open();
  });
};
