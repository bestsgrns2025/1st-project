import { useEffect, useRef } from 'react';
import { Linkedin, Twitter, Github, Mail } from 'lucide-react';

// ✅ Import team images (make sure they exist in /src/assets/images/team/)
import aliImg from "../assets/Teams/shaphoto.png";
import roselinImg from "../assets/Teams/Rubyphoto.jpeg";
import nancyImg from "../assets/Teams/nancyphoto.jfif";
// import emilyImg from "../../assets/images/team/emily.jpg";
// import davidImg from "../../assets/images/team/david.jpg";
// import lisaImg from "../../assets/images/team/lisa.jpg";

const TeamSection = () => {
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

  const teamMembers = [
    {
      name: 'Sāvukath Ali',
      role: 'CEO & Founder',
      image: aliImg,
      bio: 'Visionary leader with 10+ years in tech industry, passionate about transforming businesses through innovation.',
      skills: ['Strategic Planning', 'Team Leadership', 'Product Vision'],
      social: {
        linkedin: 'https://linkedin.com/in/alexrodriguez',
        twitter: 'https://twitter.com/alexrodriguez',
        github: 'https://github.com/alexrodriguez'
      }
    },
    {
      name: 'Roselin Rubella',
      role: 'lead Frontend Developer',
      image: roselinImg,
      bio: 'Technology architect specializing in scalable solutions and cutting-edge development practices.',
      skills: ['System Architecture', 'Cloud Computing', 'DevOps'],
      social: {
        linkedin: 'https://linkedin.com/in/sarahchen',
        twitter: 'https://twitter.com/sarahchen',
        github: 'https://github.com/sarahchen'
      }
    },
    {
      name: 'Nancy Evanjelin',
      role: 'Lead Frontend Developer',
      image: nancyImg,
      bio: 'Frontend expert creating stunning user experiences with modern frameworks and design principles.',
      skills: ['React', 'Vue.js', 'UI/UX Design'],
      social: {
        linkedin: 'https://linkedin.com/in/michaeljohnson',
        twitter: 'https://twitter.com/michaeljohnson',
        github: 'https://github.com/michaeljohnson'
      }
    },
    // {
    //   name: 'Emily Davis',
    //   role: 'Lead Backend Developer',
    //   image: emilyImg,
    //   bio: 'Backend specialist building robust, scalable server architectures and API solutions.',
    //   skills: ['Node.js', 'Python', 'Database Design'],
    //   social: {
    //     linkedin: 'https://linkedin.com/in/emilydavis',
    //     twitter: 'https://twitter.com/emilydavis',
    //     github: 'https://github.com/emilydavis'
    //   }
    // },
    // {
    //   name: 'David Park',
    //   role: 'DevOps Engineer',
    //   image: davidImg,
    //   bio: 'Infrastructure expert ensuring seamless deployment and optimal performance across all platforms.',
    //   skills: ['AWS', 'Docker', 'Kubernetes'],
    //   social: {
    //     linkedin: 'https://linkedin.com/in/davidpark',
    //     twitter: 'https://twitter.com/davidpark',
    //     github: 'https://github.com/davidpark'
    //   }
    // },
    // {
    //   name: 'Lisa Thompson',
    //   role: 'UX/UI Designer',
    //   image: lisaImg,
    //   bio: 'Creative designer crafting intuitive interfaces that delight users and drive engagement.',
    //   skills: ['Figma', 'User Research', 'Prototyping'],
    //   social: {
    //     linkedin: 'https://linkedin.com/in/lisathompson',
    //     twitter: 'https://twitter.com/lisathompson',
    //     github: 'https://github.com/lisathompson'
    //   }
    // }
  ];

  return (
    <section id="team" ref={sectionRef} className="py-8 relative overflow-hidden scroll-mt-24">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/5 to-background"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Meet Our <span className="bg-gradient-primary bg-clip-text text-transparent">Team</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Talented professionals passionate about delivering exceptional digital solutions and driving innovation
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="premium-glass glow-border animate-on-scroll group hover-target rounded-2xl p-6"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="text-center">
                {/* Profile Image */}
                <div className="relative inline-block mb-6">
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden ring-4 ring-primary/20 group-hover:ring-primary/50 transition-all duration-300">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  {/* Status Indicator */}
                  <div className="absolute bottom-2 right-2 w-6 h-6 bg-accent rounded-full border-4 border-background flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>

                {/* Member Info */}
                <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                  {member.name}
                </h3>
                <p className="text-primary font-medium mb-4">{member.role}</p>
                <p className="text-muted-foreground group-hover:text-foreground text-sm mb-6 leading-relaxed">
                  {member.bio}
                </p>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 justify-center mb-6">
                  {member.skills.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Social Links */}
                <div className="flex justify-center space-x-4">
                  <a
                    href={member.social.linkedin}
                    className="p-2 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover-target group/social"
                  >
                    <Linkedin className="h-4 w-4 group-hover/social:scale-110 transition-transform" />
                  </a>
                  <a
                    href={member.social.twitter}
                    className="p-2 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover-target group/social"
                  >
                    <Twitter className="h-4 w-4 group-hover/social:scale-110 transition-transform" />
                  </a>
                  <a
                    href={member.social.github}
                    className="p-2 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover-target group/social"
                  >
                    <Github className="h-4 w-4 group-hover/social:scale-110 transition-transform" />
                  </a>
                  <a
                    href="#"
                    className="p-2 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover-target group/social"
                  >
                    <Mail className="h-4 w-4 group-hover/social:scale-110 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Culture Section */}
        <div className="mt-20 text-center animate-on-scroll">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="p-6">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Innovation First</h3>
              <p className="text-muted-foreground">Always exploring cutting-edge technologies and methodologies</p>
            </div>
            <div className="p-6">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Collaborative Spirit</h3>
              <p className="text-muted-foreground">Working together to achieve exceptional results for our clients</p>
            </div>
            <div className="p-6">
              <div className="text-4xl mb-4">💎</div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Quality Excellence</h3>
              <p className="text-muted-foreground">Committed to delivering the highest standards in every project</p>
            </div>
          </div>
        </div>

        {/* Join Team CTA */}
        <div className="text-center mt-8 animate-on-scroll">
          <h3 className="text-2xl font-bold mb-4 text-foreground">Want to Join Our Team?</h3>
          <p className="text-muted-foreground mb-6">We're always looking for talented individuals to join our mission</p>
          <button className="accent-button bg-gradient-primary text-white">
            View Open Positions
          </button>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
