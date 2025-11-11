import type { ReactNode } from 'react';
import type { ConversationSummary } from '../types';
import OpenRouterSettings from './OpenRouterSettings';

interface LayoutProps {
  conversations: ConversationSummary[];
  activeConversation?: ConversationSummary;
  isLoading: boolean;
  children: ReactNode;
}

function Layout({ conversations, activeConversation, isLoading, children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/95 px-4 py-3 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-6">
          <div className="min-w-[12rem]">
            <h1 className="text-xl font-semibold tracking-tight">LLM Roundtable</h1>
            <p className="text-xs text-slate-400">
              Coordinate specialized LLM agents in a shared workspace.
            </p>
          </div>
          <div className="flex flex-1 flex-col gap-1">
            <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-slate-500">
              <span>Conversations</span>
              {isLoading ? (
                <span className="text-amber-400">Loading…</span>
              ) : (
                <span className="text-slate-600">{conversations.length} open</span>
              )}
            </div>
            <ul className="flex w-full snap-x items-center gap-2 overflow-x-auto pb-1">
              {conversations.map((conversation) => (
                <li
                  key={conversation.id}
                  className={`snap-start rounded-full border px-3 py-1.5 text-xs transition ${
                    conversation.id === activeConversation?.id
                      ? 'border-amber-400/70 bg-amber-400/20 text-amber-100'
                      : 'border-slate-800 bg-slate-950/70 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="truncate font-medium">{conversation.topic}</span>
                    <span className="text-[10px] text-slate-500">
                      {conversation.updatedAt
                        ? new Date(conversation.updatedAt).toLocaleTimeString()
                        : 'New conversation'}
                    </span>
                  </div>
                </li>
              ))}
              {!conversations.length && !isLoading && (
                <li className="rounded-full border border-dashed border-slate-700 px-3 py-1.5 text-xs text-slate-500">
                  No conversations yet
                </li>
              )}
            </ul>
          </div>
          <OpenRouterSettings />
        </div>
      </header>
      <main className="p-4 lg:p-6">
        <section className="grid gap-4 lg:grid-cols-2">{children}</section>
      </main>
    </div>
  );
}

export default Layout;
