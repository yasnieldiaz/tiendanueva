"use client";

import { BuilderComponent as BuilderIO, builder } from "@builder.io/react";

// Initialize Builder
const BUILDER_API_KEY = process.env.NEXT_PUBLIC_BUILDER_API_KEY || "";
builder.init(BUILDER_API_KEY);

interface BuilderPageProps {
  content: any;
  model?: string;
}

export default function BuilderContent({ content, model = "page" }: BuilderPageProps) {
  if (!content) {
    return null;
  }

  return (
    <BuilderIO
      model={model}
      content={content}
    />
  );
}
