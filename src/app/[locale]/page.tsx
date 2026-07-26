import HeroSection from "@/components/features/HeroSection";
import WhyLawGuide from "@/components/features/WhyLawGuide";
import JourneyVisualizer from "@/components/features/JourneyVisualizer";
import Resources from "@/components/features/Resources";
import ContactSection from "@/components/features/ContactSection";
import dynamic from 'next/dynamic';

const LegalAssistant = dynamic(() => import('@/components/features/LegalAssistant'), {
  loading: () => <div className="p-8 text-center text-[#d4af37]">Loading Assistant...</div>
});
const PracticeMode = dynamic(() => import('@/components/features/PracticeMode'), {
  loading: () => <div className="p-8 text-center text-[#d4af37]">Loading Practice Mode...</div>
});
const DocumentChecker = dynamic(() => import('@/components/features/DocumentChecker'), {
  loading: () => <div className="p-8 text-center text-[#d4af37]">Loading Document Checker...</div>
});

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <WhyLawGuide />
      <LegalAssistant />
      <JourneyVisualizer />
      <PracticeMode />
      <DocumentChecker />
      <Resources />
      <ContactSection />
    </div>
  );
}
