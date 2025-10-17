import { Ollama } from "ollama";

export interface OllamaMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export class OllamaService {
  private ollama: Ollama;
  private model = "deepseek-v3.1:671b-cloud";

  constructor(apiKey: string) {
    this.ollama = new Ollama({
      host: "https://ollama.com",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
  }

  async chat(messages: OllamaMessage[]): Promise<string> {
    try {
      const response = await this.ollama.chat({
        model: this.model,
        messages: messages,
        stream: false,
      });

      return response.message.content;
    } catch (error) {
      console.error("Ollama chat error:", error);
      throw error;
    }
  }

  async streamChat(
    messages: OllamaMessage[],
    onChunk: (text: string) => void,
    onComplete: () => void,
    onError: (error: Error) => void
  ): Promise<void> {
    try {
      const response = await this.ollama.chat({
        model: this.model,
        messages: messages,
        stream: true,
      });

      for await (const part of response) {
        if (part.message?.content) {
          onChunk(part.message.content);
        }
      }

      onComplete();
    } catch (error) {
      onError(error as Error);
    }
  }
}
