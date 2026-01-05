"use client";

import { BuilderComponent, builder } from "@builder.io/react";

// Initialize Builder
const BUILDER_API_KEY = process.env.NEXT_PUBLIC_BUILDER_API_KEY || "";
builder.init(BUILDER_API_KEY);

interface EditableSectionProps {
  model: string; // e.g., "hero-section", "banner", "announcement"
  content?: any;
  fallback?: React.ReactNode;
}

export default function EditableSection({ model, content, fallback }: EditableSectionProps) {
  // Show fallback if no Builder content
  if (!content) {
    return fallback || null;
  }

  return (
    <BuilderComponent
      model={model}
      content={content}
    />
  );
}
