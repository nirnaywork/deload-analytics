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
import DashboardHome from './components/dashboard/DashboardHome.jsx';
import ProjectWorkspace from './components/dashboard/ProjectWorkspace.jsx';

function AppContent() {
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });
  const [demoDashboard, setDemoDashboard] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const [showDashboard, setShowDashboard] = useState(true);
  const { isAuthenticated, logOut, currentUser } = useAuth();

  useScrollReveal([showDashboard]);

  const openAuthModal = (mode) => {
    setAuthModal({ isOpen: true, mode });
  };

  const closeAuthModal = () => {
    setAuthModal((current) => ({ ...current, isOpen: false }));
  };

  const handleLogout = async () => {
    if (isAuthenticated) {
      await logOut();
    }
    setDemoDashboard(false);
    setActiveProject(null);
    setShowDashboard(false);
  };

  const handleSimulateLogin = () => {
    setDemoDashboard(true);
    setShowDashboard(true);
  };

  if ((isAuthenticated || demoDashboard) && showDashboard) {
    if (activeProject) {
      return (
        <ProjectWorkspace 
          project={activeProject} 
          onNavigateHome={() => setActiveProject(null)} 
          onLogout={handleLogout}
          onOpenProject={setActiveProject}
        />
      );
    }
    return <DashboardHome 
      onOpenProject={setActiveProject} 
      onNavigateMarketing={() => setShowDashboard(false)} 
      onLogout={handleLogout}
      userEmail={currentUser?.email || 'demo@example.com'}
    />;
  }

  return (
    <div className="min-h-screen bg-white font-sans text-black">
      <Navbar 
        onOpenAuth={openAuthModal} 
        onSimulateLogin={handleSimulateLogin} 
        onGoToDashboard={() => setShowDashboard(true)}
        isDemo={demoDashboard}
      />
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
