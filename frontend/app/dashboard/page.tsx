import { JobsDashboard } from "../components/JobsDashboard";
import { JobDetailPanel } from "../components/JobDetailPanel";
import { SkillsPreferencesPanel } from "../components/SkillsPreferencesPanel";

export default function DashboardPage() {
  return (
    <div className="ui-page-content">
      <section className="grid gap-4 md:grid-cols-[minmax(0,2.1fr),minmax(0,1.3fr)] md:items-start">
        <div className="space-y-4">
          <JobsDashboard />
          <JobDetailPanel />
        </div>
        <div className="space-y-4">
          <SkillsPreferencesPanel />
        </div>
      </section>
    </div>
  );
}


