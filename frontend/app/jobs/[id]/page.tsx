import { JobDetailPanel } from "../../components/feature/jobs/JobDetailPanel";

interface JobPageProps {
  params: { id: string };
}

export default function JobPage(_props: JobPageProps) {
  return (
    <div className="ui-page-content">
      <JobDetailPanel />
    </div>
  );
}
