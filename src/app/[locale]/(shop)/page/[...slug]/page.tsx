import { builder } from "@builder.io/sdk";
import BuilderContent from "@/components/BuilderComponent";
import { notFound } from "next/navigation";

// Initialize Builder
builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY || "");

interface PageProps {
  params: Promise<{
    locale: string;
    slug: string[];
  }>;
}

export default async function BuilderPage({ params }: PageProps) {
  const { slug, locale } = await params;
  const urlPath = "/" + slug.join("/");

  // Fetch the page content from Builder
  const content = await builder
    .get("page", {
      userAttributes: {
        urlPath,
        locale,
      },
      options: {
        locale,
      },
    })
    .toPromise();

  if (!content) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <BuilderContent content={content} model="page" />
    </div>
  );
}

// Generate static params for known pages
export async function generateStaticParams() {
  return [];
}
