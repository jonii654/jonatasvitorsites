import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { AboutMe } from '@/components/AboutMe';
import { Results } from '@/components/Results';
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
        <Hero />
        {/* Video background appears after Hero */}
        <div className="relative">
          <VideoBackground />
          <div className="relative z-10">
            <AboutMe />
            <Results />
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
