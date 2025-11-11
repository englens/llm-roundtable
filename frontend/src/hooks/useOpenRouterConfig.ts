import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/apiClient';
import type { OpenRouterConfig, OpenRouterConfigUpdate } from '../types';

export function useOpenRouterConfig() {
  const queryClient = useQueryClient();

  const query = useQuery<OpenRouterConfig>({
    queryKey: ['openrouter-config'],
    queryFn: apiClient.fetchOpenRouterConfig
  });

  const mutation = useMutation({
    mutationFn: (payload: OpenRouterConfigUpdate) => apiClient.updateOpenRouterConfig(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(['openrouter-config'], data);
    }
  });

  return {
    config: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refresh: query.refetch,
    updateConfig: mutation.mutateAsync,
    isSaving: mutation.isPending
  };
}
