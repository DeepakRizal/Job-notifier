import { HeroSection } from "./components/pages/HeroSection";
import { FeatureGrid } from "./components/pages/FeatureGrid";
import { HowItWorks } from "./components/pages/HowItWorks";

export default function Home() {
  return (
    <div className="ui-page-content">
      <HeroSection />
      <FeatureGrid />
      <HowItWorks />
    </div>
  );
}
