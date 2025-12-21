import { JobDetailPanel } from "../../components/feature/jobs/JobDetailPanel";

interface JobPageProps {
  params: Promise<{ id: string }>;
}

export default async function JobPage({ params }: JobPageProps) {
  const { id } = await params;

  return (
    <div className="ui-page-content">
      <JobDetailPanel jobId={id} />
    </div>
  );
}
