import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useOpenRouterConfig } from '../hooks/useOpenRouterConfig';
import type { OpenRouterConfigUpdate } from '../types';

interface FormState {
  model: string;
  apiKey: string;
}

function OpenRouterSettings() {
  const { config, isLoading, isSaving, updateConfig, isError, error } = useOpenRouterConfig();
  const [formState, setFormState] = useState<FormState>({
    model: '',
    apiKey: ''
  });
  const [clearApiKey, setClearApiKey] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusVariant, setStatusVariant] = useState<'success' | 'error' | 'info'>('info');

  useEffect(() => {
    if (config) {
      setFormState({
        model: config.model,
        apiKey: ''
      });
      setClearApiKey(false);
      setStatusMessage(null);
    }
  }, [config]);

  const handleChange = (field: keyof FormState) => (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setFormState((previous) => ({
      ...previous,
      [field]: value
    }));
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatusMessage(null);

    const payload: OpenRouterConfigUpdate = {
      model: formState.model.trim()
    };

    if (!payload.model) {
      setStatusVariant('error');
      setStatusMessage('Model is required.');
      return;
    }

    if (clearApiKey) {
      payload.clearApiKey = true;
    } else if (formState.apiKey.trim()) {
      payload.apiKey = formState.apiKey.trim();
    }

    try {
      await updateConfig(payload);
      setStatusVariant('success');
      setStatusMessage('OpenRouter settings saved.');
      setFormState((previous) => ({ ...previous, apiKey: '' }));
      setClearApiKey(false);
    } catch (saveError) {
      console.error(saveError);
      setStatusVariant('error');
      setStatusMessage('Unable to save settings. Please try again.');
    }
  }

  return (
    <section className="flex w-full max-w-xl flex-col gap-2 rounded-md border border-slate-800 bg-slate-950/80 px-3 py-2 text-xs shadow-sm">
      <header className="flex items-center justify-between gap-3">
        <span className="font-semibold uppercase tracking-wide text-slate-300">OpenRouter</span>
        {isLoading && <span className="text-[11px] text-amber-400">Loading…</span>}
      </header>
      {isError && (
        <p className="rounded-sm border border-rose-500/40 bg-rose-500/10 px-2 py-1 text-[11px] text-rose-100">
          {error instanceof Error ? error.message : 'Unable to load configuration.'}
        </p>
      )}
      <form className="flex flex-wrap items-end gap-2" onSubmit={handleSubmit}>
        <label className="flex min-w-[10rem] flex-1 flex-col gap-1">
          <span className="text-[10px] font-medium uppercase tracking-wide text-slate-500">Model</span>
          <input
            type="text"
            value={formState.model}
            onChange={handleChange('model')}
            className="w-full rounded-md border border-slate-800 bg-slate-950 px-2 py-1.5 text-xs text-slate-100 focus:border-amber-400 focus:outline-none"
            placeholder="openrouter/llama-3.1-70b-instruct"
            required
          />
        </label>
        <label className="flex min-w-[10rem] flex-1 flex-col gap-1">
          <span className="text-[10px] font-medium uppercase tracking-wide text-slate-500">API Key</span>
          <input
            type="password"
            value={formState.apiKey}
            onChange={handleChange('apiKey')}
            className="w-full rounded-md border border-slate-800 bg-slate-950 px-2 py-1.5 text-xs text-slate-100 focus:border-amber-400 focus:outline-none"
            placeholder={config?.hasApiKey ? '•••••••••••••••••' : 'sk-or-v1-...'}
          />
          {config?.hasApiKey ? (
            <label className="flex items-center gap-1 text-[10px] text-slate-500">
              <input
                type="checkbox"
                checked={clearApiKey}
                onChange={(event) => setClearApiKey(event.target.checked)}
                className="h-3 w-3 rounded border-slate-600 bg-slate-950 text-amber-400 focus:ring-amber-500"
              />
              <span>Clear stored API key</span>
            </label>
          ) : (
            <p className="text-[10px] text-slate-500">Enter an OpenRouter key to create new roundtables.</p>
          )}
        </label>
        <div className="flex w-full max-w-[7.5rem] flex-col gap-1">
          <button
            type="submit"
            className="w-full rounded-md bg-amber-500 px-2 py-1.5 text-xs font-semibold text-slate-950 hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-300 disabled:cursor-not-allowed disabled:bg-amber-700/50"
            disabled={isSaving || isLoading}
          >
            {isSaving ? 'Saving…' : 'Save'}
          </button>
          {statusMessage && (
            <span
              className={`rounded-sm border px-2 py-1 text-center text-[10px] ${
                statusVariant === 'success'
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
                  : statusVariant === 'error'
                  ? 'border-rose-500/40 bg-rose-500/10 text-rose-100'
                  : 'border-slate-700 bg-slate-900/70 text-slate-300'
              }`}
            >
              {statusMessage}
            </span>
          )}
        </div>
      </form>
    </section>
  );
}

export default OpenRouterSettings;
