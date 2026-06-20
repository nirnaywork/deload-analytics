import { useState, useCallback, useEffect } from 'react';
import OutputPanel from './OutputPanel';
import ChatPanel from './ChatPanel';
import NavigationRail from './NavigationRail';
import SettingsModal from './SettingsModal';

// Utility to generate a random ID
const generateId = () => Math.random().toString(36).substr(2, 9);

export default function ProjectWorkspace({ project, onNavigateHome, onLogout, onOpenProject }) {
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState([]);
  const [outputs, setOutputs] = useState([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // To cycle through different mock output types
  const [mockIndex, setMockIndex] = useState(0);

  // Reset workspace when project changes
  useEffect(() => {
    setMessages([]);
    setOutputs([]);
    setIsThinking(false);
    setMockIndex(0);
  }, [project?.id]);

  const generateMockResponse = useCallback((question) => {
    // Cycle through: line chart -> table -> text -> bar chart
    const types = ['chart-line', 'table', 'text', 'chart-bar'];
    const currentType = types[mockIndex % types.length];
    setMockIndex(prev => prev + 1);

    const mockResponses = {
      'chart-line': {
        type: 'chart-line',
        insight: 'Revenue has seen a steady increase since April, with profit margins improving alongside.',
        data: null
      },
      'chart-bar': {
        type: 'chart-bar',
        insight: 'Product A continues to lead in sales volume, outperforming Product B by 33%.',
        data: null
      },
      'table': {
        type: 'table',
        insight: 'Here is the breakdown of active users and conversion rates by region. North America maintains the highest volume.',
        data: null
      },
      'text': {
        type: 'text',
        insight: null,
        data: 'Based on the uploaded dataset, there are no unusual spikes this quarter. The data follows the expected seasonal trend with a 5% variance, which is within normal operating limits.'
      }
    };

    const response = mockResponses[currentType];

    return {
      id: generateId(),
      question,
      ...response
    };
  }, [mockIndex]);

  const handleSendMessage = useCallback((text) => {
    const userMsg = { id: generateId(), sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setIsThinking(true);

    // Simulate network/AI delay
    setTimeout(() => {
      const result = generateMockResponse(text);
      
      const aiMsg = { 
        id: generateId(), 
        sender: 'ai', 
        text: `Here's what I found regarding "${text.substring(0, 30)}${text.length > 30 ? '...' : ''}" →` 
      };
      
      setMessages(prev => [...prev, aiMsg]);
      setOutputs(prev => [...prev, result]);
      setIsThinking(false);
    }, 2000);
  }, [generateMockResponse]);

  return (
    <div className="flex w-full h-screen overflow-hidden bg-white font-sans text-black">
      
      <NavigationRail 
        onNavigateHome={onNavigateHome}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onLogout={onLogout}
      />

      <div className="flex-1 flex w-full h-full relative">
        {/* Top-left project name overlay */}
        <div className="absolute top-6 left-8 z-10 pointer-events-none">
          <h2 className="font-serif text-xl font-semibold text-black bg-white/80 backdrop-blur-sm px-2 py-1 rounded">
            {project?.name || 'Untitled Project'}
          </h2>
        </div>

        <OutputPanel 
          outputs={outputs} 
          isThinking={isThinking} 
          onSuggestionClick={handleSendMessage} 
        />
        <ChatPanel 
          messages={messages} 
          isThinking={isThinking} 
          onSendMessage={handleSendMessage} 
        />
      </div>

      {isSettingsOpen && (
        <SettingsModal 
          onClose={() => setIsSettingsOpen(false)} 
          onOpenProject={onOpenProject}
        />
      )}
    </div>
  );
}
