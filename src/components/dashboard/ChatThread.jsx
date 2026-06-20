import { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';

export default function ChatThread({ messages, isThinking }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      {messages.length === 0 ? (
        <div className="h-full flex items-center justify-center text-taupe text-sm text-center px-4">
          Ask a question about your data to start the conversation.
        </div>
      ) : (
        messages.map((msg) => (
          <div key={msg.id} className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                msg.sender === 'user'
                  ? 'bg-black text-white rounded-tr-sm'
                  : 'bg-white text-black border border-taupe/30 rounded-tl-sm shadow-sm'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))
      )}
      
      {isThinking && (
        <div className="flex w-full justify-start">
          <div className="bg-white border border-taupe/30 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center space-x-2">
            <Loader2 className="w-4 h-4 text-taupe animate-spin" />
            <span className="text-xs text-taupe font-medium">AI is thinking...</span>
          </div>
        </div>
      )}
      
      <div ref={bottomRef} className="h-1" />
    </div>
  );
}
