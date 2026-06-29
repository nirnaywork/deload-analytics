import { useState, useEffect } from 'react';
import { Plus, FileSpreadsheet, LayoutGrid, User, LogOut, ChevronDown } from 'lucide-react';
import NewProjectModal from './NewProjectModal';
import OnboardingModal from '../OnboardingModal';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

export default function DashboardHome({ onOpenProject, onNavigateMarketing, onLogout, userEmail }) {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const [profile, setProfile] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    
    async function loadData() {
      setIsLoading(true);
      
      // Load Profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();
        
      if (profileData) {
        setProfile(profileData);
        if (!profileData.company) {
          setShowOnboarding(true);
        }
      }

      // Load Projects
      const { data: projectsData } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (projectsData) {
        setProjects(projectsData);
      }
      
      setIsLoading(false);
    }
    
    loadData();
  }, [currentUser]);

  const handleCreateProject = (projectDetails) => {
    setIsModalOpen(false);
    setProjects([projectDetails, ...projects]);
    onOpenProject({ ...projectDetails, companyName: profile?.company });
  };

  const handleOnboardingComplete = (companyName) => {
    setShowOnboarding(false);
    setProfile(prev => ({ ...prev, company: companyName }));
  };

  const openProjectWithContext = (project) => {
    onOpenProject({ ...project, companyName: profile?.company });
  };

  return (
    <div className="min-h-screen bg-white font-sans text-black flex flex-col">
      {/* Top Navigation */}
      <header className="w-full border-b border-grey-light px-6 py-4 flex items-center justify-between bg-white z-10 relative">
        <button onClick={onNavigateMarketing} className="font-serif text-xl font-semibold hover:text-taupe transition-colors">
          {profile?.company ? `${profile.company} — Analytics Dashboard` : 'Deload Analytics'}
        </button>
        <div className="relative">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center space-x-2 hover:bg-grey-light px-3 py-2 rounded-md transition-colors"
          >
            <div className="w-8 h-8 bg-grey-light rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-taupe" />
            </div>
            <span className="text-sm font-medium hidden sm:block">{userEmail}</span>
            <ChevronDown className="w-4 h-4 text-taupe" />
          </button>
          
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-grey-light rounded-md shadow-lg py-1 z-20">
              <button 
                onClick={onLogout}
                className="w-full text-left px-4 py-2 text-sm text-black hover:bg-grey-light flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center pt-16 px-6 max-w-4xl mx-auto w-full">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl font-semibold mb-3">Welcome to Deload</h1>
          <p className="text-taupe text-lg">Create a new project to start analyzing your data!</p>
        </div>

        {/* Primary Action */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full max-w-md group relative flex items-center justify-center space-x-3 p-8 border-2 border-black rounded-xl hover:bg-black transition-colors duration-300"
        >
          <div className="w-10 h-10 rounded-full bg-grey-light flex items-center justify-center group-hover:bg-taupe transition-colors">
            <Plus className="w-5 h-5 text-black group-hover:text-white" />
          </div>
          <span className="font-semibold text-lg text-black group-hover:text-white transition-colors">
            New Project
          </span>
        </button>

        {/* Recent Projects Section */}
        <div className="w-full mt-20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl font-semibold">Recent Projects</h2>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <p className="text-taupe">Loading projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="flex items-center justify-center py-16 bg-grey-light/50 rounded-xl border border-grey-light">
              <p className="text-taupe">No previous projects, try creating one.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => openProjectWithContext(project)}
                  className="flex flex-col items-start p-5 border border-grey-light rounded-xl hover:border-black hover:shadow-sm transition-all duration-300 text-left bg-white group"
                >
                  <div className="p-2 bg-blush/20 rounded-md mb-4 group-hover:bg-blush/40 transition-colors">
                    <FileSpreadsheet className="w-5 h-5 text-black" />
                  </div>
                  <h3 className="font-medium text-black mb-1 truncate w-full">{project.name}</h3>
                  <p className="text-xs text-taupe">{new Date(project.created_at).toLocaleDateString()}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <NewProjectModal
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreateProject}
        />
      )}

      {showOnboarding && (
        <OnboardingModal onComplete={handleOnboardingComplete} />
      )}
    </div>
  );
}
