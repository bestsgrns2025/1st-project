import React from 'react';

import aliImg from "../assets/Teams/shaphoto.png";
import roselinImg from "../assets/Teams/Rubyphoto.jpeg";
import nancyImg from "../assets/Teams/nancyphoto.jfif";

const teamMembers = [
    {
      name: 'Sāvukath Ali',
      image: aliImg,
    },
    {
      name: 'Roselin Rubella',
      image: roselinImg,
    },
    {
      name: 'Nancy Evanjelin',
      image: nancyImg,
    },
];

const TeamPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Meet Our <span className="bg-gradient-primary bg-clip-text text-transparent">Team</span>
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Talented professionals passionate about delivering exceptional digital solutions and driving innovation
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className="premium-glass glow-border group hover-target rounded-2xl p-6"
          >
            <div className="text-center">
              <div className="relative inline-block mb-6">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden ring-4 ring-primary/20 group-hover:ring-primary/50 transition-all duration-300">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
              </div>

              <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                {member.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamPage;