import { useState } from 'react';
import { X, Moon, Sun, User, Clock, FileSpreadsheet } from 'lucide-react';

const MOCK_PROJECTS = [
  { id: '1', name: 'Q3 Revenue Analysis', timestamp: 'Edited 2 hours ago' },
  { id: '2', name: 'Customer Churn Review', timestamp: 'Edited 1 day ago' },
  { id: '3', name: 'Marketing ROI 2026', timestamp: 'Edited 3 days ago' },
];

export default function SettingsModal({ onClose, onOpenProject }) {
  const [activeTab, setActiveTab] = useState('appearance');
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
  
  // Mock User State
  const [profile, setProfile] = useState({
    name: 'Jane Doe',
    company: 'Acme Corp',
    email: 'jane@acmecorp.com'
  });
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-scrim backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl h-[600px] flex overflow-hidden transform transition-all relative">
        
        {/* Sidebar */}
        <div className="w-48 bg-gray-50 border-r border-gray-200 p-4 flex flex-col space-y-2">
          <h2 className="font-serif text-xl font-semibold mb-4 px-2">Settings</h2>
          
          <button 
            onClick={() => setActiveTab('appearance')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'appearance' ? 'bg-gray-200 text-black' : 'text-taupe hover:bg-gray-100 hover:text-black'}`}
          >
            <Sun className="w-4 h-4" />
            <span>Appearance</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'profile' ? 'bg-gray-200 text-black' : 'text-taupe hover:bg-gray-100 hover:text-black'}`}
          >
            <User className="w-4 h-4" />
            <span>Profile</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('history')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'history' ? 'bg-gray-200 text-black' : 'text-taupe hover:bg-gray-100 hover:text-black'}`}
          >
            <Clock className="w-4 h-4" />
            <span>Project History</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8 overflow-y-auto bg-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-taupe hover:text-black rounded-full hover:bg-gray-100 transition-colors"
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
                  className={`flex flex-col items-center justify-center p-6 border-2 rounded-xl transition-all ${theme === 'light' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-taupe'}`}
                >
                  <Sun className={`w-8 h-8 mb-2 ${theme === 'light' ? 'text-black' : 'text-taupe'}`} />
                  <span className={`font-medium ${theme === 'light' ? 'text-black' : 'text-taupe'}`}>Light Mode</span>
                </button>
                
                <button 
                  onClick={() => handleSetTheme('dark')}
                  className={`flex flex-col items-center justify-center p-6 border-2 rounded-xl transition-all ${theme === 'dark' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-taupe'}`}
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
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:border-taupe text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Company</label>
                  <input 
                    type="text" 
                    value={profile.company}
                    onChange={(e) => setProfile({...profile, company: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:border-taupe text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Email Address</label>
                  <input 
                    type="email" 
                    value={profile.email}
                    disabled
                    className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-md text-taupe text-sm cursor-not-allowed"
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

          {activeTab === 'history' && (
            <div className="animate-in fade-in duration-300 flex flex-col h-full">
              <h3 className="text-xl font-semibold mb-6">Project History</h3>
              <div className="space-y-3 overflow-y-auto pr-2 pb-20">
                {MOCK_PROJECTS.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => {
                      onClose();
                      onOpenProject(project);
                    }}
                    className="flex items-center w-full p-4 border border-gray-200 rounded-xl hover:border-black hover:shadow-sm transition-all duration-300 text-left bg-white group"
                  >
                    <div className="p-2 bg-blush/20 rounded-md mr-4 group-hover:bg-blush/40 transition-colors">
                      <FileSpreadsheet className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <h4 className="font-medium text-black truncate">{project.name}</h4>
                      <p className="text-xs text-taupe">{project.timestamp}</p>
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
