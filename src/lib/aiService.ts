import { findAnswer } from '../knowledgeBase';

export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

export interface AIResponse {
  text: string;
  source: 'local' | 'remote';
}

const FALLBACK_NOT_FOUND =
  "I don't have a specific answer for that yet. You might find it on the Science or Programs pages, or I can take you to the Enquiry form so our team can help directly.";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

function getEdgeFunctionUrl(): string | null {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  return `${supabaseUrl}/functions/v1/ai-chat`;
}

/**
 * Attempts to get an AI response from the secure server-side edge function.
 * If the endpoint is not configured, the service is unavailable, or the
 * request fails, falls back to the local knowledge base — without
 * pretending a live AI model is connected.
 */
export async function getAIResponse(
  query: string,
  history: ChatMessage[],
): Promise<AIResponse> {
  const endpoint = getEdgeFunctionUrl();

  if (endpoint) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${supabaseAnonKey}`,
          apikey: supabaseAnonKey,
        },
        body: JSON.stringify({ query, history }),
      });

      if (res.status === 503) {
        // AI provider not configured — fall through to local knowledge base
      } else if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      } else {
        const data = await res.json();
        if (data.text && typeof data.text === 'string') {
          return { text: data.text, source: 'remote' };
        }
        throw new Error('Invalid response shape');
      }
    } catch {
      // Fall through to local knowledge base
    }
  }

  // Local fallback — keyword-matched knowledge base
  const answer = findAnswer(query);
  return {
    text: answer ?? FALLBACK_NOT_FOUND,
    source: 'local',
  };
}
