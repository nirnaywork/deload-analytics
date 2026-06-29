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
      endpoint: 'http://127.0.0.1:11434/api/generate',
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
        const { data: newThread, error: threadError } = await supabase
          .from('chat_threads')
          .insert({
            project_id: project.id,
            user_id: currentUser.id,
            title: 'General Analysis'
          })
          .select()
          .single();
          
        if (threadError) {
          console.error('Failed to create thread:', threadError);
          setMessages([{ id: 'error', sender: 'ai', message_text: `Database Error: Ensure RLS policies are added for chat_threads, chat_messages, and generated_outputs. (${threadError.message})` }]);
          return;
        }
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

      if (!response.ok) {
        let errMsg = 'Failed to generate initial insights';
        try {
          const errData = await response.json();
          errMsg = errData.error || errMsg;
        } catch(e) {}
        throw new Error(errMsg);
      }
      const aiData = await response.json();

      // Save initial system message and output
      const { data: sysMessage, error: sysMsgError } = await supabase
        .from('chat_messages')
        .insert({
          thread_id: threadId,
          user_id: currentUser.id,
          sender: 'ai',
          message_text: "I've analyzed your dataset and generated an initial overview."
        })
        .select()
        .single();
        
      if (sysMsgError) throw new Error(`Database error saving message: ${sysMsgError.message}`);

      const { data: sysOutput, error: sysOutError } = await supabase
        .from('generated_outputs')
        .insert({
          message_id: sysMessage.id,
          user_id: currentUser.id,
          type: 'text',
          insight: JSON.stringify(aiData), // Store the structured AI JSON here
          chart_data: project.schema_summary // pass schema for Recharts
        })
        .select()
        .single();

      if (sysOutError) throw new Error(`Database error saving output: ${sysOutError.message}. Did you add RLS to generated_outputs?`);

      setMessages(prev => [...prev, sysMessage]);
      setOutputs(prev => [...prev, sysOutput]);

    } catch (error) {
      console.error('Insight generation error:', error);
      const errMsg = { id: Date.now().toString(), sender: 'ai', message_text: `System Error: ${error.message}. Is Ollama running and the qwen3:14b model installed?` };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleSendMessage = useCallback(async (text) => {
    if (!text.trim() || !activeThreadId) return;

    // 1. Save user message
    const { data: userMsg, error: userMsgError } = await supabase
      .from('chat_messages')
      .insert({
        thread_id: activeThreadId,
        user_id: currentUser.id,
        sender: 'user',
        message_text: text
      })
      .select()
      .single();
      
    if (userMsgError) {
      setMessages(prev => [...prev, { id: Date.now(), sender: 'ai', message_text: `Failed to save message: ${userMsgError.message}` }]);
      return;
    }

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

      if (!response.ok) {
        let errMsg = 'Failed to get AI response';
        try {
          const errData = await response.json();
          errMsg = errData.error || errMsg;
        } catch(e) {}
        throw new Error(errMsg);
      }
      const aiData = await response.json();

      // 3. Save AI message and output
      const { data: aiMsg, error: aiMsgError } = await supabase
        .from('chat_messages')
        .insert({
          thread_id: activeThreadId,
          user_id: currentUser.id,
          sender: 'ai',
          message_text: `Here is the analysis for: "${text}"`
        })
        .select()
        .single();
        
      if (aiMsgError) throw new Error(`Failed to save AI message: ${aiMsgError.message}`);

      const { data: aiOutput, error: aiOutError } = await supabase
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
        
      if (aiOutError) throw new Error(`Database error saving AI output: ${aiOutError.message}`);

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
