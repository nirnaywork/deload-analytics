import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function OnboardingModal({ onComplete }) {
  const { currentUser } = useAuth();
  const [form, setForm] = useState({ company: '', description: '', location: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const { error: dbError } = await supabase
        .from('profiles')
        .update({
          company: form.company,
          description: form.description,
          location: form.location
        })
        .eq('id', currentUser.id);

      if (dbError) throw new Error(dbError.message);
      
      onComplete(form.company); // Pass company name back
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl p-8">
        <h2 className="font-serif text-3xl font-semibold mb-2">Welcome to Deload</h2>
        <p className="text-taupe mb-8">Let's set up your profile so we can tailor your analytics experience.</p>
        
        <form onSubmit={handleSubmit} className="grid gap-5">
          <label className="grid gap-2 text-sm font-semibold text-black">
            Company Name *
            <input
              type="text"
              name="company"
              required
              value={form.company}
              onChange={handleChange}
              placeholder="Acme Corp"
              className="min-h-12 border border-grey-light px-4 text-base font-normal rounded-md focus:outline-none focus:border-black"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-black">
            What does your company do? *
            <textarea
              name="description"
              required
              value={form.description}
              onChange={handleChange}
              placeholder="We sell premium widgets..."
              className="min-h-[80px] border border-grey-light p-4 text-base font-normal rounded-md focus:outline-none focus:border-black resize-none"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-black">
            Location (Optional)
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="San Francisco, CA"
              className="min-h-12 border border-grey-light px-4 text-base font-normal rounded-md focus:outline-none focus:border-black"
            />
          </label>

          {error && <p className="text-blush text-sm mt-2">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="primary-button mt-4 w-full"
          >
            {isSubmitting ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Complete Setup'}
          </button>
        </form>
      </div>
    </div>
  );
}
