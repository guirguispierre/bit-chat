export interface ModelInfo {
  id: string;
  name: string;
  params: string;
  vram: string;
  downloadSize: string;
  description: string;
  recommended?: boolean;
}

export const MODELS: ModelInfo[] = [
  {
    id: "SmolLM2-360M-Instruct-q4f16_1-MLC",
    name: "SmolLM2 360M",
    params: "360M",
    vram: "~500 MB",
    downloadSize: "~200 MB",
    description: "Ultra-tiny. Fast downloads, runs on any GPU.",
    recommended: true
  },
  {
    id: "SmolLM2-135M-Instruct-q0f16-MLC",
    name: "SmolLM2 135M",
    params: "135M",
    vram: "~360 MB",
    downloadSize: "~135 MB",
    description: "Smallest possible. Limited quality, instant load."
  },
  {
    id: "Qwen2.5-0.5B-Instruct-q4f16_1-MLC",
    name: "Qwen 2.5 0.5B",
    params: "500M",
    vram: "~945 MB",
    downloadSize: "~350 MB",
    description: "Best quality at tiny size. Multilingual."
  },
  {
    id: "Llama-3.2-1B-Instruct-q4f16_1-MLC",
    name: "Llama 3.2 1B",
    params: "1B",
    vram: "~880 MB",
    downloadSize: "~600 MB",
    description: "Meta's smallest Llama. Great all-rounder."
  },
  {
    id: "Qwen2.5-1.5B-Instruct-q4f16_1-MLC",
    name: "Qwen 2.5 1.5B",
    params: "1.5B",
    vram: "~1.8 GB",
    downloadSize: "~900 MB",
    description: "Strong multilingual and coding ability."
  },
  {
    id: "Llama-3.2-3B-Instruct-q4f16_1-MLC",
    name: "Llama 3.2 3B",
    params: "3B",
    vram: "~2.2 GB",
    downloadSize: "~1.7 GB",
    description: "Best quality. Needs a capable GPU."
  }
];

export const DEFAULT_MODEL = MODELS[0];
