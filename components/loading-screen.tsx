"use client";

import { useEffect, useState } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function LoadingScreen({
  progress,
  progressText,
  modelName,
  downloadSize
}: {
  progress: number;
  progressText: string;
  modelName: string;
  downloadSize: string;
}) {
  const [isFinishing, setIsFinishing] = useState(false);

  useEffect(() => {
    if (progress >= 100) {
      setIsFinishing(true);
    } else {
      setIsFinishing(false);
    }
  }, [progress]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xl transition-opacity duration-500 ${
        isFinishing ? "opacity-0" : "opacity-100"
      }`}
    >
      <Card className="w-full max-w-xl border-zinc-800 bg-zinc-950/95">
        <CardHeader className="space-y-3">
          <div className="text-2xl font-semibold tracking-tight">⚡ Bit-Chat</div>
          <div>
            <CardTitle className="text-lg">Downloading {modelName}</CardTitle>
            <CardDescription>{downloadSize} local model package</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <Progress value={progress} className="h-4" />
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-zinc-100">{progress}%</span>
            <span className="text-zinc-400">{progressText}</span>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 text-sm text-zinc-300">
            First visit? The model downloads once ({downloadSize}) and caches locally. Future loads
            take 2-5 seconds.
          </div>
          <div className="text-center text-sm text-zinc-400">
            🔒 100% local. No data ever leaves your device.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
