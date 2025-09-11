import { useEffect, useRef, useState } from "react";
import { ExternalLink, Github, ArrowRight, XCircle } from "lucide-react";
import ecommerceImg from "../assets/Portfolio/E-Commerce.png";
import dashboardImg from "../assets/Portfolio/Dashboard.png";
import healthImg from "../assets/Portfolio/healthapp.png";
import supplyImg from "../assets/Portfolio/supplychain.png";
import learningImg from "../assets/Portfolio/sociallearning.avif";
import posImg from "../assets/Portfolio/Resta.avif";
import fashionImg from "../assets/Portfolio/fashion.jpg";
import travelImg from "../assets/Portfolio/travel.png";
import groceryImg from "../assets/Portfolio/grocery.png";
import fitness from "../assets/Portfolio/fitness.jpeg";
import real from "../assets/Portfolio/real.jpg";


// Moved projects data outside the component to prevent re-declaration on re-renders
const allProjects = [
  {
    id: 1,
    title: "E-Commerce Marketplace",
    category: "ecommerce",
    description:
      "Multi-vendor marketplace with advanced filtering, payment gateway integration, and real-time inventory management.",
    image: ecommerceImg,
    tech: ["React", "Node.js", "MongoDB", "Stripe"],
    liveUrl: "https://example-marketplace.com",
    githubUrl: "https://github.com/example/marketplace",
    featured: true,
  },
  {
    id: 2,
    title: "Financial Dashboard",
    category: "webapp",
    description:
      "Comprehensive financial analytics platform with real-time data visualization and portfolio management.",
    image: dashboardImg,
    tech: ["Vue.js", "Python", "PostgreSQL", "D3.js"],
    liveUrl: "https://example-finance.com",
    githubUrl: "https://github.com/example/finance",
    featured: true,
  },
  {
    id: 3,
    title: "Healthcare Mobile App",
    category: "mobile",
    description:
      "Patient management system with appointment scheduling, telemedicine features, and health records.",
    image: healthImg,
    tech: ["React Native", "Firebase", "Node.js", "Socket.io"],
    liveUrl: "https://example-health.com",
    githubUrl: "https://github.com/example/health",
    featured: false,
  },
  {
    id: 4,
    title: "Supply Chain Management",
    category: "custom",
    description:
      "Enterprise solution for tracking inventory, managing suppliers, and optimizing logistics operations.",
    image: supplyImg,
    tech: ["Angular", "Java", "Oracle", "Microservices"],
    liveUrl: "https://example-supply.com",
    githubUrl: "https://github.com/example/supply",
    featured: true,
  },
  {
    id: 5,
    title: "Social Learning Platform",
    category: "webapp",
    description:
      "Interactive e-learning platform with live streaming, progress tracking, and collaborative features.",
    image: learningImg,
    tech: ["Next.js", "WebRTC", "Redis", "AWS"],
    liveUrl: "https://example-learning.com",
    githubUrl: "https://github.com/example/learning",
    featured: false,
  },
  {
    id: 6,
    title: "Restaurant POS System",
    category: "custom",
    description:
      "Point-of-sale system with order management, inventory tracking, and analytics for restaurant chains.",
    image: posImg,
    tech: ["React", "Express", "MySQL", "PWA"],
    liveUrl: "https://example-pos.com",
    githubUrl: "https://github.com/example/pos",
    featured: false,
  },
  {
    id: 7,
    title: "Fashion E-Commerce Store",
    category: "ecommerce",
    description:
      "A stylish and modern e-commerce platform for a fashion brand, featuring a clean UI and seamless checkout process.",
    image: fashionImg,
    tech: ["Shopify", "Liquid", "JavaScript", "TailwindCSS"],
    liveUrl: "https://example-fashion.com",
    githubUrl: "https://github.com/example/fashion",
    featured: false,
  },
  {
    id: 8,
    title: "Travel Booking App",
    category: "mobile",
    description:
      "A mobile application for booking flights, hotels, and rental cars, with a focus on user experience and intuitive design.",
    image: travelImg,
    tech: ["Flutter", "Dart", "Firebase", "Google Maps API"],
    liveUrl: "https://example-travel.com",
    githubUrl: "https://github.com/example/travel",
    featured: true,
  },
  {
    id: 9,
    title: "Grocery Delivery Platform",
    category: "ecommerce",
    description:
      "A real-time grocery ordering and delivery app with inventory tracking, geolocation, and wallet integration.",
    image: groceryImg,
    tech: ["Next.js", "Firebase", "PostgreSQL", "Razorpay"],
    liveUrl: "https://example-grocery.com",
    githubUrl: "https://github.com/example/grocery",
    featured: false,
  },
  {
    id: 10,
    title: "Fitness Tracker App",
    category: "mobile",
    description: "A mobile app to track fitness activities and set goals.",
    image: fitness,
    tech: ["React Native", "Firebase", "Google Fit API"],
    liveUrl: "https://example-fitness.com",
    githubUrl: "https://github.com/example/fitness",
    featured: false,
  },
  {
    id: 11,
    title: "Real Estate Platform",
    category: "webapp",
    description:
      "A platform for real estate agents to manage their listings and clients.",
    image: real,
    tech: ["React", "Node.js", "PostgreSQL", "Google Maps API"],
    liveUrl: "https://example-real-estate.com",
    githubUrl: "https://github.com/example/real-estate",
    featured: false,
  },
];

const filters = [
  { id: "all", label: "All Projects" },
  { id: "ecommerce", label: "E-Commerce" },
  { id: "webapp", label: "Web Apps" },
  { id: "mobile", label: "Mobile" },
  { id: "custom", label: "Custom Solutions" },
];

const PortfolioSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [filteredProjects, setFilteredProjects] = useState(allProjects);

  // Effect for filtering projects when activeFilter changes
  useEffect(() => {
    if (activeFilter === "all") {
      setFilteredProjects(allProjects);
    } else {
      setFilteredProjects(
        allProjects.filter((project) => project.category === activeFilter)
      );
    }
  }, [activeFilter]);

  // Effect for handling scroll animations when filteredProjects change
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = sectionRef.current?.querySelectorAll(".animate-on-scroll");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [filteredProjects]);

  const featuredProjects = filteredProjects.filter((p) => p.featured);
  const regularProjects = filteredProjects.filter((p) => !p.featured);

  return (
    <section
      id="portfolio"
      ref={sectionRef}
      className="py-10 relative overflow-hidden"
    >
      <div className="absolute inset-0 section-gradient"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Our{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Portfolio
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Showcasing our expertise through successful projects that have
            transformed businesses and delighted users
          </p>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 hover-target ${
                  activeFilter === filter.id
                    ? "bg-primary text-primary-foreground shadow-glow"
                    : "bg-secondary text-secondary-foreground hover:bg-primary/20"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {filteredProjects.length > 0 ? (
          <>
            {/* Featured Projects */}
            {featuredProjects.length > 0 && (
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                {featuredProjects.map((project, index) => (
                  <div
                    key={project.id}
                    className="premium-glass glow-border animate-on-scroll group hover-target rounded-2xl p-6"
                    style={{ animationDelay: `${index * 150}ms` }}
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
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 px-4 py-2 bg-primary rounded-lg text-primary-foreground text-sm hover:bg-primary-glow transition-colors"
                          >
                            <ExternalLink className="h-4 w-4" />
                            <span>Live Demo</span>
                          </a>
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
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
                      <p className="text-muted-foreground group-hover:text-foreground mb-4 leading-relaxed">
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
            )}

            {/* Regular Projects Grid */}
            {regularProjects.length > 0 && (
              <div className="grid md:grid-cols-3 gap-6">
                {regularProjects.map((project, index) => (
                  <div
                    key={project.id}
                    className="premium-glass animate-on-scroll group hover-target cursor-pointer rounded-xl p-4"
                    style={{
                      animationDelay: `${
                        (index + featuredProjects.length) * 150
                      }ms`,
                    }}
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
                    <p className="text-muted-foreground group-hover:text-foreground text-sm mb-4 line-clamp-2">
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
            )}
          </>
        ) : (
          <div className="text-center py-16 animate-on-scroll">
            <XCircle className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-2xl font-bold text-foreground mb-2">
              No Projects Found
            </h3>
            <p className="text-muted-foreground">
              There are no projects matching the selected filter. Try a
              different category.
            </p>
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-16 animate-on-scroll">
          <button className="hero-button">View All Projects</button>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
