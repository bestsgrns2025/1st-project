import { useEffect, useRef } from 'react';
import { Globe, ShoppingCart, Smartphone, Code, Users, Zap, Shield, Headphones } from 'lucide-react';

const ServicesSection = () => {
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

  const services = [
    {
      icon: Globe,
      title: 'Offshore Development',
      description: 'Leverage our global talent pool with dedicated offshore development teams. We provide cost-effective solutions without compromising on quality, offering 24/7 development cycles and expertise across multiple technologies.',
      features: ['Dedicated Development Teams', 'Cost-Effective Solutions', '24/7 Development Cycle', 'Multi-Technology Expertise'],
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: ShoppingCart,
      title: 'E-Commerce Solutions',
      description: 'Build powerful e-commerce platforms that drive sales and enhance customer experience. From custom online stores to marketplace integrations, we deliver scalable solutions that grow with your business.',
      features: ['Custom Online Stores', 'Payment Gateway Integration', 'Inventory Management', 'Mobile-First Design'],
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: Smartphone,
      title: 'Web App Development',
      description: 'Create responsive, fast, and user-friendly web applications using cutting-edge technologies. Our progressive web apps deliver native app-like experiences across all devices and platforms.',
      features: ['Progressive Web Apps', 'Cross-Platform Compatibility', 'Real-time Features', 'Cloud Integration'],
      gradient: 'from-purple-500 to-violet-500'
    },
    {
      icon: Code,
      title: 'Custom Development',
      description: 'Tailored software solutions designed specifically for your business needs. We transform complex requirements into elegant, scalable applications that streamline your operations.',
      features: ['Tailored Solutions', 'Scalable Architecture', 'API Development', 'System Integration'],
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  const additionalServices = [
    { icon: Users, title: 'Dedicated Teams', desc: 'Skilled developers working exclusively on your project' },
    { icon: Zap, title: 'Rapid Delivery', desc: 'Fast turnaround times without compromising quality' },
    { icon: Shield, title: 'Secure Solutions', desc: 'Enterprise-grade security and data protection' },
    { icon: Headphones, title: '24/7 Support', desc: 'Round-the-clock technical support and maintenance' }
  ];

  return (
    <section id="services" ref={sectionRef} className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 section-gradient"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Our <span className="bg-gradient-primary bg-clip-text text-transparent">Services</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive digital solutions designed to transform your business and drive growth through innovative technology
          </p>
        </div>

        {/* Main Services Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="premium-glass glow-border animate-on-scroll hover-target group cursor-pointer rounded-2xl p-6"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="relative">
                  {/* Icon with gradient background */}
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${service.gradient} mb-6`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features List */}
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Hover Effect */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/20 to-transparent rounded-full -translate-y-2 translate-x-2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Services */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-on-scroll">
          {additionalServices.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="text-center p-6 rounded-xl bg-card/50 border border-border/50 hover:border-primary/50 transition-all duration-300 hover-target group"
              >
                <Icon className="h-10 w-10 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold mb-2 text-foreground">{service.title}</h4>
                <p className="text-sm text-muted-foreground">{service.desc}</p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-16 animate-on-scroll">
          <button className="hero-button">
            Explore All Services
          </button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;