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

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <AboutMe />
        <Results />
        <HowItWorks />
        <Portfolio />
        <Testimonials />
        <FAQ />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
