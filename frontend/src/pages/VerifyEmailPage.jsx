import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { HiOutlineCheckCircle, HiOutlineXCircle } from 'react-icons/hi2';
import { authApi } from '../services/api';

export const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Verification link is invalid or missing.');
      return;
    }

    const verify = async () => {
      try {
        await authApi.verifyEmail(token);
        setStatus('success');
        setMessage('Email verified successfully. You can now sign in.');
      } catch (error) {
        setStatus('error');
        setMessage(error.message || 'Verification failed. The link may have expired.');
      }
    };

    verify();
  }, [token]);

  return (
    <section>
      <div className="container">
        <div className="account-panel account-panel--empty" style={{ maxWidth: '520px', margin: 'var(--space-12) auto' }}>
          {status === 'loading' && (
            <>
              <p className="account-loading">Verifying your email...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <HiOutlineCheckCircle size={56} color="var(--clr-success)" aria-hidden="true" />
              <h2>Email Verified</h2>
              <p>{message}</p>
              <Link to="/" className="btn btn-primary">Continue to Sign In</Link>
            </>
          )}

          {status === 'error' && (
            <>
              <HiOutlineXCircle size={56} color="var(--clr-error)" aria-hidden="true" />
              <h2>Verification Failed</h2>
              <p>{message}</p>
              <Link to="/" className="btn btn-primary">Back to Home</Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
};
