import { useMemo } from 'react';
import Layout from './components/Layout';
import ConversationPane from './components/ConversationPane';
import GraphPane from './components/GraphPane';
import { useConversations } from './hooks/useConversations';

function App() {
  const { data, isLoading } = useConversations();
  const { conversations, activeConversation } = useMemo(() => {
    if (!data) {
      return { conversations: [], activeConversation: undefined };
    }
    return {
      conversations: data.conversations,
      activeConversation: data.conversations[0]
    };
  }, [data]);

  return (
    <Layout
      conversations={conversations}
      activeConversation={activeConversation}
      isLoading={isLoading}
    >
      <ConversationPane
        activeConversation={activeConversation}
        isLoading={isLoading}
      />
      <GraphPane conversation={activeConversation} />
    </Layout>
  );
}

export default App;
