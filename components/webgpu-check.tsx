"use client";

import { useEffect, useState } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type SupportState = "checking" | "supported" | "unsupported" | "no-adapter";
type WebGPUNavigator = Navigator & {
  gpu?: {
    requestAdapter: () => Promise<unknown>;
  };
};

export function WebGPUCheck({ children }: { children?: React.ReactNode }) {
  const [status, setStatus] = useState<SupportState>("checking");

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      const webgpuNavigator = navigator as WebGPUNavigator;

      if (typeof navigator === "undefined" || !webgpuNavigator.gpu) {
        if (!cancelled) {
          setStatus("unsupported");
        }
        return;
      }

      try {
        const adapter = await webgpuNavigator.gpu.requestAdapter();
        if (!cancelled) {
          setStatus(adapter ? "supported" : "no-adapter");
        }
      } catch {
        if (!cancelled) {
          setStatus("unsupported");
        }
      }
    };

    void check();

    return () => {
      cancelled = true;
    };
  }, []);

  if (status === "supported") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background p-4">
      <Card className="w-full max-w-xl border-zinc-800 bg-zinc-950/95">
        <CardHeader>
          <CardTitle className="text-2xl">WebGPU is not supported in your browser</CardTitle>
          <CardDescription className="text-base">
            Bit-Chat requires WebGPU to run AI models on your device.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-zinc-300">
          {status === "checking" ? (
            <p>Checking for a compatible GPU runtime...</p>
          ) : status === "no-adapter" ? (
            <p>
              Your device may not have a compatible GPU. Try a device with a dedicated graphics
              card.
            </p>
          ) : (
            <p>Try using Chrome 113+, Edge 113+, or a recent version of Safari.</p>
          )}
          <a
            href="https://caniuse.com/webgpu"
            target="_blank"
            rel="noreferrer"
            className="inline-flex text-primary hover:underline"
          >
            Check WebGPU browser support
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
