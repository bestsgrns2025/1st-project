import { useEffect, useRef, useState } from 'react';
import { ExternalLink, Github, ArrowRight, Filter } from 'lucide-react';

const PortfolioSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState('all');

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

  const filters = [
    { id: 'all', label: 'All Projects' },
    { id: 'ecommerce', label: 'E-Commerce' },
    { id: 'webapp', label: 'Web Apps' },
    { id: 'mobile', label: 'Mobile' },
    { id: 'custom', label: 'Custom Solutions' }
  ];

  const projects = [
    {
      id: 1,
      title: 'E-Commerce Marketplace',
      category: 'ecommerce',
      description: 'Multi-vendor marketplace with advanced filtering, payment gateway integration, and real-time inventory management.',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
      tech: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      liveUrl: 'https://example-marketplace.com',
      githubUrl: 'https://github.com/example/marketplace',
      featured: true
    },
    {
      id: 2,
      title: 'Financial Dashboard',
      category: 'webapp',
      description: 'Comprehensive financial analytics platform with real-time data visualization and portfolio management.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
      tech: ['Vue.js', 'Python', 'PostgreSQL', 'D3.js'],
      liveUrl: 'https://example-finance.com',
      githubUrl: 'https://github.com/example/finance',
      featured: true
    },
    {
      id: 3,
      title: 'Healthcare Mobile App',
      category: 'mobile',
      description: 'Patient management system with appointment scheduling, telemedicine features, and health records.',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=400&fit=crop',
      tech: ['React Native', 'Firebase', 'Node.js', 'Socket.io'],
      liveUrl: 'https://example-health.com',
      githubUrl: 'https://github.com/example/health',
      featured: false
    },
    {
      id: 4,
      title: 'Supply Chain Management',
      category: 'custom',
      description: 'Enterprise solution for tracking inventory, managing suppliers, and optimizing logistics operations.',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=400&fit=crop',
      tech: ['Angular', 'Java', 'Oracle', 'Microservices'],
      liveUrl: 'https://example-supply.com',
      githubUrl: 'https://github.com/example/supply',
      featured: true
    },
    {
      id: 5,
      title: 'Social Learning Platform',
      category: 'webapp',
      description: 'Interactive e-learning platform with live streaming, progress tracking, and collaborative features.',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop',
      tech: ['Next.js', 'WebRTC', 'Redis', 'AWS'],
      liveUrl: 'https://example-learning.com',
      githubUrl: 'https://github.com/example/learning',
      featured: false
    },
    {
      id: 6,
      title: 'Restaurant POS System',
      category: 'custom',
      description: 'Point-of-sale system with order management, inventory tracking, and analytics for restaurant chains.',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop',
      tech: ['React', 'Express', 'MySQL', 'PWA'],
      liveUrl: 'https://example-pos.com',
      githubUrl: 'https://github.com/example/pos',
      featured: false
    }
  ];

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(project => project.category === activeFilter);

  return (
    <section id="portfolio" ref={sectionRef} className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 section-gradient"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Our <span className="bg-gradient-primary bg-clip-text text-transparent">Portfolio</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Showcasing our expertise through successful projects that have transformed businesses and delighted users
          </p>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 hover-target ${
                  activeFilter === filter.id
                    ? 'bg-primary text-primary-foreground shadow-glow'
                    : 'bg-secondary text-secondary-foreground hover:bg-primary/20'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Projects */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {filteredProjects.filter(p => p.featured).map((project, index) => (
            <div
              key={project.id}
              className="glass-card glow-border animate-on-scroll group hover-target"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="relative overflow-hidden rounded-xl mb-6">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex space-x-3">
                    <a
                      href={project.liveUrl}
                      className="flex items-center space-x-2 px-4 py-2 bg-primary rounded-lg text-primary-foreground text-sm hover:bg-primary-glow transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>Live Demo</span>
                    </a>
                    <a
                      href={project.githubUrl}
                      className="flex items-center space-x-2 px-4 py-2 bg-secondary rounded-lg text-secondary-foreground text-sm hover:bg-secondary/80 transition-colors"
                    >
                      <Github className="h-4 w-4" />
                      <span>Code</span>
                    </a>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Regular Projects Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {filteredProjects.filter(p => !p.featured).map((project, index) => (
            <div
              key={project.id}
              className="glass-card animate-on-scroll group hover-target cursor-pointer"
              style={{ animationDelay: `${(index + 2) * 150}ms` }}
            >
              <div className="relative overflow-hidden rounded-lg mb-4">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                {project.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                {project.description}
              </p>
              
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  {project.tech.slice(0, 2).map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.tech.length > 2 && (
                    <span className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs">
                      +{project.tech.length - 2}
                    </span>
                  )}
                </div>
                <ArrowRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16 animate-on-scroll">
          <button className="hero-button">
            View All Projects
          </button>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;