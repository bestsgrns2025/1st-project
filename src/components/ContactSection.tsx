import { useEffect, useRef } from 'react';
import { MapPin, Phone, Mail, Clock, CheckCircle } from 'lucide-react';

const ContactSection = () => {
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

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Office Location',
      details: ['123 Tech Street', 'Innovation District', 'San Francisco, CA 94105'],
      link: 'https://maps.google.com'
    },
    {
      icon: Phone,
      title: 'Phone Number',
      details: ['+6597969414', '+1 (555) 987-6543'],
      link: 'tel:+15551234567'
    },
    {
      icon: Mail,
      title: 'Email Address',
      details: ['shah@pbm.sg', 'support@techflow.com'],
      link: 'mailto:hello@techflow.com'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: ['Mon - Fri: 9:00 AM - 6:00 PM', 'Sat: 10:00 AM - 4:00 PM', 'Sun: Closed'],
      link: null
    }
  ];

  return (
    <section id="contact" ref={sectionRef} className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 section-gradient"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Get In <span className="bg-gradient-primary bg-clip-text text-transparent">Touch</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ready to transform your business? Let's discuss your project and create something amazing together
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-8 animate-on-scroll">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-foreground text-center">Contact Information</h3>
              <div className="space-y-6">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <div key={index} className="flex items-start space-x-4 p-4 rounded-xl bg-card/50 border border-border/50 hover:border-primary/50 transition-all duration-300 hover-target group">
                      <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2 text-foreground">{info.title}</h4>
                        {info.details.map((detail, detailIndex) => (
                          <p key={detailIndex} className="text-muted-foreground">
                            {info.link ? (
                              <a href={info.link} className="hover:text-primary transition-colors">
                                {detail}
                              </a>
                            ) : (
                              detail
                            )}
                          </p>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Process Steps */}
            <div className="premium-glass rounded-xl p-6">
              <h4 className="text-xl font-semibold mb-4 text-foreground">Our Process</h4>
              <div className="space-y-4">
                {[
                  { step: '1', title: 'Initial Consultation', desc: 'Discuss your project requirements and goals' },
                  { step: '2', title: 'Proposal & Planning', desc: 'Detailed project plan and timeline delivery' },
                  { step: '3', title: 'Development & Testing', desc: 'Agile development with regular updates' },
                  { step: '4', title: 'Launch & Support', desc: 'Deployment and ongoing maintenance' }
                ].map((process, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      {process.step}
                    </div>
                    <div>
                      <h5 className="font-medium text-foreground">{process.title}</h5>
                      <p className="text-sm text-muted-foreground">{process.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: CheckCircle, text: '24h Response Time' },
                { icon: CheckCircle, text: 'Free Consultation' },
                { icon: CheckCircle, text: 'NDA Protection' },
                { icon: CheckCircle, text: 'Quality Guarantee' }
              ].map((guarantee, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 rounded-lg bg-accent/10 border border-accent/20">
                  <guarantee.icon className="h-5 w-5 text-accent" />
                  <span className="text-sm font-medium text-foreground">{guarantee.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;