import { Home, Settings, LogOut } from 'lucide-react';
import { useState } from 'react';

export default function NavigationRail({ onNavigateHome, onOpenSettings, onLogout }) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  return (
    <>
      <div className="w-[70px] h-full bg-[#111111] flex flex-col items-center py-6 border-r border-gray-800 shrink-0 z-20 relative">
        <div className="flex flex-col space-y-6 flex-1 w-full items-center">
          <button
            onClick={onNavigateHome}
            className="w-12 h-12 rounded-xl flex items-center justify-center text-taupe hover:text-white hover:bg-white/10 transition-colors group relative"
          >
            <Home className="w-6 h-6" />
            <div className="absolute left-14 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity">
              Dashboard Home
            </div>
          </button>
        </div>

        <div className="flex flex-col space-y-6 w-full items-center mt-auto">
          <button
            onClick={onOpenSettings}
            className="w-12 h-12 rounded-xl flex items-center justify-center text-taupe hover:text-white hover:bg-white/10 transition-colors group relative"
          >
            <Settings className="w-6 h-6" />
            <div className="absolute left-14 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity">
              Settings
            </div>
          </button>

          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-12 h-12 rounded-xl flex items-center justify-center text-taupe hover:text-white hover:bg-white/10 transition-colors group relative"
          >
            <LogOut className="w-6 h-6" />
            <div className="absolute left-14 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity">
              Log Out
            </div>
          </button>
        </div>
      </div>

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-scrim backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 transform transition-all text-center">
            <h3 className="font-serif text-2xl font-semibold mb-2">Log Out</h3>
            <p className="text-taupe mb-6 text-sm">Are you sure you want to log out of Deload Analytics?</p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 secondary-button"
              >
                Cancel
              </button>
              <button
                onClick={onLogout}
                className="flex-1 primary-button bg-red-600 hover:bg-red-700 text-white border-none"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
