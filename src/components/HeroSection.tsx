import { useEffect, useState } from 'react';
import { ArrowRight, Play, Sparkles } from 'lucide-react';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/20"></div>
      
      {/* Animated Grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full bg-[linear-gradient(hsl(var(--primary))_1px,transparent_1px),linear-gradient(90deg,hsl(var(--primary))_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black_40%,transparent_100%)]"></div>
      </div>

      <div className="container mx-auto px-4 z-10 pt-20">
        <div className={`text-center max-w-4xl mx-auto transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-primary font-medium">Transforming Ideas into Digital Reality</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Premium Web
            </span>
            <br />
            <span className="text-foreground">Solutions</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            We craft exceptional digital experiences with cutting-edge technology, 
            delivering offshore development, e-commerce solutions, and custom web applications.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <a href="#start-project" className="hero-button group flex items-center">
              Start Your Project
              <ArrowRight className="ml-1 h-6 w-5 transition-transform group-hover:translate-x-1" />
            </a>
            <a href="/video-page" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 px-6 py-3 text-foreground hover:text-primary transition-colors hover-target">
              <Play className="h-5 w-5" />
              <span>Watch Demo</span>
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            {[
              { number: '500+', label: 'Projects Delivered' },
              { number: '98%', label: 'Client Satisfaction' },
              { number: '50+', label: 'Team Members' },
              { number: '24/7', label: 'Support Available' }
            ].map((stat, index) => (
              <div 
                key={index} 
                className={`transition-all duration-700 delay-${(index + 1) * 200} ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
              >
                <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;