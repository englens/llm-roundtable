import axios from 'axios';
import type { ConversationResponse } from '../types';

const client = axios.create({
  baseURL: '/api'
});

async function fetchConversations(): Promise<ConversationResponse> {
  const response = await client.get<ConversationResponse>('/conversations');
  return response.data;
}

export const apiClient = {
  fetchConversations
};
