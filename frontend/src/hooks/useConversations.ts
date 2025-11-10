import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../services/apiClient';
import type { ConversationResponse } from '../types';

export function useConversations() {
  return useQuery<ConversationResponse>({
    queryKey: ['conversations'],
    queryFn: apiClient.fetchConversations
  });
}
