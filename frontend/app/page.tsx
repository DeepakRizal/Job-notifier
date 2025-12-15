import { HeroSection } from "./components/pages/HeroSection";
import { FeatureGrid } from "./components/pages/FeatureGrid";
import { HowItWorks } from "./components/pages/HowItWorks";

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* Hero - Full width with contained content */}
      <HeroSection />

      {/* Features Section */}
      <div className="relative">
        {/* Subtle divider gradient */}
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-stone-200 to-transparent" />
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <FeatureGrid />
        </div>
      </div>

      {/* How It Works Section */}
      <div className="relative bg-stone-50/50">
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-stone-200 to-transparent" />
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <HowItWorks />
        </div>
      </div>
    </div>
  );
}
