import ToolDetailsClient from "./ToolDetails.client";

interface ToolDetailsPageProps {
  params: Promise<{
    toolId: string;
  }>;
}

export default async function ToolDetailsPage({
  params,
}: ToolDetailsPageProps) {
  const { toolId } = await params;

  return <ToolDetailsClient toolId={toolId} />;
}
