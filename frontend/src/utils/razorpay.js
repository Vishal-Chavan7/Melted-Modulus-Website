const RAZORPAY_SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';

export const loadRazorpayScript = () =>
  new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Razorpay can only be loaded in the browser'));
      return;
    }

    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector(`script[src="${RAZORPAY_SCRIPT_URL}"]`);

    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true));
      existingScript.addEventListener('error', () => reject(new Error('Failed to load Razorpay')));
      return;
    }

    const script = document.createElement('script');
    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error('Failed to load Razorpay checkout'));
    document.body.appendChild(script);
  });

export const openRazorpayCheckout = ({
  payment,
  description,
  onSuccess,
  onDismiss,
  onFailure,
}) =>
  new Promise((resolve, reject) => {
    if (!window.Razorpay) {
      reject(new Error('Razorpay is not available'));
      return;
    }

    const razorpay = new window.Razorpay({
      key: payment.keyId,
      amount: payment.amount,
      currency: payment.currency,
      name: 'Melted Modulus',
      description: description || `Order ${payment.orderNumber}`,
      order_id: payment.razorpayOrderId,
      prefill: {
        name: payment.customer?.name || '',
        email: payment.customer?.email || '',
        contact: payment.customer?.contact || '',
      },
      theme: {
        color: '#A259FF',
      },
      handler: (response) => {
        onSuccess?.(response);
        resolve(response);
      },
      modal: {
        ondismiss: () => {
          onDismiss?.();
          reject(new Error('Payment cancelled. Your order is saved as pending payment.'));
        },
      },
    });

    razorpay.on('payment.failed', (response) => {
      onFailure?.(response);
      reject(new Error(response.error?.description || 'Payment failed. Please try again.'));
    });

    razorpay.open();
  });
