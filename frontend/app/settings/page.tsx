import { SkillsPreferencesPanel } from "../components/feature/user/SkillsPreferencesPanel";
import { AccountSettingsPanel } from "../components/feature/auth/AccountSettingsPanel";

export default function SettingsPage() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
        {/* Settings Sections */}
        <div className="space-y-8">
          <SkillsPreferencesPanel />
          <AccountSettingsPanel />
        </div>
      </div>
    </div>
  );
}
