import { notFound } from "next/navigation";
import { ToolWorkspace } from "@/components/tool-workspace";
import { tools } from "@/lib/data";

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export default async function ToolDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = tools.find((item) => item.slug === slug);

  if (!tool) {
    notFound();
  }

  return <ToolWorkspace slug={tool.slug} />;
}
