import type { ConversationSummary } from '../types';

interface ConversationPaneProps {
  activeConversation?: ConversationSummary;
  isLoading: boolean;
}

function ConversationPane({ activeConversation, isLoading }: ConversationPaneProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-6">
        <p className="text-sm text-slate-400">Loading conversation…</p>
      </div>
    );
  }

  if (!activeConversation) {
    return (
      <div className="rounded-lg border border-dashed border-slate-700 bg-slate-900/40 p-6 text-slate-400">
        <p className="text-sm font-medium text-slate-300">No conversation selected.</p>
        <p className="text-sm">Create a new roundtable to start exploring ideas.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-lg border border-slate-800 bg-slate-900/80 p-6">
      <header className="border-b border-slate-800 pb-4">
        <h2 className="text-xl font-semibold text-amber-200">{activeConversation.topic}</h2>
        <p className="text-sm text-slate-400">{activeConversation.summary}</p>
      </header>
      <section className="mt-4 flex-1 space-y-3 overflow-auto">
        {activeConversation.messages.map((message) => (
          <article
            key={message.id}
            className="rounded-md border border-slate-800 bg-slate-900/80 p-3"
          >
            <header className="mb-2 flex items-center justify-between text-xs uppercase tracking-wide text-slate-500">
              <span>{message.author}</span>
              <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
            </header>
            <p className="whitespace-pre-line text-sm leading-relaxed text-slate-200">
              {message.content}
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}

export default ConversationPane;
