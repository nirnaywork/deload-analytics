import { useState, useCallback, useEffect } from 'react';
import OutputPanel from './OutputPanel';
import ChatPanel from './ChatPanel';
import NavigationRail from './NavigationRail';
import SettingsModal from './SettingsModal';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

export default function ProjectWorkspace({ project, onNavigateHome, onLogout, onOpenProject }) {
  const { currentUser } = useAuth();
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState([]);
  const [outputs, setOutputs] = useState([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeThreadId, setActiveThreadId] = useState(null);

  // Configuration for AI from LocalStorage
  const getAiConfig = () => {
    const saved = localStorage.getItem('deload_ai_config');
    return saved ? JSON.parse(saved) : {
      provider: 'local',
      endpoint: 'http://localhost:11434/api/generate',
      model: 'qwen3:14b',
      apiKey: ''
    };
  };

  useEffect(() => {
    if (!project?.id || !currentUser) return;

    async function loadWorkspace() {
      // 1. Get or create a chat thread for this project
      let { data: thread } = await supabase
        .from('chat_threads')
        .select('*')
        .eq('project_id', project.id)
        .limit(1)
        .single();

      if (!thread) {
        const { data: newThread } = await supabase
          .from('chat_threads')
          .insert({
            project_id: project.id,
            user_id: currentUser.id,
            title: 'General Analysis'
          })
          .select()
          .single();
        thread = newThread;
      }
      
      setActiveThreadId(thread.id);

      // 2. Load existing messages and outputs
      const { data: existingMessages } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('thread_id', thread.id)
        .order('created_at', { ascending: true });

      const { data: existingOutputs } = await supabase
        .from('generated_outputs')
        .select('*')
        .in('message_id', existingMessages?.map(m => m.id) || [])
        .order('created_at', { ascending: true });

      setMessages(existingMessages || []);
      setOutputs(existingOutputs || []);

      // 3. If no outputs exist yet, automatically generate the initial insights
      if (!existingOutputs || existingOutputs.length === 0) {
        generateInitialInsights(thread.id);
      }
    }

    loadWorkspace();
  }, [project?.id, currentUser]);

  const generateInitialInsights = async (threadId) => {
    setIsThinking(true);
    try {
      // Call Express backend to analyze
      const response = await fetch('http://localhost:3001/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schemaSummary: project.schema_summary,
          config: getAiConfig()
        })
      });

      if (!response.ok) throw new Error('Failed to generate initial insights');
      const aiData = await response.json();

      // Save initial system message and output
      const { data: sysMessage } = await supabase
        .from('chat_messages')
        .insert({
          thread_id: threadId,
          user_id: currentUser.id,
          sender: 'ai',
          message_text: "I've analyzed your dataset and generated an initial overview."
        })
        .select()
        .single();

      const { data: sysOutput } = await supabase
        .from('generated_outputs')
        .insert({
          message_id: sysMessage.id,
          user_id: currentUser.id,
          type: 'initial-overview',
          insight: JSON.stringify(aiData), // Store the structured AI JSON here
          chart_data: project.schema_summary // pass schema for Recharts
        })
        .select()
        .single();

      setMessages(prev => [...prev, sysMessage]);
      setOutputs(prev => [...prev, sysOutput]);

    } catch (error) {
      console.error(error);
    } finally {
      setIsThinking(false);
    }
  };

  const handleSendMessage = useCallback(async (text) => {
    if (!text.trim() || !activeThreadId) return;

    // 1. Save user message
    const { data: userMsg } = await supabase
      .from('chat_messages')
      .insert({
        thread_id: activeThreadId,
        user_id: currentUser.id,
        sender: 'user',
        message_text: text
      })
      .select()
      .single();

    setMessages(prev => [...prev, userMsg]);
    setIsThinking(true);

    try {
      // 2. Call AI chat backend
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schemaSummary: project.schema_summary,
          question: text,
          config: getAiConfig()
        })
      });

      if (!response.ok) throw new Error('Failed to get AI response');
      const aiData = await response.json();

      // 3. Save AI message and output
      const { data: aiMsg } = await supabase
        .from('chat_messages')
        .insert({
          thread_id: activeThreadId,
          user_id: currentUser.id,
          sender: 'ai',
          message_text: `Here is the analysis for: "${text}"`
        })
        .select()
        .single();

      const { data: aiOutput } = await supabase
        .from('generated_outputs')
        .insert({
          message_id: aiMsg.id,
          user_id: currentUser.id,
          type: aiData.type || 'text',
          insight: aiData.insight,
          chart_data: aiData.dataPoints || null
        })
        .select()
        .single();

      setMessages(prev => [...prev, aiMsg]);
      setOutputs(prev => [...prev, aiOutput]);

    } catch (error) {
      console.error(error);
      // fallback error message
      const errMessage = { id: Date.now().toString(), sender: 'ai', message_text: 'Sorry, I encountered an error while processing that request.' };
      setMessages(prev => [...prev, errMessage]);
    } finally {
      setIsThinking(false);
    }
  }, [activeThreadId, project, currentUser]);

  const dashboardTitle = project?.companyName 
    ? `${project.companyName} — Analytics Dashboard` 
    : (project?.name || 'Untitled Project');

  return (
    <div className="flex w-full h-screen overflow-hidden bg-white font-sans text-black">
      
      <NavigationRail 
        onNavigateHome={onNavigateHome}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onLogout={onLogout}
      />

      <div className="flex-1 flex w-full h-full relative">
        <div className="absolute top-6 left-8 z-10 pointer-events-none">
          <h2 className="font-serif text-xl font-semibold text-black bg-white/80 backdrop-blur-sm px-2 py-1 rounded">
            {dashboardTitle}
          </h2>
        </div>

        <OutputPanel 
          outputs={outputs} 
          isThinking={isThinking} 
          onSuggestionClick={handleSendMessage} 
          project={project}
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
