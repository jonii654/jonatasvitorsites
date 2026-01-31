import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Interactive3DCard } from '@/components/Interactive3DCard';
import { BenefitsBar } from '@/components/BenefitsBar';
import { AboutMe } from '@/components/AboutMe';
import { HorizontalNotebookScroll } from '@/components/HorizontalNotebookScroll';
import { HowItWorks } from '@/components/HowItWorks';
import { Portfolio } from '@/components/Portfolio';
import { Testimonials } from '@/components/Testimonials';
import { FAQ } from '@/components/FAQ';
import { CTASection } from '@/components/CTASection';
import { Footer } from '@/components/Footer';
import { VideoBackground } from '@/components/VideoBackground';

const Index = () => {
  return (
    <div className="min-h-screen bg-background w-full overflow-x-hidden">
      <Header />
      <main>
        {/* Hero section - NO video background */}
        <Hero />
        
        {/* 3D Interactive Card Transition */}
        <Interactive3DCard />
        
        <BenefitsBar />
        <AboutMe />
        
        {/* Horizontal Notebook Scroll - Compromisso com qualidade */}
        <HorizontalNotebookScroll />
        
        {/* Video background sections - HowItWorks and Portfolio */}
        <div className="relative">
          <VideoBackground />
          <div className="relative z-10">
            <HowItWorks />
            <Portfolio />
          </div>
        </div>
        
        {/* Testimonials - OUTSIDE video container for sticky to work */}
        <Testimonials />
        
        {/* FAQ and CTA with video background */}
        <div className="relative">
          <VideoBackground />
          <div className="relative z-10">
            <FAQ />
            <CTASection />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
