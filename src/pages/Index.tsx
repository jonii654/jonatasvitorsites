import { lazy, Suspense, useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { BenefitsBar } from '@/components/BenefitsBar';
import { AboutMe } from '@/components/AboutMe';
import { Footer } from '@/components/Footer';
import { Preloader } from '@/components/Preloader';
import { MaintenanceBanner } from '@/components/MaintenanceBanner';


const PortalTransition = lazy(() => import('@/components/PortalTransition').then(m => ({ default: m.PortalTransition })));

const DesignStacking = lazy(() => import('@/components/DesignStacking').then(m => ({ default: m.DesignStacking })));
const HorizontalNotebookScroll = lazy(() => import('@/components/HorizontalNotebookScroll').then(m => ({ default: m.HorizontalNotebookScroll })));
const HowItWorks = lazy(() => import('@/components/HowItWorks').then(m => ({ default: m.HowItWorks })));
const Portfolio = lazy(() => import('@/components/Portfolio').then(m => ({ default: m.Portfolio })));
const Testimonials = lazy(() => import('@/components/Testimonials').then(m => ({ default: m.Testimonials })));
const FAQ = lazy(() => import('@/components/FAQ').then(m => ({ default: m.FAQ })));
const CTASection = lazy(() => import('@/components/CTASection').then(m => ({ default: m.CTASection })));
const BrandsMarquee = lazy(() => import('@/components/BrandsMarquee').then(m => ({ default: m.BrandsMarquee })));
const VideoBackground = lazy(() => import('@/components/VideoBackground').then(m => ({ default: m.VideoBackground })));

const Fallback = () => <div className="min-h-[200px]" aria-hidden />;

const Index = () => {
  const [loading, setLoading] = useState(() => {
    if (typeof window === 'undefined') return true;
    return !sessionStorage.getItem('jv_preloaded');
  });

  useEffect(() => {
    if (!loading) return;
    const t = setTimeout(() => {
      sessionStorage.setItem('jv_preloaded', '1');
    }, 100);
    return () => clearTimeout(t);
  }, [loading]);

  return (
    <>
      {loading && <Preloader onFinish={() => setLoading(false)} />}
      <div className="min-h-screen bg-background w-full" style={{ overflowX: 'clip' }}>
        <MaintenanceBanner />
        <Header />
        <main>

          <Hero />

          <Suspense fallback={<Fallback />}>
            <PortalTransition />
          </Suspense>


          <Suspense fallback={<Fallback />}>
            <Interactive3DCard />
          </Suspense>

          <Suspense fallback={<Fallback />}>
            <DesignStacking />
          </Suspense>

          <BenefitsBar />

          <div className="relative">
            <Suspense fallback={null}>
              <VideoBackground />
            </Suspense>
            <div className="relative z-10">
              <AboutMe />

              <Suspense fallback={<Fallback />}>
                <HorizontalNotebookScroll />
              </Suspense>

              <Suspense fallback={<Fallback />}>
                <HowItWorks />
              </Suspense>
              <Suspense fallback={<Fallback />}>
                <Portfolio />
              </Suspense>

              <Suspense fallback={<Fallback />}>
                <BrandsMarquee />
              </Suspense>

              <Suspense fallback={<Fallback />}>
                <Testimonials />
              </Suspense>

              <Suspense fallback={<Fallback />}>
                <FAQ />
              </Suspense>
              <Suspense fallback={<Fallback />}>
                <CTASection />
              </Suspense>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
