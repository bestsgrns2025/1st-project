import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom'; // Assuming react-router-dom for navigation

const VideoPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center py-12 px-4">
      <div className="max-w-4xl w-full">
        <Link to="/" className="flex items-center text-primary hover:underline mb-8">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8">
          Our <span className="bg-gradient-primary bg-clip-text text-transparent">Demo Video</span>
        </h1>

        <div className="aspect-video w-full bg-gray-800 rounded-lg overflow-hidden mb-8">
          {/* Replace with your actual video embed code (e.g., YouTube iframe) */}
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ" // Example YouTube video
            title="Demo Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        <p className="text-lg text-muted-foreground text-center mb-8">
          This page showcases our demo video. You can replace the embedded video with your own content.
        </p>

        <div className="text-center">
          <p className="text-muted-foreground">
            For more videos and technical insights, visit our <a href="#" className="text-primary hover:underline">YouTube channel</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoPage;
