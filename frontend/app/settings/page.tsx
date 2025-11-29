import { SkillsPreferencesPanel } from "../components/SkillsPreferencesPanel";
import { AccountSettingsPanel } from "../components/AccountSettingsPanel";

export default function SettingsPage() {
  return (
    <div className="ui-page-content space-y-4">
      <SkillsPreferencesPanel />
      <AccountSettingsPanel />
    </div>
  );
}


