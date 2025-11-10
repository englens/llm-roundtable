import { useMemo } from 'react';
import type { ConversationSummary } from '../types';

interface GraphPaneProps {
  conversation?: ConversationSummary;
}

function GraphPane({ conversation }: GraphPaneProps) {
  const nodes = useMemo(() => {
    if (!conversation) {
      return [];
    }

    return conversation.messages.map((message) => ({
      id: message.id,
      label: message.author,
      summary: message.content.slice(0, 120)
    }));
  }, [conversation]);

  if (!conversation) {
    return (
      <div className="rounded-lg border border-dashed border-slate-700 bg-slate-900/40 p-6 text-slate-400">
        <p className="text-sm font-medium text-slate-300">Graph preview unavailable.</p>
        <p className="text-sm">Select a conversation to explore agent interactions.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-lg border border-slate-800 bg-slate-900/80 p-6">
      <header className="border-b border-slate-800 pb-4">
        <h2 className="text-xl font-semibold text-slate-100">Interaction Graph</h2>
        <p className="text-sm text-slate-400">High-level connections between agents for this conversation.</p>
      </header>
      <section className="mt-4 grid gap-3 sm:grid-cols-2">
        {nodes.map((node) => (
          <div key={node.id} className="rounded-md border border-slate-800 bg-slate-900/80 p-3">
            <p className="text-xs uppercase tracking-wide text-amber-300">{node.label}</p>
            <p className="mt-1 text-sm text-slate-300">{node.summary}</p>
          </div>
        ))}
        {!nodes.length && (
          <p className="text-sm text-slate-500">Messages will appear here once the roundtable gets going.</p>
        )}
      </section>
    </div>
  );
}

export default GraphPane;
