import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import logo from './assets/logo.png';

// Dynamically load gallery images
const imageModules = import.meta.glob('./assets/img*.{jpg,jpeg,png,webp}', { eager: true });
const galleryImages = Object.values(imageModules).map((mod: any) => mod.default);

function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      const target = e.target as HTMLElement;
      if (target.tagName.toLowerCase() === 'a' || target.tagName.toLowerCase() === 'button' || target.closest('a') || target.closest('button')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:flex items-center justify-center"
      animate={{ 
        x: mousePosition.x - 16, 
        y: mousePosition.y - 16,
        scale: isHovering ? 2 : 1,
        backgroundColor: isHovering ? 'rgba(242, 242, 240, 1)' : 'rgba(242, 242, 240, 0)',
        border: isHovering ? '1px solid transparent' : '1px solid rgba(242, 242, 240, 0.5)'
      }}
      transition={{ type: 'tween', ease: 'easeOut', duration: 0.15 }}
    >
      {isHovering && <span className="text-[4px] text-dark font-accent font-bold tracking-widest">DRAG</span>}
    </motion.div>
  );
}

function VinylGrooves() {
  return (
    <motion.div 
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-10 pointer-events-none border border-offwhite"
    >
      {[...Array(8)].map((_, i) => (
        <div key={i} className="absolute inset-0 rounded-full border border-offwhite m-auto" style={{ width: `${100 - i * 10}%`, height: `${100 - i * 10}%` }} />
      ))}
    </motion.div>
  );
}

function Countdown() {
  const targetDate = new Date('2026-10-04T18:30:00Z').getTime(); 
  const [timeLeft, setTimeLeft] = useState(targetDate - new Date().getTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(targetDate - new Date().getTime());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft <= 0) {
    return (
      <div className="font-display text-4xl tracking-widest uppercase">Auditions are on.</div>
    );
  }

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((timeLeft % (1000 * 60)) / 1000);

  return (
    <div className="flex gap-8 justify-center items-end border-t border-b border-offwhite/20 py-8 my-16">
      {[ {v: days, l: 'Days'}, {v: hours, l: 'Hrs'}, {v: mins, l: 'Min'}, {v: secs, l: 'Sec'} ].map((item, i) => (
        <div key={i} className="flex flex-col items-center w-16 md:w-24">
          <span className="font-display text-5xl md:text-7xl">{String(item.v).padStart(2, '0')}</span>
          <span className="text-[10px] md:text-xs font-accent tracking-widest uppercase text-grey-400 mt-2">{item.l}</span>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const { scrollYProgress } = useScroll();
  const smoothY = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  
  // Parallax transforms
  const heroTextX = useTransform(smoothY, [0, 1], ['0%', '-50%']);
  const galleryX = useTransform(smoothY, [0.3, 1], ['10%', '-80%']);

  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Play audio on first user interaction to bypass browser autoplay blocks
  useEffect(() => {
    // Check if browser immediately blocked the autoPlay
    if (audioRef.current && audioRef.current.paused) {
      setIsPlaying(false);
    }
    const playOnInteract = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(e => console.log("Autoplay failed:", e));
      }
      document.removeEventListener('click', playOnInteract);
      document.removeEventListener('touchstart', playOnInteract);
      document.removeEventListener('scroll', playOnInteract);
    };

    document.addEventListener('click', playOnInteract, { once: true });
    document.addEventListener('touchstart', playOnInteract, { once: true });
    document.addEventListener('scroll', playOnInteract, { once: true });

    return () => {
      document.removeEventListener('click', playOnInteract);
      document.removeEventListener('touchstart', playOnInteract);
      document.removeEventListener('scroll', playOnInteract);
    };
  }, []);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log("Audio play failed:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="min-h-screen font-body relative bg-dark text-offwhite overflow-x-hidden">
      <CustomCursor />
      
      {/* GLOBAL NOISE / FILM GRAIN OVERLAY */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] mix-blend-screen bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      {/* HEADER: LOGO */}
      <header className="absolute top-0 left-0 w-full p-6 md:p-10 flex justify-between items-start z-40">
        <img src={logo} alt="Antrakshar Logo" className="w-16 h-16 md:w-24 md:h-24 mix-blend-screen object-contain" />
        <div className="text-right">
          <p className="font-accent text-[10px] md:text-xs tracking-widest uppercase">Auditions</p>
          <p className="font-accent text-[10px] md:text-xs tracking-widest uppercase text-grey-400">Oct 2026</p>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative h-[100vh] flex flex-col justify-end pb-20 overflow-hidden">
        <VinylGrooves />
        
        <div className="relative z-10 w-full">
          <motion.div style={{ x: heroTextX }} className="whitespace-nowrap flex pl-6 md:pl-10">
            <h1 className="font-display text-[15vw] md:text-[12vw] leading-[0.8] tracking-tighter uppercase">
              Antrakshar Auditions <span className="text-transparent" style={{ WebkitTextStroke: '1px #f2f2f0' }}>Antrakshar Auditions</span>
            </h1>
          </motion.div>
        </div>

        <button 
          onClick={toggleAudio}
          className="absolute bottom-6 md:bottom-10 left-6 md:left-10 flex gap-4 items-center z-20 cursor-none group"
        >
          {/* Soundwave equalizer */}
          <div className="flex items-end gap-[2px] h-4">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="w-[2px] bg-offwhite"
                animate={{ height: isPlaying ? ['20%', '100%', '30%'] : '20%' }}
                transition={isPlaying ? { duration: 0.8, repeat: Infinity, ease: 'linear', delay: i * 0.1 } : { duration: 0.3 }}
              />
            ))}
          </div>
          <span className="font-accent text-xs tracking-widest uppercase transition-colors group-hover:text-grey-400">
            {isPlaying ? 'Sound On' : 'Sound Off'}
          </span>
        </button>

        <audio 
          ref={audioRef} 
          src="/audio.mp3" 
          loop 
          preload="auto" 
          autoPlay 
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      </section>

      {/* INVITATION MESSAGE (Scroll-revealed) */}
      <section className="py-32 md:py-48 px-6 md:px-20 max-w-5xl mx-auto border-t border-offwhite/10 relative">
        <div className="absolute top-10 left-6 md:left-20 font-accent text-xs tracking-widest uppercase text-grey-600">[ 01. INTRO ]</div>
        
        <p className="font-accent text-xl md:text-3xl leading-relaxed md:leading-relaxed tracking-tight text-grey-400">
          "You were once here. <span className="text-offwhite">Come back and cheer for the next batch.</span>"
        </p>

        <div className="mt-16 md:mt-24 font-body font-light text-lg md:text-2xl leading-relaxed md:leading-relaxed text-grey-400 max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            Helloo! Hum aap sabhi seniors aur super seniors ko apne auditions mein invite karna chahte hain. 
            <br/><br/>
            Aapko apni society ke naye chehre dekhne ka mauka milega. Hum bahut khush honge agar aap aayein. 
            <br/><br/>
            <span className="text-offwhite font-accent italic">Ummeed rahegi aap log aaoge!</span>
          </motion.p>
        </div>
      </section>

      {/* EDITORIAL GALLERY / FILM STRIP */}
      <section className="py-24 md:py-32 relative overflow-hidden bg-offwhite text-dark">
        <div className="absolute top-10 right-6 md:right-20 font-accent text-xs tracking-widest uppercase text-grey-400">[ 02. ARCHIVE ]</div>
        
        <div className="px-6 md:px-20 mb-10">
          <h2 className="font-display text-5xl md:text-8xl tracking-tighter uppercase">Our Family</h2>
        </div>

        {/* Horizontal scrolling film strip */}
        <div className="w-full overflow-hidden h-[40vh] md:h-[60vh] mt-10">
          <motion.div style={{ x: galleryX }} className="flex gap-4 md:gap-8 h-full px-6 md:px-20 items-center">
            {galleryImages.map((src, idx) => (
              <div key={idx} className="relative h-full flex-shrink-0 group overflow-hidden">
                {/* Images aspect ratio ranges to look editorial */}
                <img 
                  src={src} 
                  alt="Antrakshar Family" 
                  className={`h-full w-auto object-cover transition-transform duration-1000 group-hover:scale-105 ${idx % 2 === 0 ? 'aspect-[3/4]' : 'aspect-square'}`} 
                />
                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-dark/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <p className="text-offwhite font-accent text-[10px] tracking-widest uppercase">Record {String(idx + 1).padStart(2, '0')}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* DATES, COUNTDOWN & CTA */}
      <section className="py-32 md:py-48 px-6 md:px-20 border-b border-offwhite/10 relative">
        <div className="absolute top-10 left-6 md:left-20 font-accent text-xs tracking-widest uppercase text-grey-600">[ 03. THE EVENT ]</div>
        
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <h2 className="font-display text-6xl md:text-8xl tracking-tighter uppercase">5 & 6 Oct 2026</h2>
          
          <div className="w-full max-w-2xl">
            <Countdown />
          </div>

          <p className="font-accent text-sm md:text-base tracking-widest uppercase text-grey-400 mb-12 max-w-sm">
            Venue and timings are on our Instagram, please follow us.
          </p>

          <a 
            href="https://instagram.com/Antrakshar" 
            target="_blank" 
            rel="noreferrer"
            className="group block bg-offwhite text-dark py-6 md:py-8 px-10 md:px-16 hover:bg-dark hover:text-offwhite border border-offwhite transition-colors duration-500 rounded-full"
          >
            <div className="flex items-center gap-4 overflow-hidden">
              <span className="font-display text-2xl md:text-4xl tracking-wider uppercase whitespace-nowrap group-hover:-translate-y-full transition-transform duration-500">Follow us on Instagram</span>
              <span className="font-display text-2xl md:text-4xl tracking-wider uppercase whitespace-nowrap absolute translate-y-full group-hover:translate-y-0 transition-transform duration-500">@Antrakshar</span>
            </div>
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 md:py-16 px-6 md:px-20 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full border border-offwhite flex items-center justify-center animate-spin-slow">
            <div className="w-1 h-1 bg-offwhite rounded-full"></div>
          </div>
          <span className="font-accent text-xs tracking-widest uppercase text-grey-400">Est. VIPS</span>
        </div>
        
        <p className="font-display text-3xl md:text-5xl tracking-widest uppercase">Team Antrakshar</p>
      </footer>
    </div>
  );
}
