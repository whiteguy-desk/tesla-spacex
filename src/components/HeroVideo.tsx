import React, { useState } from 'react';

export interface HeroVideoProps {
  videoMp4Path?: string;
  videoWebmPath?: string;
  posterPath?: string;
  className?: string;
}

export const HeroVideo: React.FC<HeroVideoProps> = ({
  videoMp4Path = '/videos/hero-car.mp4',
  videoWebmPath = '/videos/hero-car.webm',
  posterPath = 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1920&q=80',
  className = '',
}) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative w-full h-full overflow-hidden bg-[#030304] ${className}`}>
      {/* Video / Poster / Canvas Background */}
      {!hasError ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          poster={posterPath}
          onError={() => setHasError(true)}
          className="absolute inset-0 w-full h-full object-cover object-center scale-105 filter brightness-[0.85] contrast-[1.1] transition-opacity duration-1000 pointer-events-none"
        >
          {videoWebmPath && <source src={videoWebmPath} type="video/webm" />}
          {videoMp4Path && <source src={videoMp4Path} type="video/mp4" />}
          Your browser does not support the video tag.
        </video>
      ) : (
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{ backgroundImage: `url(${posterPath})` }}
        />
      )}

      {/* Cinematic Dark Overlays & Mesh Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030304]/80 via-[#08080a]/60 to-[#030304] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(8,8,10,0.3)_0%,_rgba(3,3,4,0.85)_100%)] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#030304]/80 via-transparent to-[#030304]/80 pointer-events-none" />

      {/* Subtle Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20 scanline-overlay" />
    </div>
  );
};

export default HeroVideo;
