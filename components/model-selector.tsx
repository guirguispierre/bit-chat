"use client";

import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import type { ModelInfo } from "@/lib/models";

export function ModelSelector({
  models,
  selectedModelId,
  onChange,
  disabled
}: {
  models: ModelInfo[];
  selectedModelId: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <Select value={selectedModelId} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="w-[220px] md:w-[300px]">
        <SelectValue placeholder="Choose a model" />
      </SelectTrigger>
      <SelectContent>
        {models.map((model) => (
          <SelectItem key={model.id} value={model.id}>
            <div className="flex w-full items-center justify-between gap-3">
              <div className="flex min-w-0 flex-col">
                <span className="truncate font-medium">{model.name}</span>
                <span className="text-xs text-muted-foreground">
                  {model.params} · {model.downloadSize}
                </span>
              </div>
              {model.recommended ? <Badge className="shrink-0">Recommended</Badge> : null}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
