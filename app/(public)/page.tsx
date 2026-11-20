import type { Metadata } from "next";
import HeroSection from "@/components/landing/HeroSection";
import SearchBar from "@/components/landing/SearchBar";
import PropertyCardsSection from "@/components/landing/PropertyCardsSection";
import EcosystemSection from "@/components/landing/EcosystemSection";
import TrustSection from "@/components/landing/TrustSection";
import CtaBanner from "@/components/landing/CtaBanner";

export const metadata: Metadata = {
  title: "HomeScout — Find Your Space. Own Your Move.",
  description:
    "Nigeria's most transparent property platform. Verified listings, GPS-precise locations, and direct connections with landlords and agents.",
};

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <SearchBar />
      <PropertyCardsSection />
      <EcosystemSection />
      <TrustSection />
      <CtaBanner />
    </>
  );
}
