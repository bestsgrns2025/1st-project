import { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const StartProjectSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    service: '',
    budget: '',
    message: '',
    timeline: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    try {
      const response = await fetch(`${apiUrl}/api/inquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Project Inquiry Sent!",
          description: "We'll get back to you within 24 hours to discuss your project.",
        });
        setFormData({
          name: '',
          email: '',
          company: '',
          service: '',
          budget: '',
          message: '',
          timeline: ''
        });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      toast({
        title: "Error Sending Inquiry",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const services = [
    'Offshore Development',
    'E-Commerce Solutions',
    'Web App Development',
    'Mobile App Development',
    'Custom Software',
    'UI/UX Design',
    'DevOps & Cloud',
    'Consultation'
  ];

  const budgetRanges = [
    'Under $10,000',
    '$10,000 - $25,000',
    '$25,000 - $50,000',
    '$50,000 - $100,000',
    'Over $100,000'
  ];

  return (
    <section id="start-project" ref={sectionRef} className="py-8 relative overflow-hidden">
      <div className="absolute inset-0"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Start Your <span className="bg-gradient-primary bg-clip-text text-transparent">Project</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Have an idea? Let's build it together. Fill out the form below to get started.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Contact Form */}
          <div className="bg-gradient-primary glow-border animate-on-scroll rounded-2xl p-8">
            <h3 className="text-white text-2xl font-bold mb-6 text-foreground">Project Details</h3>
            <form onSubmit={handleSubmit} className="space-y-6 " >
              {/* Name and Email */}
              <div className=" grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-white block text-sm font-medium mb-2 text-foreground">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all hover-target"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="text-white block text-sm font-medium mb-2 text-foreground">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all hover-target"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              {/* Company and Service */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-white block text-sm font-medium mb-2 text-foreground">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all hover-target"
                    placeholder="Your company"
                  />
                </div>
                <div>
                  <label className="text-white block text-sm font-medium mb-2 text-foreground">
                    Service Needed *
                  </label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all hover-target"
                  >
                    <option value="">Select a service</option>
                    {services.map((service) => (
                      <option key={service} value={service}>{service}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Budget and Timeline */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-white block text-sm font-medium mb-2 text-foreground">
                    Project Budget
                  </label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all hover-target"
                  >
                    <option value="">Select budget range</option>
                    {budgetRanges.map((budget) => (
                      <option key={budget} value={budget}>{budget}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-white block text-sm font-medium mb-2 text-foreground">
                    Timeline
                  </label>
                  <input
                    type="text"
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all hover-target"
                    placeholder="e.g., 3-6 months"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="text-white block text-sm font-medium mb-2 text-foreground">
                  Project Details *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all hover-target resize-none"
                  placeholder="Tell us about your project requirements, goals, and any specific features you need..."
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="hero-button w-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Project Inquiry</span>
                    <Send className="ml-2 h-5 w-5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StartProjectSection;
