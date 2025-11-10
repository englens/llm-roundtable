import type { ReactNode } from 'react';
import type { ConversationSummary } from '../types';

interface LayoutProps {
  conversations: ConversationSummary[];
  activeConversation?: ConversationSummary;
  isLoading: boolean;
  children: ReactNode;
}

function Layout({ conversations, activeConversation, isLoading, children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900 px-6 py-4">
        <h1 className="text-2xl font-semibold tracking-tight">LLM Roundtable</h1>
        <p className="text-sm text-slate-400">
          Coordinate multiple specialized LLM agents in a shared workspace.
        </p>
      </header>
      <main className="grid gap-4 p-6 lg:grid-cols-[320px_1fr]">
        <aside className="space-y-4 rounded-lg border border-slate-800 bg-slate-900/60 p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Conversations</h2>
            {isLoading ? (
              <span className="text-xs text-amber-400">Loading…</span>
            ) : (
              <span className="text-xs text-slate-500">{conversations.length} open</span>
            )}
          </div>
          <ul className="space-y-2 text-sm">
            {conversations.map((conversation) => (
              <li
                key={conversation.id}
                className={`rounded-md border px-3 py-2 transition ${
                  conversation.id === activeConversation?.id
                    ? 'border-amber-400/60 bg-amber-400/10 text-amber-200'
                    : 'border-transparent bg-slate-900/40 hover:bg-slate-800/60'
                }`}
              >
                <p className="font-medium">{conversation.topic}</p>
                <p className="text-xs text-slate-400">
                  {conversation.updatedAt ? new Date(conversation.updatedAt).toLocaleString() : 'New conversation'}
                </p>
              </li>
            ))}
            {!conversations.length && !isLoading && (
              <li className="rounded-md border border-dashed border-slate-700 px-3 py-4 text-center text-slate-500">
                No conversations yet.
              </li>
            )}
          </ul>
        </aside>
        <section className="grid gap-4 lg:grid-cols-2">{children}</section>
      </main>
    </div>
  );
}

export default Layout;
