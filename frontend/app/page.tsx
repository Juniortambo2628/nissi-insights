import Hero from "@/components/Hero";
import ServicesSection from "@/components/sections/ServicesSection";
import InsightsSection from "@/components/sections/InsightsSection";
import StatsSection from "@/components/sections/StatsSection";
import ValueProposition from "@/components/sections/ValueProposition";
import CTABanner from "@/components/sections/CTABanner";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EnergyStocks from "@/components/sections/EnergyStocks";


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col relative bg-background">
      <Navbar />
      <Hero />
      <ValueProposition />
      <StatsSection />
      <ServicesSection />
      <InsightsSection />
      
      {/* Energy Stocks ticker replaces CTABanner at the bottom */}
      <EnergyStocks />

      <Footer />
    </main>
  );
}
