"use client";

import { Fragment } from "react";
import { Bot, User2 } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { ChatMessage } from "@/hooks/use-chat";
import { cn, formatTimestamp } from "@/lib/utils";

function renderInline(text: string) {
  const tokens = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);

  return tokens.map((token, index) => {
    if (!token) {
      return null;
    }

    if (token.startsWith("**") && token.endsWith("**")) {
      return (
        <strong key={`${token}-${index}`} className="font-semibold text-white">
          {token.slice(2, -2)}
        </strong>
      );
    }

    if (token.startsWith("`") && token.endsWith("`")) {
      return (
        <code
          key={`${token}-${index}`}
          className="rounded-md bg-black/30 px-1.5 py-0.5 font-mono text-[0.95em] text-cyan-200"
        >
          {token.slice(1, -1)}
        </code>
      );
    }

    return <Fragment key={`${token}-${index}`}>{token}</Fragment>;
  });
}

function renderFormattedContent(content: string) {
  const blocks = content.split(/```([\s\S]*?)```/g);

  return blocks.map((block, index) => {
    if (index % 2 === 1) {
      return (
        <pre
          key={`code-${index}`}
          className="my-3 overflow-x-auto rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-cyan-100"
        >
          <code>{block.trim()}</code>
        </pre>
      );
    }

    return (
      <p key={`text-${index}`} className="whitespace-pre-wrap break-words leading-7">
        {renderInline(block)}
      </p>
    );
  });
}

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex w-full gap-3", isUser ? "justify-end" : "justify-start")}>
      {!isUser ? (
        <Avatar className="mt-1 h-9 w-9 border-zinc-800 bg-zinc-950">
          <AvatarFallback>
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      ) : null}
      <div className={cn("max-w-[85%] md:max-w-[72%]", isUser ? "items-end" : "items-start")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm shadow-lg",
            isUser
              ? "rounded-br-md bg-primary text-primary-foreground"
              : "rounded-bl-md border border-zinc-800 bg-zinc-900 text-zinc-100"
          )}
        >
          {message.role === "assistant" ? renderFormattedContent(message.content) : (
            <p className="whitespace-pre-wrap break-words leading-7">{message.content}</p>
          )}
        </div>
        <div className={cn("mt-1 text-xs text-zinc-500", isUser ? "text-right" : "text-left")}>
          {formatTimestamp(message.timestamp)}
        </div>
      </div>
      {isUser ? (
        <Avatar className="mt-1 h-9 w-9 border-blue-500/20 bg-blue-500/10">
          <AvatarFallback>
            <User2 className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      ) : null}
    </div>
  );
}
