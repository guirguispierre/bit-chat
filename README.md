# ⚡ Bit-Chat

**Run a tiny LLM entirely in your browser. No server, no API key, no signup.**

<!-- TODO: Add demo GIF -->

**[🔗 Try the Live Demo →](https://bit-chat.vercel.app)**

---

## What is this?

Bit-Chat runs a quantized language model 100% locally in your browser using WebGPU. When you open the URL, the model downloads once (~200 MB for the smallest), caches in your browser, and every subsequent visit loads in seconds. Your conversations never leave your device.

Built as the web companion to [Atomic-1Bit](https://github.com/guirguispierre/Atomic-1Bit), my bare-metal 1-bit ternary inference engine.

## Features

- 🧠 **Client-side inference** — LLM runs entirely in your browser via WebGPU
- 🔒 **100% private** — no data ever leaves your device
- 🆓 **No API key** — no accounts, no subscriptions, no rate limits
- ⚡ **Fast** — WebGPU-accelerated, 80% of native GPU performance
- 📦 **Cached** — model downloads once, loads from cache in 2-5 seconds
- 🔄 **Multiple models** — choose from 135M to 3B parameter models

## Models

| Model | Parameters | Download | Best For |
|-------|-----------|----------|----------|
| SmolLM2 360M ⭐ | 360M | ~200 MB | Quick demos, low-end devices |
| SmolLM2 135M | 135M | ~135 MB | Absolute minimum viable |
| Qwen 2.5 0.5B | 500M | ~350 MB | Best quality at tiny size |
| Llama 3.2 1B | 1B | ~600 MB | Great all-rounder |
| Llama 3.2 3B | 3B | ~1.7 GB | Best quality, needs good GPU |

## How it works

1. You open the URL
2. The model downloads from HuggingFace and caches in your browser
3. WebGPU runs inference on your GPU
4. Everything stays local — the server only hosts static files

## Tech stack

- **Inference**: [WebLLM](https://github.com/mlc-ai/web-llm) (WebGPU + TVM compiler)
- **Framework**: Next.js 15, React 19, TypeScript
- **UI**: shadcn/ui + Tailwind CSS
- **Deployment**: Vercel (static hosting only)

## Browser support

WebGPU is required. Supported in:
- ✅ Chrome 113+ (desktop & Android)
- ✅ Edge 113+
- ✅ Safari 26+ (macOS/iOS, partial)
- ⚠️ Firefox (Windows/macOS only, limited)

## Run locally
```bash
git clone https://github.com/guirguispierre/bit-chat.git
cd bit-chat
npm install
npm run dev
```

Open http://localhost:3000

## Deploy your own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/guirguispierre/bit-chat)

## License

MIT © Pierre Guirguis 2026

---
