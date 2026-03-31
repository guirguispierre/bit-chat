"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

import { ChatInput } from "@/components/chat-input";
import { ChatMessages } from "@/components/chat-messages";
import { LoadingScreen } from "@/components/loading-screen";
import { ModelSelector } from "@/components/model-selector";
import { PerformanceBar } from "@/components/performance-bar";
import { WebGPUCheck } from "@/components/webgpu-check";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useChat } from "@/hooks/use-chat";
import { useWebLLM } from "@/hooks/use-webllm";
import { DEFAULT_MODEL, MODELS } from "@/lib/models";

function ErrorState({
  message,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction
}: {
  message: string;
  actionLabel: string;
  onAction: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}) {
  return (
    <div className="flex min-h-dvh items-center justify-center p-4">
      <Card className="w-full max-w-xl border-zinc-800 bg-zinc-950/95">
        <CardHeader>
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <CardTitle>Bit-Chat hit a local runtime error</CardTitle>
          <CardDescription className="text-base text-zinc-300">{message}</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Button onClick={onAction}>{actionLabel}</Button>
          {secondaryActionLabel && onSecondaryAction ? (
            <Button variant="outline" onClick={onSecondaryAction}>
              {secondaryActionLabel}
            </Button>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

function ChatExperience() {
  const [selectedModelId, setSelectedModelId] = useState(DEFAULT_MODEL.id);
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(true);
  const selectedModel = useMemo(
    () => MODELS.find((model) => model.id === selectedModelId) ?? DEFAULT_MODEL,
    [selectedModelId]
  );

  const { engine, isLoading, progress, progressText, error, isReady } = useWebLLM(selectedModelId);
  const { messages, sendMessage, isGenerating, tokensPerSecond, resetChat } = useChat(engine);

  useEffect(() => {
    if (error) {
      setShowLoadingOverlay(false);
      return;
    }

    if (!isReady || isLoading) {
      setShowLoadingOverlay(true);
      return;
    }

    const timeout = window.setTimeout(() => setShowLoadingOverlay(false), 500);
    return () => window.clearTimeout(timeout);
  }, [error, isLoading, isReady]);

  const visibleMessages = messages.filter((message) => message.role !== "system");
  const hasConversation = visibleMessages.length > 0;

  if (error) {
    const message = error.message.toLowerCase();

    if (message.includes("memory") || message.includes("device lost") || message.includes("out of memory")) {
      return (
        <ErrorState
          message="Not enough GPU memory for this model. Try a smaller model."
          actionLabel="Switch to SmolLM2-135M"
          onAction={() => setSelectedModelId("SmolLM2-135M-Instruct-q0f16-MLC")}
          secondaryActionLabel="Reload"
          onSecondaryAction={() => window.location.reload()}
        />
      );
    }

    if (message.includes("fetch") || message.includes("download") || message.includes("network")) {
      return (
        <ErrorState
          message="Failed to download model. Check your internet connection and try again."
          actionLabel="Retry"
          onAction={() => window.location.reload()}
        />
      );
    }

    if (message.includes("adapter") || message.includes("webgpu")) {
      return (
        <ErrorState
          message="Your device may not have a compatible GPU. Try a device with a dedicated graphics card."
          actionLabel="Reload"
          onAction={() => window.location.reload()}
        />
      );
    }

    return (
      <ErrorState
        message={error.message}
        actionLabel="Reload"
        onAction={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="relative flex min-h-dvh flex-col">
      {showLoadingOverlay ? (
        <LoadingScreen
          progress={progress}
          progressText={progressText}
          modelName={selectedModel.name}
          downloadSize={selectedModel.downloadSize}
        />
      ) : null}
      <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-zinc-800 bg-black/30 px-4 backdrop-blur-xl">
        <div className="text-sm font-semibold tracking-wide text-zinc-100 md:text-base">⚡ Bit-Chat</div>
        <div className="mx-4 flex flex-1 justify-center">
          <ModelSelector
            models={MODELS}
            selectedModelId={selectedModelId}
            onChange={setSelectedModelId}
            disabled={isLoading || isGenerating}
          />
        </div>
        <div className="flex items-center gap-2">
          <PerformanceBar tokensPerSecond={tokensPerSecond} />
          <Button variant="outline" size="sm" onClick={() => void resetChat()} disabled={isGenerating || isLoading}>
            <RotateCcw className="mr-2 h-4 w-4" />
            New Chat
          </Button>
        </div>
      </header>
      <main className="fade-in flex min-h-0 flex-1 flex-col">
        <section className="flex-1 overflow-hidden">
          {hasConversation ? (
            <ChatMessages messages={visibleMessages} />
          ) : (
            <div className="mx-auto flex h-full w-full max-w-4xl flex-col items-center justify-center px-6 text-center">
              <div className="rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1 text-sm text-blue-300">
                100% local AI
              </div>
              <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white">
                👋 Welcome to Bit-Chat
              </h1>
              <p className="mt-4 max-w-2xl text-balance text-lg text-zinc-400">
                This AI runs entirely in your browser. No server, no API key. Your conversations are
                100% private — nothing leaves this device.
              </p>
              <div className="mt-10 grid w-full max-w-3xl gap-3 md:grid-cols-2">
                {[
                  "Explain quantum computing simply",
                  "Write a haiku about coding",
                  "What's the Fibonacci sequence?",
                  "Help me debug a Python error"
                ].map((prompt) => (
                  <Button
                    key={prompt}
                    variant="outline"
                    className="h-auto justify-start rounded-2xl border-zinc-800 bg-zinc-900/80 px-4 py-4 text-left text-sm text-zinc-200 hover:bg-zinc-800"
                    onClick={() => void sendMessage(prompt)}
                    disabled={isGenerating || isLoading}
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </section>
        <section className="border-t border-zinc-800 bg-black/20 p-4 backdrop-blur-xl">
          <ChatInput onSubmit={sendMessage} disabled={isLoading || isGenerating} isGenerating={isGenerating} />
        </section>
      </main>
    </div>
  );
}

export function ChatApp() {
  return (
    <WebGPUCheck>
      <ChatExperience />
    </WebGPUCheck>
  );
}
