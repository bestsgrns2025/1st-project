import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ServicesSection from '@/components/ServicesSection';
import CounterSection from '@/components/CounterSection';
import PortfolioSection from '@/components/PortfolioSection';
import TeamSection from '@/components/TeamSection';
import VideoSection from '@/components/VideoSection';
import StartProjectSection from '@/components/StartProjectSection';
import ContactSection from '@/components/ContactSection';
import ParticleSystem from '@/components/ParticleSystem';
import CustomCursor from '@/components/CustomCursor';

const Index = () => {
  useEffect(() => {
    // Smooth scrolling for anchor links
    const handleSmoothScroll = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      if (target.hash) {
        e.preventDefault();
        const element = document.querySelector(target.hash);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }
    };

    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
      link.addEventListener('click', handleSmoothScroll);
    });

    return () => {
      links.forEach(link => {
        link.removeEventListener('click', handleSmoothScroll);
      });
    };
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Custom Cursor */}
      <CustomCursor />
      
      {/* Floating Particles */}
      <ParticleSystem />
      
      {/* Navigation */}
      <Navbar />
      
      {/* Main Content */}
      <main className="relative z-10">
        <HeroSection />
        <ServicesSection />
        <CounterSection />
        <PortfolioSection />
        <TeamSection />
        <VideoSection />
        <StartProjectSection />
        <ContactSection />
      </main>
      
      {/* Footer */}
      <footer className="bg-background border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              © 2024 TechFlow. All rights reserved. Built with passion and innovation.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="/privacy-policy" className="text-muted-foreground hover:text-primary text-sm">Privacy Policy</a>
              <a href="/sitemap" className="text-muted-foreground hover:text-primary text-sm">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
