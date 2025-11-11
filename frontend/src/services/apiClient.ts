import axios from 'axios';
import type { ConversationResponse, OpenRouterConfig, OpenRouterConfigUpdate } from '../types';

const client = axios.create({
  baseURL: '/api'
});

async function fetchConversations(): Promise<ConversationResponse> {
  const response = await client.get<ConversationResponse>('/conversations');
  return response.data;
}

async function fetchOpenRouterConfig(): Promise<OpenRouterConfig> {
  const response = await client.get<{ config: OpenRouterConfig }>('/config/openrouter');
  return response.data.config;
}

async function updateOpenRouterConfig(payload: OpenRouterConfigUpdate): Promise<OpenRouterConfig> {
  const response = await client.put<{ config: OpenRouterConfig }>('/config/openrouter', payload);
  return response.data.config;
}

export const apiClient = {
  fetchConversations,
  fetchOpenRouterConfig,
  updateOpenRouterConfig
};
