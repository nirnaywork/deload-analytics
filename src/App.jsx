import { useState } from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Features from './components/Features.jsx';
import HowItWorks from './components/HowItWorks.jsx';
import UseCases from './components/UseCases.jsx';
import Footer from './components/Footer.jsx';
import AuthModal from './components/AuthModal.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import useScrollReveal from './hooks/useScrollReveal.js';

function App() {
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });

  useScrollReveal();

  const openAuthModal = (mode) => {
    setAuthModal({ isOpen: true, mode });
  };

  const closeAuthModal = () => {
    setAuthModal((current) => ({ ...current, isOpen: false }));
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-white font-sans text-black">
        <Navbar onOpenAuth={openAuthModal} />
        <main>
          <Hero onOpenAuth={openAuthModal} />
          <Features />
          <HowItWorks />
          <UseCases />
        </main>
        <Footer />
        <AuthModal
          initialMode={authModal.mode}
          isOpen={authModal.isOpen}
          onClose={closeAuthModal}
        />
      </div>
    </AuthProvider>
  );
}

export default App;
