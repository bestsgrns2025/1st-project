import { useEffect, useRef } from 'react';

const VideoSection = () => {
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

  return (
    <section id="video-section" ref={sectionRef} className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 section-gradient"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Our <span className="bg-gradient-primary bg-clip-text text-transparent">Videos</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore our latest projects and technical insights.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="premium-glass glow-border animate-on-scroll rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-6 text-foreground">Demo Video Placeholder</h3>
            <div className="aspect-video w-full bg-gray-800 rounded-lg flex items-center justify-center text-muted-foreground">
              <p>Video content will be embedded here.</p>
            </div>
            <p className="text-muted-foreground text-center mt-4">
              This section is a placeholder for your video content. You can embed YouTube, Vimeo, or self-hosted videos here.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
