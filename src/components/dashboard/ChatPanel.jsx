import ChatHistoryList from './ChatHistoryList';
import ChatThread from './ChatThread';
import ChatInput from './ChatInput';

export default function ChatPanel({ messages, isThinking, onSendMessage }) {
  return (
    <div className="w-full md:w-[30%] h-full bg-[var(--color-grey-light)] border-l border-grey-light flex flex-col">
      <ChatHistoryList />
      <ChatThread messages={messages} isThinking={isThinking} />
      <ChatInput onSubmit={onSendMessage} disabled={isThinking} />
    </div>
  );
}
