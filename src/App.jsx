import { useState } from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Features from './components/Features.jsx';
import HowItWorks from './components/HowItWorks.jsx';
import UseCases from './components/UseCases.jsx';
import Footer from './components/Footer.jsx';
import AuthModal from './components/AuthModal.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import useScrollReveal from './hooks/useScrollReveal.js';
import Dashboard from './components/dashboard/Dashboard.jsx';

function AppContent() {
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });
  const [demoDashboard, setDemoDashboard] = useState(false);
  const { isAuthenticated } = useAuth();

  useScrollReveal();

  const openAuthModal = (mode) => {
    setAuthModal({ isOpen: true, mode });
  };

  const closeAuthModal = () => {
    setAuthModal((current) => ({ ...current, isOpen: false }));
  };

  if (isAuthenticated || demoDashboard) {
    return <Dashboard />;
  }

  return (
    <div className="min-h-screen bg-white font-sans text-black">
      <Navbar onOpenAuth={openAuthModal} onDemoDashboard={() => setDemoDashboard(true)} />
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
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
