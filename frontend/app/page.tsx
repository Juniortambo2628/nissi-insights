import Hero from "@/components/Hero";
import ServicesSection from "@/components/sections/ServicesSection";
import InsightsSection from "@/components/sections/InsightsSection";
import StatsSection from "@/components/sections/StatsSection";
import ValueProposition from "@/components/sections/ValueProposition";
import CTABanner from "@/components/sections/CTABanner";

export default function Home() {
  return (
    <>
      <Hero />
      <ValueProposition />
      <StatsSection />
      <ServicesSection />
      <InsightsSection />
    </>
  );
}
