/**
 * Chat API utilities
 */

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface StreamOptions {
  messages: ChatMessage[];
  model?: string;
  onChunk?: (chunk: string) => void;
  onComplete?: (fullResponse: string) => void;
  onError?: (error: Error) => void;
}

/**
 * Send a chat message and handle streaming response
 */
export async function sendChatMessage({
  messages,
  model = 'auto',
  onChunk,
  onComplete,
  onError,
}: StreamOptions): Promise<void> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        model,
      }),
    });

    if (!response.ok) {
      // Try to get detailed error message from response
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch {
        // If JSON parsing fails, use default error
      }
      throw new Error(errorMessage);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No reader available');
    }

    const decoder = new TextDecoder();
    let fullResponse = '';

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      const chunk = decoder.decode(value, { stream: true });
      fullResponse += chunk;

      if (onChunk) {
        onChunk(chunk);
      }
    }

    if (onComplete) {
      onComplete(fullResponse);
    }
  } catch (error) {
    console.error('Chat error:', error);
    if (onError) {
      onError(error as Error);
    }
  }
}
