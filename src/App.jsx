import React, { useEffect, useRef, useState, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import { ChevronDown, ArrowRight, ExternalLink, Instagram, Twitter, Github, Linkedin, Mail, Code2, Globe, Database, Terminal } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Aurora from './Aurora';
import DotGrid from './DotGrid';
import TiltedCard from './TiltedCard';
import profileImg from './Gemini_Generated_Image_xuuob3xuuob3xuuo.png';
import faceImg from './face.png';
import digitImg from './digit.png';
import './index.css';

gsap.registerPlugin(ScrollTrigger);

// --- Components ---

const MathCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    const particles = [];
    const particleCount = 40;
    const symbols = ['f(x)', '∑', 'π', '∞', '√', '∫', 'Δ', 'λ', 'θ', 'sin', 'cos', 'dx', 'dy'];

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 12 + 10;
        this.symbol = symbols[Math.floor(Math.random() * symbols.length)];
        this.alpha = Math.random() * 0.2 + 0.1;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
          this.reset();
        }
      }
      draw() {
        ctx.font = `${this.size}px monospace`;
        ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
        ctx.fillText(this.symbol, this.x, this.y);
      }
    }

    for (let i = 0; i < particleCount; i++) particles.push(new Particle());

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-50" />;
};

const Magnetic = ({ children, strength = 0.5 }) => {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const onMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = element.getBoundingClientRect();
      const x = (clientX - (left + width / 2)) * strength;
      const y = (clientY - (top + height / 2)) * strength;

      gsap.to(element, { x, y, duration: 1, ease: "power3.out" });
    };

    const onMouseLeave = () => {
      gsap.to(element, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.3)" });
    };

    element.addEventListener("mousemove", onMouseMove);
    element.addEventListener("mouseleave", onMouseLeave);

    return () => {
      element.removeEventListener("mousemove", onMouseMove);
      element.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [strength]);

  return <div ref={ref} className="relative inline-block">{children}</div>;
};

const ScrollArrow = ({ targetId, isUp = false }) => {
  return (
    <Magnetic strength={0.2}>
      <div 
        onClick={() => {
          if (isUp) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        className={`w-16 h-16 rounded-full border border-white/20 flex items-center justify-center cursor-pointer hover:bg-white hover:text-black transition-colors duration-500 ${isUp ? 'rotate-180' : ''}`}
      >
        <ChevronDown size={24} />
      </div>
    </Magnetic>
  );
};

const SplitText = ({ children, className = "" }) => {
  if (typeof children !== 'string') return children;
  return (
    <span className={`${className}`}>
      {children.split("").map((char, i) => (
        <span 
          key={i} 
          className="char inline-block" 
          style={{ display: char === " " ? "inline" : "inline-block" }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
};

const AnimatedBackground = () => (
  <div className="fixed inset-0 z-[-1] pointer-events-none bg-[#020202]">
    <div className="absolute inset-0 z-0">
      <Aurora
        colorStops={["#7cff67", "#B19EEF", "#5227FF"]}
        blend={0.5}
        amplitude={1.0}
        speed={0.5}
      />
    </div>
    <div className="absolute inset-0 z-[5]">
      <DotGrid spacing={40} dotSize={1} mouseRadius={200} dotColor="rgba(124, 255, 103, 0.4)" />
    </div>
    <div className="absolute inset-0 z-10 opacity-30">
      <MathCanvas />
    </div>
    <div className="grain-overlay z-20 pointer-events-none" />
  </div>
);

const App = () => {
  const cursorRef = useRef(null);
  const cursorFollowerRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on('scroll', ScrollTrigger.update);

    const moveCursor = (e) => {
      const { clientX: x, clientY: y } = e;
      
      gsap.to(cursorRef.current, {
        x: x - 4,
        y: y - 4,
        duration: 0.1,
        ease: "none"
      });
      
      gsap.to(cursorFollowerRef.current, {
        x: x - 20,
        y: y - 20,
        duration: 0.4,
        ease: "power2.out"
      });
    };

    const handleHover = (e) => {
      const isInteractive = e.target.closest('a, button, .cursor-pointer');
      if (cursorFollowerRef.current) {
        if (isInteractive) {
          cursorFollowerRef.current.classList.add('cursor-hover');
          gsap.to(cursorRef.current, { scale: 0, opacity: 0, duration: 0.3 });
        } else {
          cursorFollowerRef.current.classList.remove('cursor-hover');
          gsap.to(cursorRef.current, { scale: 1, opacity: 1, duration: 0.3 });
        }
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleHover);

    return () => {
      lenis.destroy();
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleHover);
    };
  }, []);

  return (
    <div className="min-h-screen text-white selection:bg-violet-900/50 font-sans">
      <AnimatedBackground />
      <div id="custom-cursor" ref={cursorRef} />
      <div id="custom-cursor-follower" ref={cursorFollowerRef} />

      <nav className="fixed top-0 w-full z-[100] px-8 md:px-16 py-10 flex justify-between items-center mix-blend-difference">
        <Magnetic>
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-xl font-black tracking-tighter cursor-pointer"
          >
            VENMUGIL RAJAN.DEV
          </div>
        </Magnetic>
        <div className="flex gap-8 md:gap-16 text-[10px] font-bold tracking-[0.3em] uppercase">
          {['About', 'Skills', 'Projects', 'Contact'].map((item) => (
            <Magnetic key={item}>
              <a 
                href={`#${item.toLowerCase()}`} 
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="hover:opacity-40 transition-opacity whitespace-nowrap"
              >
                {item}
              </a>
            </Magnetic>
          ))}
        </div>
      </nav>

      <Hero id="hero" />
      
      <main className="relative z-10">
        <section id="about">
          <PinnedSection 
            title="About Me"
            description="I am Venmugil Rajan, a Computer Science graduate and a motivated, detail-oriented fresher seeking a challenging role as a Software / Full-Stack Developer in a progressive organization. I am dedicated to applying my skills in programming, web development, UI/UX design, and machine learning to deliver high-quality, secure, and visually immersive solutions while contributing to organizational growth and enhancing my professional expertise."
            image={profileImg}
          />
        </section>

        <section id="skills" className="py-40 px-8 md:px-20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-5xl md:text-8xl font-black mb-20 tracking-tighter">TECHNICAL ARSENAL</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <SkillCategory 
                title="Programming"
                icon={<Code2 size={32} />}
                skills={['C', 'C++', 'Java', 'Python', 'Machine Learning']}
              />
              <SkillCategory 
                title="Web Architecture"
                icon={<Globe size={32} />}
                skills={['HTML5', 'CSS3', 'JavaScript', 'PHP', 'MySQL']}
              />
              <SkillCategory 
                title="Ecosystem"
                icon={<Terminal size={32} />}
                skills={['Git', 'GitHub', 'Streamlit', 'Gradio', 'Jupyter']}
              />
            </div>
          </div>
        </section>

        <section id="projects">
          <h2 className="text-[15vw] font-black opacity-[0.15] select-none tracking-tighter text-center leading-none" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.1)" }}>FEATURED WORK</h2>
          
          <ParallaxSection 
            number="01"
            title="Online Leave Portal"
            subtitle="Full-stack portal for student-teacher leave management with PHP/MySQL backend."
            image="https://images.unsplash.com/photo-1484417894907-623942c8ee29?auto=format&fit=crop&q=80&w=2000"
            speed={0.1}
          />

          <ParallaxSection 
            number="02"
            title="Face Recognition CNN"
            subtitle="Deep learning application using Convolutional Neural Networks for real-time face identification."
            image={faceImg}
            speed={-0.05}
            objectPosition="center 35%"
            link="https://github.com/venmugilrajan/face_recognition_cnn"
            reverse
          />

          <ParallaxSection 
            number="03"
            title="Digit Recognizer"
            subtitle="Machine learning interface powered by CNN to accurately identify handwritten digits."
            image={digitImg}
            speed={0.15}
            link="https://github.com/venmugilrajan/DIGIT_RECOGNIZER_CNN"
          />
        </section>

        <section id="expertise" className="py-40 px-8 md:px-20 border-y border-white/10">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-black mb-16 tracking-tighter uppercase italic">Verified Expertise</h2>
            <div className="space-y-6">
              {[
                { name: 'JAVA SE 17 DEVELOPER – Oracle', link: 'https://catalog-education.oracle.com/pls/certview/sharebadge?id=1D3EA450257E886F877C6A8BB1ACD3C44B36D0AA8695B836071B56AC09982A84' },
                { name: 'Oracle Cloud Infrastructure – Oracle', link: 'https://catalog-education.oracle.com/ords/certview/sharebadge?id=97EAAF86588703C016AD49C5D2D1227FFF0125CB02B79F2FA21515C6C5EFF3F0' },
                { name: 'Python for Data Science – Cognitive Class', link: 'https://courses.cognitiveclass.ai/certificates/27e9670f63de45c7a1d677dea3155c8d' },
                { name: 'AWS Cloud Fundamentals – Amazon', link: 'https://venmugilrajan.github.io/portfolio/aws%20cloud%20practitioner%20essentials.pdf' },
                { name: 'Python Programming – CSC', link: 'https://venmugilrajan.github.io/portfolio/CSC-python.pdf' }
              ].map((cert, i) => (
                <Magnetic key={i} strength={0.1}>
                  <a href={cert.link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between group py-6 border-b border-white/10 w-full hover:px-4 transition-all duration-500">
                    <span className="text-2xl md:text-3xl font-bold text-white/40 group-hover:text-white transition-colors">{cert.name}</span>
                    <ExternalLink className="opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
                  </a>
                </Magnetic>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
};

const SkillCategory = ({ title, icon, skills }) => (
  <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-violet-500/50 transition-colors group">
    <div className="w-16 h-16 rounded-2xl bg-violet-600/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
      {icon}
    </div>
    <h3 className="text-2xl font-bold mb-6 tracking-tight uppercase text-violet-400">{title}</h3>
    <ul className="space-y-4">
      {skills.map((skill, i) => (
        <li key={i} className="flex items-center gap-3 text-white/50 group-hover:text-white/80 transition-colors">
          <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
          {skill}
        </li>
      ))}
    </ul>
  </div>
);

const Hero = ({ id }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      
      tl.from(".char", {
        y: 100,
        opacity: 0,
        duration: 1.5,
        ease: "expo.out",
        stagger: 0.03
      })
      .from(".hero-sub", {
        opacity: 0,
        y: 20,
        duration: 1,
        ease: "power2.out"
      }, "-=1");
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id={id} ref={containerRef} className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
      <div className="z-10 text-center uppercase tracking-tighter">
        <div className="hero-sub text-xs md:text-sm font-bold tracking-[0.8em] text-violet-300 mb-6 font-mono select-none">
          [ INITIALIZING CORE ]
        </div>
        <h1 className="text-[13vw] font-black leading-[0.8] mb-8 relative flex flex-col items-center">
          <SplitText className="block mb-2">VENMUGIL</SplitText>
          <SplitText className="block text-gradient">RAJAN</SplitText>
        </h1>
        <p className="hero-sub text-sm flex flex-col md:flex-row gap-4 items-center justify-center font-bold tracking-[0.4em] text-white/60 mb-12">
          <span>SOFTWARE DEVELOPER</span>
          <span className="hidden md:inline">•</span>
          <span>FULL-STACK ARCHITECT</span>
        </p>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
        <ScrollArrow targetId="about" />
      </div>

      <div className="absolute bottom-10 left-10 md:left-20 flex gap-6 text-white/80">
          <Magnetic><a href="https://github.com/venmugilrajan" target="_blank"><Github size={18} className="cursor-pointer hover:text-white" /></a></Magnetic>
          <Magnetic><a href="https://www.linkedin.com/in/venmugil-rajan-s-1362b3354/" target="_blank"><Linkedin size={18} className="cursor-pointer hover:text-white" /></a></Magnetic>
          <Magnetic><a href="https://leetcode.com/u/Venmugilrajans/" target="_blank"><Code2 size={18} className="cursor-pointer hover:text-white" /></a></Magnetic>
          <Magnetic><a href="https://mail.google.com/mail/u/0/?fs=1&to=venmugilrajans@gmail.com&tf=cm" target="_blank" ><Mail size={18} className="cursor-pointer hover:text-white" /></a></Magnetic>
      </div>
    </section>
  );
};

const PinnedSection = ({ title, description, image, reverse = false }) => {
  const containerRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "+=100%",
        pin: true,
        scrub: true,
      });

      gsap.from(imgRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "top top",
          scrub: 0.5
        },
        scale: 1.3,
        rotate: reverse ? -2 : 2,
        filter: "brightness(0.7) blur(4px)",
        force3D: true
      });
    }, containerRef);

    return () => ctx.revert();
  }, [reverse]);

  return (
    <section ref={containerRef} className="h-screen flex items-center justify-center relative overflow-hidden px-10">
      <div className={`w-full max-w-7xl flex flex-col md:flex-row items-center gap-20 ${reverse ? 'md:flex-row-reverse' : ''}`}>
        <div className="w-full md:w-1/2">
          <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.8]">{title}</h2>
          <p className="text-xl md:text-2xl text-white/60 max-w-md leading-relaxed font-light">{description}</p>
        </div>
        <div className="w-full md:w-1/2 aspect-square relative overflow-hidden rounded-[2rem] bg-white/[0.03] border border-white/10 p-4">
          <img 
            ref={imgRef}
            src={image} 
            className="w-full h-full object-cover rounded-2xl transition-all duration-700 [will-change:transform,filter]"
            alt={title}
          />
        </div>
      </div>
    </section>
  );
};

const ParallaxSection = ({ number, title, subtitle, image, speed, link = "#", reverse = false, objectPosition = "center" }) => {
  const sectionRef = useRef(null);

  return (
    <section ref={sectionRef} className={`relative min-h-[80vh] py-32 px-8 md:px-20 flex flex-col md:flex-row items-center gap-16 ${reverse ? 'md:flex-row-reverse' : ''}`}>
      <div className="w-full md:w-5/12">
        <span className="text-8xl font-black opacity-10 leading-none block mb-6 font-mono">{number}</span>
        <h2 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-none">{title}</h2>
        <p className="text-xl md:text-2xl text-white/50 mb-12 max-w-md font-light">{subtitle}</p>
        <Magnetic>
          <a 
            href={link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-6 group cursor-pointer border border-white/20 px-8 py-4 rounded-full hover:bg-white hover:text-black transition-all duration-500"
          >
            <span className="text-sm font-black tracking-[0.2em] uppercase">VIEW REPO</span>
            <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
          </a>
        </Magnetic>
      </div>
      <div className="w-full md:w-7/12 flex items-center justify-center">
        <TiltedCard
          imageSrc={image}
          altText={title}
          captionText={title}
          containerHeight="500px"
          containerWidth="100%"
          imageHeight="400px"
          imageWidth="600px"
          rotateAmplitude={12}
          scaleOnHover={1.05}
          showTooltip={true}
          displayOverlayContent={true}
          overlayContent={
            <div className="p-4 bg-black/40 backdrop-blur-md rounded-xl border border-white/10">
              <p className="text-xs font-bold tracking-widest text-violet-300 uppercase">Featured Project</p>
            </div>
          }
        />
      </div>
    </section>
  );
};

const Footer = () => {
    return (
        <footer id="contact" className="relative h-screen flex flex-col items-center justify-center p-10 overflow-hidden">

            <div className="absolute inset-0 z-[-1] overflow-hidden">
                <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-violet-900/10 blur-[150px] rounded-full" />
                <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-900/10 blur-[150px] rounded-full" />
            </div>

            <div className="text-center relative z-20">
                <div className="text-xs font-bold tracking-[1em] text-violet-400 mb-12 uppercase">Available for work</div>
                <h2 className="text-[9vw] font-black tracking-tighter mb-16 leading-none uppercase">
                    Connect <br /> <span className="text-gradient">Globally.</span>
                </h2>
                <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
                    <Magnetic strength={0.3}>
                        <a href="https://mail.google.com/mail/?view=cm&fs=1&to=venmugilrajans@gmail.com" target="_blank" className="px-16 py-6 bg-white text-black font-black text-xl rounded-full hover:scale-105 transition-transform flex items-center gap-4">
                            SAY HI <Mail size={24} strokeWidth={3} />
                        </a>
                    </Magnetic>
                    <Magnetic strength={0.2}>
                       <a href="https://venmugilrajan.github.io/portfolio/VENMUGIL%20RAJAN%20S-%20RES.pdf" target="_blank" className="px-12 py-6 border border-white/20 text-white font-bold text-lg rounded-full hover:bg-white/5 transition-colors">
                            DOWNLOAD RESUME
                        </a>
                    </Magnetic>
                </div>
            </div>

            <div className="absolute bottom-10 w-full px-10 flex flex-col md:flex-row justify-between items-center gap-8 text-[9px] font-bold tracking-[0.4em] uppercase text-white/50 z-20">
                <div>© 2026 VENMUGIL RAJAN • CRAFTED WITH REACT & GSAP</div>
                <div className="flex gap-12 text-white/60">
                    <a href="https://github.com/venmugilrajan" target="_blank" className="hover:text-white transition-colors">GITHUB</a>
                    <a href="https://www.linkedin.com/in/venmugil-rajan-s-1362b3354/" target="_blank" className="hover:text-white transition-colors">LINKEDIN</a>
                    <a href="https://leetcode.com/u/Venmugilrajans/" target="_blank" className="hover:text-white transition-colors">LEETCODE</a>
                    <a href="https://mail.google.com/mail/?view=cm&fs=1&to=venmugilrajans@gmail.com" target="_blank" className="hover:text-white transition-colors">EMAIL</a>
                </div>
            </div>
        </footer>
    );
};

export default App;
