import { useEffect, useMemo, useState } from 'react';
import { Loader2, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const emptyForm = {
  name: '',
  email: '',
  password: '',
};

function AuthModal({ initialMode = 'login', isOpen, onClose }) {
  const [mode, setMode] = useState(initialMode);
  const [form, setForm] = useState(emptyForm);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { logIn, resetPassword, signUp } = useAuth();

  const isSignup = mode === 'signup';

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setForm(emptyForm);
      setStatusMessage('');
      setErrorMessage('');
    }
  }, [initialMode, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const title = useMemo(
    () => (isSignup ? 'Create your Deload account' : 'Welcome back to Deload'),
    [isSignup],
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setStatusMessage('');
    setErrorMessage('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatusMessage('');
    setErrorMessage('');

    try {
      if (isSignup) {
        await signUp(form);
      } else {
        await logIn(form);
      }

      onClose();
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };



  const handlePasswordReset = async () => {
    if (!form.email) {
      setErrorMessage('Enter your email first, then request a reset link.');
      return;
    }

    setIsSubmitting(true);
    setStatusMessage('');
    setErrorMessage('');

    try {
      await resetPassword(form.email);
      setStatusMessage('Password reset email sent.');
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="modal-scrim fixed inset-0 z-[100] flex items-center justify-center px-5 py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="relative w-full max-w-xl bg-white p-6 shadow-subtle sm:p-9">
        <button
          type="button"
          className="absolute right-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-[4px] border border-grey-light text-black hover:bg-grey-light"
          aria-label="Close authentication dialog"
          onClick={onClose}
        >
          <X size={20} aria-hidden="true" />
        </button>

        <p className="eyebrow mb-4">{isSignup ? 'Sign up' : 'Login'}</p>
        <h2 id="auth-modal-title" className="pr-12 font-serif text-4xl font-semibold leading-tight">
          {title}
        </h2>
        <p className="mt-4 leading-7 text-taupe">
          {isSignup
            ? 'Create an email and password account.'
            : 'Use the email and password connected to your Deload Analytics account.'}
        </p>



        <form className="grid gap-4" onSubmit={handleSubmit}>
          {isSignup && (
            <label className="grid gap-2 text-sm font-semibold text-black">
              Full name
              <input
                className="min-h-12 border border-grey-light px-4 text-base font-normal text-black outline-none transition focus:border-black"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
                placeholder="Your name"
              />
            </label>
          )}

          <label className="grid gap-2 text-sm font-semibold text-black">
            Email
            <input
              className="min-h-12 border border-grey-light px-4 text-base font-normal text-black outline-none transition focus:border-black"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              placeholder="you@company.com"
              required
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-black">
            Password
            <input
              className="min-h-12 border border-grey-light px-4 text-base font-normal text-black outline-none transition focus:border-black"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              autoComplete={isSignup ? 'new-password' : 'current-password'}
              placeholder="At least 6 characters"
              minLength={6}
              required
            />
          </label>

          {errorMessage && (
            <p className="notice-error border border-blush px-4 py-3 text-sm leading-6 text-black">
              {errorMessage}
            </p>
          )}

          {statusMessage && (
            <p className="border border-grey-light bg-grey-light px-4 py-3 text-sm leading-6 text-black">
              {statusMessage}
            </p>
          )}

          <button type="submit" className="primary-button mt-2 w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 animate-spin" size={18} aria-hidden="true" />}
            {isSignup ? 'Create Account' : 'Login'}
          </button>
        </form>

        <div className="mt-6 flex flex-col gap-3 text-sm text-taupe sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            className="text-left font-semibold text-black hover:text-taupe"
            onClick={() => switchMode(isSignup ? 'login' : 'signup')}
          >
            {isSignup ? 'Already have an account? Login' : 'Need an account? Sign up'}
          </button>

          {!isSignup && (
            <button
              type="button"
              className="text-left font-semibold text-black hover:text-taupe"
              onClick={handlePasswordReset}
              disabled={isSubmitting}
            >
              Forgot password?
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
