import { SkillsPreferencesPanel } from "../components/feature/user/SkillsPreferencesPanel";
import { AccountSettingsPanel } from "../components/feature/auth/AccountSettingsPanel";

export default function SettingsPage() {
  return (
    <div className="ui-page-content space-y-4">
      <SkillsPreferencesPanel />
      <AccountSettingsPanel />
    </div>
  );
}
