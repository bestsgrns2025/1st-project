import { useEffect, useRef, useState } from 'react';
import { MapPin, Phone, Mail, Clock, CheckCircle, Send, Loader2, AlertTriangle, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from './ui/dialog';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

import { useEffect, useRef, useState, useCallback } from 'react';
import { MapPin, Phone, Mail, Clock, CheckCircle, Send, Loader2, AlertTriangle, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from './ui/dialog';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

const InquiryForm = ({ setStatus, status, setOpen }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    service: '',
    budget: '',
    timeline: '',
    message: '',
    latitude: null as number | null,
    longitude: null as number | null,
  });
  const [isGeolocationLoading, setIsGeolocationLoading] = useState(true);

  const fetchGeolocation = useCallback(() => {
    if (navigator.geolocation) {
      setIsGeolocationLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
          setIsGeolocationLoading(false);
        },
        (error) => {
          console.error('Error getting geolocation:', error);
          setIsGeolocationLoading(false);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      console.log('Geolocation is not supported by this browser.');
      setIsGeolocationLoading(false);
    }
  }, []);

  useEffect(() => {
    // Fetch geolocation when the form is opened (assuming setOpen is true when dialog is open)
    if (setOpen) { // setOpen is a function, so this check is for its existence
      fetchGeolocation();
    }
  }, [fetchGeolocation, setOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/inquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', company: '', service: '', budget: '', timeline: '', message: '', latitude: null, longitude: null });
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center p-8 bg-background">
        <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
        <h3 className="mt-4 text-xl font-semibold">Inquiry Sent!</h3>
        <p className="mt-2 text-muted-foreground">Thank you for your message. We will get back to you shortly.</p>
        <Button onClick={() => setOpen(false)} className="mt-6">Close</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input name="name" placeholder="Your Name" required value={formData.name} onChange={handleInputChange} />
        <Input name="email" type="email" placeholder="Your Email" required value={formData.email} onChange={handleInputChange} />
      </div>
      <Input name="company" placeholder="Your Company (Optional)" value={formData.company} onChange={handleInputChange} />
      <Select name="service" onValueChange={(value) => handleSelectChange('service', value)} required>
        <SelectTrigger><SelectValue placeholder="Select a Service" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="web-development">Web Development</SelectItem>
          <SelectItem value="mobile-app-development">Mobile App Development</SelectItem>
          <SelectItem value="ui-ux-design">UI/UX Design</SelectItem>
          <SelectItem value="digital-marketing">Digital Marketing</SelectItem>
          <SelectItem value="other">Other</SelectItem>
        </SelectContent>
      </Select>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input name="budget" placeholder="Project Budget (Optional)" value={formData.budget} onChange={handleInputChange} />
        <Input name="timeline" placeholder="Project Timeline (Optional)" value={formData.timeline} onChange={handleInputChange} />
      </div>
      <Textarea name="message" placeholder="Your Message" required value={formData.message} onChange={handleInputChange} />
      <DialogFooter>
        <Button type="submit" className="w-full" disabled={status === 'loading' || isGeolocationLoading}>
          {status === 'loading' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isGeolocationLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {status === 'loading' || isGeolocationLoading ? 'Getting Location...' : 'Send Message'}
        </Button>
      </DialogFooter>
      {status === 'error' && <p className="text-red-500 text-center text-sm mt-2">Something went wrong. Please try again.</p>}
      {!isGeolocationLoading && !formData.latitude && !formData.longitude && (
        <p className="text-yellow-500 text-center text-sm mt-2">Location not detected. Please ensure location services are enabled.</p>
      )}
    </form>
  );
};

const ContactSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<FormStatus>('idle');

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
      details: ['123 Tech Street', 'Innovation District', ],
      link: 'https://maps.google.com'
    },
    {
      icon: Phone,
      title: 'Phone Number',
      details: ['+6597969414', '+91 99163 97739'],
      link: '+91 99163 97739'
    },
    {
      icon: Mail,
      title: 'Email Address',
      details: ['shah@pbm.sg', 'support@bestsg.com'],
      link: 'rn.bestsg2025@gmail.com'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: ['Mon - Fri: 9:00 AM - 6:00 PM', 'Sat: 10:00 AM - 4:00 PM', 'Sun: Closed'],
      link: null
    }
  ];

  return (
    <section id="contact" ref={sectionRef} className="py-6 relative overflow-hidden">
      <div className="absolute inset-0 section-gradient"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 animate-on-scroll">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Get In <span className="bg-gradient-primary bg-clip-text text-transparent">Touch</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Ready to transform your business? Let's discuss your project and create something amazing together.
          </p>
          <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setStatus('idle'); }}>
            <DialogTrigger asChild>
              <Button size="lg" className="glow-on-hover">Start Your Project</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Start a Project</DialogTitle>
                <DialogDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </DialogDescription>
              </DialogHeader>
              <InquiryForm setStatus={setStatus} status={status} setOpen={setOpen} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-8 animate-on-scroll">
            <div className="premium-glass rounded-xl p-6">
              <h4 className="text-xl font-semibold mb-4 text-foreground">Our Process</h4>
              <div className="space-y-4">
                {[ { step: '1', title: 'Initial Consultation', desc: 'Discuss your project requirements and goals' }, { step: '2', title: 'Proposal & Planning', desc: 'Detailed project plan and timeline delivery' }, { step: '3', title: 'Development & Testing', desc: 'Agile development with regular updates' }, { step: '4', title: 'Launch & Support', desc: 'Deployment and ongoing maintenance' } ].map((process, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">{process.step}</div>
                    <div>
                      <h5 className="font-medium text-foreground">{process.title}</h5>
                      <p className="text-sm text-muted-foreground">{process.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl text-white font-bold mb-6 text-foreground text-center">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            {info.link ? <a href={info.link} className="hover:text-primary transition-colors">{detail}</a> : detail}
                          </p>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[ { icon: CheckCircle, text: '24h Response Time' }, { icon: CheckCircle, text: 'Free Consultation' }, { icon: CheckCircle, text: 'NDA Protection' }, { icon: CheckCircle, text: 'Quality Guarantee' } ].map((guarantee, index) => (
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
