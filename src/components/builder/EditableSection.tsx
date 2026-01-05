"use client";

import { BuilderComponent, useIsPreviewing } from "@builder.io/react";
import { builder } from "@/lib/builder";

interface EditableSectionProps {
  model: string; // e.g., "hero-section", "banner", "announcement"
  content?: any;
  fallback?: React.ReactNode;
}

export default function EditableSection({ model, content, fallback }: EditableSectionProps) {
  const isPreviewing = useIsPreviewing();

  // Show fallback if no Builder content and not previewing
  if (!content && !isPreviewing) {
    return fallback || null;
  }

  return (
    <BuilderComponent
      model={model}
      content={content}
      apiKey={process.env.NEXT_PUBLIC_BUILDER_API_KEY}
    />
  );
}
