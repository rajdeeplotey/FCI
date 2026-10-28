export default function HeroBackgroundVideo() {
  return (
    <video
      aria-hidden="true"
      autoPlay
      className="hero-background-video"
      loop
      muted
      playsInline
      preload="auto"
      src="/videos/hero.mp4"
      tabIndex={-1}
    />
  );
}
