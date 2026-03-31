"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ChatInput({
  onSubmit,
  disabled,
  isGenerating
}: {
  onSubmit: (value: string) => Promise<void> | void;
  disabled?: boolean;
  isGenerating?: boolean;
}) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 140)}px`;
  }, [value]);

  const submit = async () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) {
      return;
    }

    await onSubmit(trimmed);
    setValue("");
  };

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="rounded-3xl border border-zinc-800 bg-zinc-950/90 p-3 shadow-2xl shadow-black/20">
        <div className="flex items-end gap-3">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                void submit();
              }
            }}
            disabled={disabled}
            rows={1}
            placeholder="Ask Bit-Chat anything..."
            className={cn(
              "max-h-[140px] min-h-12 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-500",
              disabled && "cursor-not-allowed opacity-60"
            )}
          />
          <Button
            type="button"
            size="icon"
            className="h-11 w-11 rounded-2xl"
            disabled={disabled || !value.trim()}
            onClick={() => void submit()}
          >
            {isGenerating ? <LoaderCircle className="animate-spin" /> : <ArrowUp />}
          </Button>
        </div>
        {isGenerating ? <div className="px-2 pt-2 text-xs text-zinc-500">Generating...</div> : null}
      </div>
    </div>
  );
}
