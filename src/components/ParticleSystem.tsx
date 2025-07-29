import { useEffect, useState } from 'react';
import { Code, Database, Globe, Smartphone, Cpu, Cloud, Terminal, Wifi } from 'lucide-react';

const ParticleSystem = () => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    icon: any;
    size: number;
    delay: number;
  }>>([]);

  const techIcons = [
    Code, Database, Globe, Smartphone, Cpu, Cloud, Terminal, Wifi
  ];

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 20; i++) {
        const Icon = techIcons[Math.floor(Math.random() * techIcons.length)];
        newParticles.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          icon: Icon,
          size: Math.random() * 20 + 15,
          delay: Math.random() * 6
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
    window.addEventListener('resize', generateParticles);
    return () => window.removeEventListener('resize', generateParticles);
  }, []);

  return (
    <div className="particles-container">
      {particles.map((particle) => {
        const Icon = particle.icon;
        return (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              animationDelay: `${particle.delay}s`
            }}
          >
            <Icon
              size={particle.size}
              className="text-primary/20"
              style={{
                filter: 'drop-shadow(0 0 10px hsl(var(--primary) / 0.3))'
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default ParticleSystem;