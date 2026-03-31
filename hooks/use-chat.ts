"use client";

import { useRef, useState } from "react";
import type {
  ChatCompletionChunk,
  ChatCompletionMessageParam,
  CompletionUsage,
  MLCEngineInterface
} from "@mlc-ai/web-llm";

import { createId } from "@/lib/utils";

export type ChatRole = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: Date;
}

const SYSTEM_MESSAGE: ChatMessage = {
  id: "system-message",
  role: "system",
  content:
    "You are a helpful, friendly AI assistant running locally in the user's browser. Be concise and helpful.",
  timestamp: new Date()
};

const INITIAL_MESSAGES = [SYSTEM_MESSAGE];

function toApiMessages(messages: ChatMessage[]): ChatCompletionMessageParam[] {
  return messages.map((message) => ({
    role: message.role,
    content: message.content
  })) as ChatCompletionMessageParam[];
}

export function useChat(engine: MLCEngineInterface | null) {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [isGenerating, setIsGenerating] = useState(false);
  const [tokensPerSecond, setTokensPerSecond] = useState(0);
  const [usage, setUsage] = useState<CompletionUsage | null>(null);
  const messagesRef = useRef<ChatMessage[]>(INITIAL_MESSAGES);

  const updateMessages = (updater: (prev: ChatMessage[]) => ChatMessage[]) => {
    setMessages((prev) => {
      const next = updater(prev);
      messagesRef.current = next;
      return next;
    });
  };

  const resetChat = async () => {
    setTokensPerSecond(0);
    setUsage(null);
    if (engine) {
      await engine.resetChat();
    }
    messagesRef.current = INITIAL_MESSAGES;
    setMessages(INITIAL_MESSAGES);
  };

  const sendMessage = async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed || !engine || isGenerating) {
      return;
    }

    const userMessage: ChatMessage = {
      id: createId(),
      role: "user",
      content: trimmed,
      timestamp: new Date()
    };

    const assistantMessageId = createId();
    const assistantMessage: ChatMessage = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      timestamp: new Date()
    };

    const nextConversation = [...messagesRef.current, userMessage];
    updateMessages((prev) => [...prev, userMessage, assistantMessage]);
    setIsGenerating(true);

    const startedAt = performance.now();
    let lastUsage: CompletionUsage | null = null;

    try {
      const stream = await engine.chat.completions.create({
        messages: toApiMessages(nextConversation),
        stream: true,
        stream_options: { include_usage: true }
      });

      for await (const chunk of stream as AsyncIterable<ChatCompletionChunk>) {
        const delta = chunk.choices[0]?.delta?.content || "";
        if (delta) {
          updateMessages((prev) =>
            prev.map((message) =>
              message.id === assistantMessageId
                ? { ...message, content: message.content + delta }
                : message
            )
          );
        }

        if (chunk.usage) {
          lastUsage = chunk.usage;
        }
      }

      if (lastUsage) {
        const elapsedSeconds = Math.max((performance.now() - startedAt) / 1000, 0.001);
        const computedTokensPerSecond = lastUsage.completion_tokens / elapsedSeconds;
        setUsage(lastUsage);
        setTokensPerSecond(Number.isFinite(computedTokensPerSecond) ? computedTokensPerSecond : 0);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return { messages, sendMessage, isGenerating, tokensPerSecond, resetChat, usage };
}
