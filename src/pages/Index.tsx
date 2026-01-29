import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
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
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero section - NO video background */}
        <Hero />
        <BenefitsBar />
        <AboutMe />
        
        {/* Horizontal Notebook Scroll - Compromisso com qualidade */}
        <HorizontalNotebookScroll />
        
        {/* Video background starts AFTER notebook section */}
        <div className="relative">
          <VideoBackground />
          <div className="relative z-10">
            <HowItWorks />
            <Portfolio />
            <Testimonials />
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
