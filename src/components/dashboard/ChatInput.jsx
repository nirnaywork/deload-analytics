import { useState } from 'react';
import { Send } from 'lucide-react';

export default function ChatInput({ onSubmit, disabled }) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() && !disabled) {
      onSubmit(inputValue);
      setInputValue('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="p-4 bg-white border-t border-gray-200">
      <form onSubmit={handleSubmit} className="relative">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about your data..."
          disabled={disabled}
          rows={1}
          className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:border-taupe focus:ring-1 focus:ring-taupe text-sm resize-none disabled:opacity-50 disabled:cursor-not-allowed text-black"
          style={{ minHeight: '46px', maxHeight: '120px' }}
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || disabled}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md text-taupe hover:text-black hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-taupe transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
      <div className="text-center mt-2">
        <span className="text-[10px] text-taupe">AI can make mistakes. Verify important data.</span>
      </div>
    </div>
  );
}
