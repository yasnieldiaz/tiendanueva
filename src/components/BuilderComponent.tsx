"use client";

import { BuilderComponent as BuilderIO, useIsPreviewing } from "@builder.io/react";
import { builder } from "@/lib/builder";

// Register custom components that can be used in Builder
// builder.registerComponent(YourComponent, {
//   name: "YourComponent",
//   inputs: [{ name: "title", type: "string" }],
// });

interface BuilderPageProps {
  content: any;
  model?: string;
}

export default function BuilderContent({ content, model = "page" }: BuilderPageProps) {
  const isPreviewing = useIsPreviewing();

  if (!content && !isPreviewing) {
    return null;
  }

  return (
    <BuilderIO
      model={model}
      content={content}
      apiKey={process.env.NEXT_PUBLIC_BUILDER_API_KEY}
    />
  );
}
