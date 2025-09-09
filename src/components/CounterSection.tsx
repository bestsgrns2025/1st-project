import { useState, useEffect, useRef } from 'react';

interface CounterProps {
  end: number;
  duration: number;
  suffix?: string;
}

const Counter = ({ end, duration, suffix = '' }: CounterProps) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const counterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStarted) {
          setHasStarted(true);
          let start = 0;
          const increment = end / (duration * 60); // 60fps
          
          const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 1000 / 60);

          return () => clearInterval(timer);
        }
      },
      { threshold: 0.5 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, [end, duration, hasStarted]);

  return (
    <div ref={counterRef} className="text-4xl md:text-5xl font-bold text-primary">
      {count}{suffix}
    </div>
  );
};

const CounterSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = sectionRef.current?.querySelectorAll('.animate-on-scroll');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const stats = [
    { 
      number: 500, 
      suffix: '+', 
      label: 'Projects Completed',
      description: 'Successfully delivered projects across various industries'
    },
    { 
      number: 98, 
      suffix: '%', 
      label: 'Client Satisfaction',
      description: 'Maintaining highest quality standards and client happiness'
    },
    { 
      number: 50, 
      suffix: '+', 
      label: 'Expert Developers',
      description: 'Skilled professionals with cutting-edge technology expertise'
    },
    { 
      number: 24, 
      suffix: '/7', 
      label: 'Support Available',
      description: 'Round-the-clock assistance and maintenance services'
    },
    { 
      number: 100, 
      suffix: '+', 
      label: 'Happy Clients',
      description: 'Businesses transformed through our digital solutions'
    },
    { 
      number: 5, 
      suffix: 'Y', 
      label: 'Industry Experience',
      description: 'Years of excellence in web development and digital solutions'
    }
  ];

  return (
    <section ref={sectionRef} className="py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Our <span className="bg-gradient-primary bg-clip-text text-transparent">Impact</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Numbers that speak for our commitment to excellence and client success
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-2xl glass-card glow-border animate-on-scroll hover-target group"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="mb-4">
                <Counter 
                  end={stat.number} 
                  duration={2}
                  suffix={stat.suffix}
                />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                {stat.label}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {stat.description}
              </p>
              
              {/* Decorative element */}
              <div className="mt-4 w-12 h-1 bg-gradient-primary mx-auto rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          ))}
        </div>

        {/* Achievement Badges */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 animate-on-scroll">
          {[
            { icon: '🏆', title: 'Award Winning', desc: 'Recognition for excellence' },
            { icon: '⚡', title: 'Fast Delivery', desc: 'Quick turnaround times' },
            { icon: '🔒', title: 'Secure Code', desc: 'Enterprise-grade security' },
            { icon: '💎', title: 'Premium Quality', desc: 'Top-tier development' }
          ].map((badge, index) => (
            <div
              key={index}
              className="text-center p-4 rounded-xl bg-primary/5 border border-primary/10 hover:border-primary/30 transition-all duration-300 hover-target group"
            >
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                {badge.icon}
              </div>
              <h4 className="font-medium text-foreground mb-1">{badge.title}</h4>
              <p className="text-xs text-muted-foreground">{badge.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CounterSection;