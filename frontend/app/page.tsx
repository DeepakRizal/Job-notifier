import { HeroSection } from "./components/HeroSection";
import { FeatureGrid } from "./components/FeatureGrid";
import { HowItWorks } from "./components/HowItWorks";

export default function Home() {
  return (
    <div className="ui-page-content">
      <HeroSection />
      <FeatureGrid />
      <HowItWorks />
    </div>
  );
}
