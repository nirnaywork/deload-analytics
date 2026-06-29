import { useState, useEffect } from 'react';
import { X, Moon, Sun, User, Clock, FileSpreadsheet, Settings } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

export default function SettingsModal({ onClose, onOpenProject }) {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('appearance');
  
  // Theme state
  const [theme, setTheme] = useState(() => {
    return typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  });

  const handleSetTheme = (newTheme) => {
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  // Profile state
  const [profile, setProfile] = useState({
    name: '',
    company: '',
    email: currentUser?.email || ''
  });
  const [isSaved, setIsSaved] = useState(false);

  // AI Config state
  const [aiConfig, setAiConfig] = useState(() => {
    const saved = localStorage.getItem('deload_ai_config');
    return saved ? JSON.parse(saved) : {
      provider: 'local',
      endpoint: 'http://localhost:11434/api/generate',
      model: 'qwen3:14b',
      apiKey: ''
    };
  });
  const [isAiConfigSaved, setIsAiConfigSaved] = useState(false);

  // Projects state
  const [projects, setProjects] = useState([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    
    async function loadProfile() {
      const { data } = await supabase.from('profiles').select('*').eq('id', currentUser.id).single();
      if (data) {
        setProfile({
          name: data.full_name || '',
          company: data.company || '',
          email: currentUser.email
        });
      }
    }
    
    async function loadProjects() {
      setIsLoadingProjects(true);
      const { data } = await supabase.from('projects').select('*').eq('user_id', currentUser.id).order('created_at', { ascending: false });
      if (data) setProjects(data);
      setIsLoadingProjects(false);
    }

    loadProfile();
    loadProjects();
  }, [currentUser]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    await supabase.from('profiles').update({
      full_name: profile.name,
      company: profile.company
    }).eq('id', currentUser.id);
    
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleSaveAiConfig = (e) => {
    e.preventDefault();
    localStorage.setItem('deload_ai_config', JSON.stringify(aiConfig));
    setIsAiConfigSaved(true);
    setTimeout(() => setIsAiConfigSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-scrim backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl h-[600px] flex overflow-hidden transform transition-all relative">
        
        {/* Sidebar */}
        <div className="w-56 bg-grey-light border-r border-grey-light p-4 flex flex-col space-y-2">
          <h2 className="font-serif text-xl font-semibold mb-4 px-2">Settings</h2>
          
          <button 
            onClick={() => setActiveTab('appearance')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'appearance' ? 'bg-grey-light text-black' : 'text-taupe hover:bg-grey-light hover:text-black'}`}
          >
            <Sun className="w-4 h-4" />
            <span>Appearance</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'profile' ? 'bg-grey-light text-black' : 'text-taupe hover:bg-grey-light hover:text-black'}`}
          >
            <User className="w-4 h-4" />
            <span>Profile</span>
          </button>

          <button 
            onClick={() => setActiveTab('aiConfig')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'aiConfig' ? 'bg-grey-light text-black' : 'text-taupe hover:bg-grey-light hover:text-black'}`}
          >
            <Settings className="w-4 h-4" />
            <span>AI Configuration</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('history')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'history' ? 'bg-grey-light text-black' : 'text-taupe hover:bg-grey-light hover:text-black'}`}
          >
            <Clock className="w-4 h-4" />
            <span>Project History</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8 overflow-y-auto bg-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-taupe hover:text-black rounded-full hover:bg-grey-light transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {activeTab === 'appearance' && (
            <div className="animate-in fade-in duration-300">
              <h3 className="text-xl font-semibold mb-6">Appearance</h3>
              <p className="text-sm text-taupe mb-4">Choose your preferred theme. (Mock toggle for now)</p>
              
              <div className="grid grid-cols-2 gap-4 max-w-md">
                <button 
                  onClick={() => handleSetTheme('light')}
                  className={`flex flex-col items-center justify-center p-6 border-2 rounded-xl transition-all ${theme === 'light' ? 'border-black bg-grey-light' : 'border-grey-light hover:border-taupe'}`}
                >
                  <Sun className={`w-8 h-8 mb-2 ${theme === 'light' ? 'text-black' : 'text-taupe'}`} />
                  <span className={`font-medium ${theme === 'light' ? 'text-black' : 'text-taupe'}`}>Light Mode</span>
                </button>
                
                <button 
                  onClick={() => handleSetTheme('dark')}
                  className={`flex flex-col items-center justify-center p-6 border-2 rounded-xl transition-all ${theme === 'dark' ? 'border-black bg-grey-light' : 'border-grey-light hover:border-taupe'}`}
                >
                  <Moon className={`w-8 h-8 mb-2 ${theme === 'dark' ? 'text-black' : 'text-taupe'}`} />
                  <span className={`font-medium ${theme === 'dark' ? 'text-black' : 'text-taupe'}`}>Dark Mode</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="animate-in fade-in duration-300">
              <h3 className="text-xl font-semibold mb-6">User Profile</h3>
              <form onSubmit={handleSaveProfile} className="max-w-md space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Full Name</label>
                  <input 
                    type="text" 
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    className="w-full px-4 py-2 bg-grey-light border border-grey-light rounded-md focus:outline-none focus:border-taupe text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Company</label>
                  <input 
                    type="text" 
                    value={profile.company}
                    onChange={(e) => setProfile({...profile, company: e.target.value})}
                    className="w-full px-4 py-2 bg-grey-light border border-grey-light rounded-md focus:outline-none focus:border-taupe text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Email Address</label>
                  <input 
                    type="email" 
                    value={profile.email}
                    disabled
                    className="w-full px-4 py-2 bg-grey-light border border-grey-light rounded-md text-taupe text-sm cursor-not-allowed"
                  />
                  <p className="text-xs text-taupe mt-1">Email cannot be changed here.</p>
                </div>
                <div className="pt-4 flex items-center space-x-4">
                  <button type="submit" className="primary-button !min-h-10 !py-2 !px-6">
                    Save Changes
                  </button>
                  {isSaved && <span className="text-sm text-green-600 font-medium">Saved!</span>}
                </div>
              </form>
            </div>
          )}

          {activeTab === 'aiConfig' && (
            <div className="animate-in fade-in duration-300">
              <h3 className="text-xl font-semibold mb-6">AI Configuration</h3>
              <form onSubmit={handleSaveAiConfig} className="max-w-md space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">AI Provider</label>
                  <select 
                    value={aiConfig.provider}
                    onChange={(e) => setAiConfig({...aiConfig, provider: e.target.value})}
                    className="w-full px-4 py-2 bg-white border border-grey-light rounded-md focus:outline-none focus:border-taupe text-sm"
                  >
                    <option value="local">Local Ollama</option>
                    <option value="cloud">Cloud API (Groq)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">API Endpoint</label>
                  <input 
                    type="text" 
                    value={aiConfig.endpoint}
                    onChange={(e) => setAiConfig({...aiConfig, endpoint: e.target.value})}
                    className="w-full px-4 py-2 bg-grey-light border border-grey-light rounded-md focus:outline-none focus:border-taupe text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Model Name</label>
                  <input 
                    type="text" 
                    value={aiConfig.model}
                    onChange={(e) => setAiConfig({...aiConfig, model: e.target.value})}
                    className="w-full px-4 py-2 bg-grey-light border border-grey-light rounded-md focus:outline-none focus:border-taupe text-sm"
                  />
                </div>
                {aiConfig.provider === 'cloud' && (
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">API Key</label>
                    <input 
                      type="password" 
                      value={aiConfig.apiKey}
                      onChange={(e) => setAiConfig({...aiConfig, apiKey: e.target.value})}
                      className="w-full px-4 py-2 bg-grey-light border border-grey-light rounded-md focus:outline-none focus:border-taupe text-sm"
                    />
                  </div>
                )}
                <div className="pt-4 flex items-center space-x-4">
                  <button type="submit" className="primary-button !min-h-10 !py-2 !px-6">
                    Save AI Settings
                  </button>
                  {isAiConfigSaved && <span className="text-sm text-green-600 font-medium">Saved!</span>}
                </div>
              </form>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="animate-in fade-in duration-300 flex flex-col h-full">
              <h3 className="text-xl font-semibold mb-6">Project History</h3>
              <div className="space-y-3 overflow-y-auto pr-2 pb-20">
                {isLoadingProjects ? (
                  <p className="text-taupe text-sm">Loading projects...</p>
                ) : projects.length === 0 ? (
                  <p className="text-taupe text-sm">No project history found.</p>
                ) : projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => {
                      onClose();
                      onOpenProject({ ...project, companyName: profile.company });
                    }}
                    className="flex items-center w-full p-4 border border-grey-light rounded-xl hover:border-black hover:shadow-sm transition-all duration-300 text-left bg-white group"
                  >
                    <div className="p-2 bg-blush/20 rounded-md mr-4 group-hover:bg-blush/40 transition-colors">
                      <FileSpreadsheet className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <h4 className="font-medium text-black truncate">{project.name}</h4>
                      <p className="text-xs text-taupe">{new Date(project.created_at).toLocaleDateString()}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
