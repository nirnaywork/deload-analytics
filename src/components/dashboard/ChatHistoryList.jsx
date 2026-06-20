import { MessageSquare, ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { useState } from 'react';

const MOCK_SESSIONS = [
  { id: '1', title: 'Q3 Revenue Analysis', timestamp: '2 hours ago' },
  { id: '2', title: 'Customer Churn Review', timestamp: '1 day ago' },
  { id: '3', title: 'Marketing ROI 2026', timestamp: '3 days ago' },
  { id: '4', title: 'Product Engagement Stats', timestamp: '1 week ago' },
];

export default function ChatHistoryList() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSession, setActiveSession] = useState('1');

  return (
    <div className="border-b border-grey-light">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-grey-light transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-2 overflow-hidden">
          {isExpanded ? <ChevronDown className="w-4 h-4 text-taupe flex-shrink-0" /> : <ChevronRight className="w-4 h-4 text-taupe flex-shrink-0" />}
          <span className="font-semibold text-sm text-black truncate">
            {isExpanded ? 'Chat History' : MOCK_SESSIONS.find(s => s.id === activeSession)?.title || 'New Session'}
          </span>
        </div>
        {!isExpanded && <MessageSquare className="w-4 h-4 text-taupe flex-shrink-0" />}
      </div>

      {isExpanded && (
        <div className="px-2 pb-4 max-h-64 overflow-y-auto">
          <button className="flex items-center space-x-2 w-full p-2 mb-2 rounded-md hover:bg-grey-light text-sm font-medium transition-colors text-black">
            <Plus className="w-4 h-4" />
            <span>New Chat</span>
          </button>
          
          <div className="space-y-1">
            {MOCK_SESSIONS.map((session) => (
              <button
                key={session.id}
                onClick={() => {
                  setActiveSession(session.id);
                  setIsExpanded(false);
                }}
                className={`flex flex-col items-start w-full p-2 rounded-md transition-colors text-left ${
                  activeSession === session.id ? 'bg-blush/30' : 'hover:bg-grey-light'
                }`}
              >
                <span className={`text-sm truncate w-full ${activeSession === session.id ? 'font-medium text-black' : 'text-taupe'}`}>
                  {session.title}
                </span>
                <span className="text-xs text-taupe mt-0.5">{session.timestamp}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
