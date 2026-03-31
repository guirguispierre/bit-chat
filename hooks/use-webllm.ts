"use client";

import { useEffect, useRef, useState } from "react";
import type { InitProgressReport, MLCEngineInterface } from "@mlc-ai/web-llm";

function toError(error: unknown) {
  return error instanceof Error ? error : new Error("An unknown WebLLM error occurred.");
}

export function useWebLLM(modelId: string) {
  const engineRef = useRef<MLCEngineInterface | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const requestIdRef = useRef(0);

  const [engine, setEngine] = useState<MLCEngineInterface | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("Preparing local model runtime...");
  const [error, setError] = useState<Error | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    return () => {
      const currentEngine = engineRef.current;
      const currentWorker = workerRef.current;

      void currentEngine?.unload().catch(() => undefined);
      currentWorker?.terminate();

      engineRef.current = null;
      workerRef.current = null;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const requestId = ++requestIdRef.current;

    const handleProgress = (report: InitProgressReport) => {
      if (cancelled || requestIdRef.current !== requestId) {
        return;
      }

      setProgress(Math.max(0, Math.min(100, Math.round(report.progress * 100))));
      setProgressText(report.text || "Loading model...");
    };

    const initialize = async () => {
      try {
        setError(null);
        setIsLoading(true);
        setIsReady(false);
        setProgress(0);
        setProgressText("Preparing local model runtime...");

        if (engineRef.current) {
          engineRef.current.setInitProgressCallback(handleProgress);
          await engineRef.current.reload(modelId);
          if (!cancelled && requestIdRef.current === requestId) {
            setEngine(engineRef.current);
            setIsReady(true);
            setIsLoading(false);
            setProgress(100);
          }
          return;
        }

        const worker = new Worker(new URL("../workers/engine-worker.ts", import.meta.url), {
          type: "module"
        });
        workerRef.current = worker;

        const { CreateWebWorkerMLCEngine } = await import("@mlc-ai/web-llm");
        const createdEngine = await CreateWebWorkerMLCEngine(worker, modelId, {
          initProgressCallback: handleProgress
        });

        if (cancelled || requestIdRef.current !== requestId) {
          await createdEngine.unload().catch(() => undefined);
          worker.terminate();
          if (workerRef.current === worker) {
            workerRef.current = null;
          }
          return;
        }

        engineRef.current = createdEngine;
        setEngine(createdEngine);
        setIsReady(true);
        setIsLoading(false);
        setProgress(100);
        setProgressText("Model ready.");
      } catch (caughtError) {
        if (cancelled || requestIdRef.current !== requestId) {
          return;
        }

        const nextError = toError(caughtError);
        setError(nextError);
        setIsLoading(false);
        setIsReady(false);
      }
    };

    void initialize();

    return () => {
      cancelled = true;
    };
  }, [modelId]);

  return { engine, isLoading, progress, progressText, error, isReady };
}
