import React, { useEffect, useRef, useState, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import { ChevronDown, ArrowRight, ExternalLink, Instagram, Twitter, Github, Linkedin, Mail, Code2, Globe, Database, Terminal, Menu, X } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Aurora from './Aurora';
import DotGrid from './DotGrid';
import TiltedCard from './TiltedCard';
import profileImg from './Gemini_Generated_Image_xuuob3xuuob3xuuo.png';
import faceImg from './face.png';
import digitImg from './digit.png';
import rewardImg from './reward.jpg';
import weatherImg from './weather.png';
import repoGuardImg from './repoguard.png';
import placementPredictionImg from './placement_prediction.png';
import javaCertImg from './java_cert.png';
import pythonDsCertImg from './python_ds_cert.png';
import ociCertImg from './oci_cert.png';
import awsCertImg from './aws_cert.png';
import cscCertImg from './csc_cert.png';
import leetcodeStatsImg from './leetcode_stats.png';
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
            window.lenis?.scrollTo(0, { duration: 1.8 });
          } else {
            window.lenis?.scrollTo(`#${targetId}`, { duration: 1.8 });
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12
    }
  }
};

const itemVariants = {
  hidden: { y: 35, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 90,
      damping: 14
    }
  }
};

const App = () => {
  const [projectsContainer, setProjectsContainer] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Determine initial view from URL path
  const getViewFromPath = () => {
    const path = window.location.pathname;
    if (path === '/projects') return 'projects';
    if (path === '/feats') return 'feats';
    return 'home';
  };
  const [view, setView] = useState(getViewFromPath);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [scrollTarget, setScrollTarget] = useState(null);

  // Navigate to a view AND push the correct URL
  const navigateTo = (newView, target = null) => {
    const pathMap = { home: '/', projects: '/projects', feats: '/feats' };
    const newPath = pathMap[newView] || '/';
    window.history.pushState({ view: newView }, '', newPath);
    if (target) setScrollTarget(target);
    setView(newView);
  };

  useEffect(() => {
    const el = projectsContainer;
    if (!el) return;

    // 1. Mouse wheel translation (Vertical scroll -> Horizontal scroll)
    const handleWheel = (e) => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY * 1.2;
    };

    // 2. Click-and-Drag mouse scroll (Grab to swipe)
    let isDown = false;
    let startX;
    let scrollLeftVal;
    let hasMoved = false;

    const handleMouseDown = (e) => {
      isDown = true;
      hasMoved = false;
      startX = e.pageX - el.offsetLeft;
      scrollLeftVal = el.scrollLeft;
      
      // Temporarily disable scroll snapping and smooth behavior to avoid drag stutter
      el.style.scrollSnapType = 'none';
      el.style.scrollBehavior = 'auto';
      
      // Stop Lenis page scrolling during active drag
      window.lenis?.stop();
    };

    const handleMouseLeave = () => {
      if (isDown) {
        isDown = false;
        el.style.scrollSnapType = '';
        el.style.scrollBehavior = '';
        window.lenis?.start();
      }
    };

    const handleMouseUp = () => {
      if (isDown) {
        isDown = false;
        el.style.scrollSnapType = '';
        el.style.scrollBehavior = '';
        window.lenis?.start();
      }
    };

    const handleMouseMove = (e) => {
      if (!isDown) return;
      
      // Prevent default browser behavior (e.g. text selection, page scroll) during active drag
      e.preventDefault();
      
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 1.8; // Speed multiplier
      
      if (Math.abs(x - startX) > 6) {
        hasMoved = true;
      }
      
      el.scrollLeft = scrollLeftVal - walk;
    };

    // Prevent default browser drag start on images and links inside the slider
    const handleDragStart = (e) => {
      e.preventDefault();
    };

    // Prevent click actions if the user actually swiped/dragged
    const handleClickCapture = (e) => {
      if (hasMoved) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    el.addEventListener('mousedown', handleMouseDown);
    el.addEventListener('mouseleave', handleMouseLeave);
    el.addEventListener('mouseup', handleMouseUp);
    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('dragstart', handleDragStart);
    el.addEventListener('click', handleClickCapture, true);

    return () => {
      el.removeEventListener('wheel', handleWheel);
      el.removeEventListener('mousedown', handleMouseDown);
      el.removeEventListener('mouseleave', handleMouseLeave);
      el.removeEventListener('mouseup', handleMouseUp);
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('dragstart', handleDragStart);
      el.removeEventListener('click', handleClickCapture, true);
    };
  }, [projectsContainer]);

  useEffect(() => {
    window.scrollTo(0, 0);
    window.lenis?.scrollTo(0, { immediate: true });
  }, [view]);

  useEffect(() => {
    if (view === 'home' && scrollTarget) {
      const timer = setTimeout(() => {
        const el = document.getElementById(scrollTarget);
        if (el) {
          // Pass the DOM element directly — more reliable than a selector string with Lenis
          window.lenis?.scrollTo(el, { duration: 1.8, offset: 0 });
        }
        setScrollTarget(null);
      }, 700); // Generous delay: 350ms transition + 350ms for Lenis to fully settle
      return () => clearTimeout(timer);
    }
  }, [view, scrollTarget]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    // Handle browser back/forward buttons
    const handlePopState = (e) => {
      const v = e.state?.view || getViewFromPath();
      setView(v);
    };
    window.addEventListener('popstate', handlePopState);

    // Set the initial history entry so popstate works on first back press
    const pathMap = { home: '/', projects: '/projects', feats: '/feats' };
    const initView = getViewFromPath();
    window.history.replaceState({ view: initView }, '', pathMap[initView] || '/');

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    if (isMenuOpen || isContactOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen, isContactOpen]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      infinite: false,
      autoRaf: false,
    });
    window.lenis = lenis;

    const updateLenis = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateLenis);

    lenis.on('scroll', ScrollTrigger.update);

    return () => {
      lenis.destroy();
      window.lenis = null;
      gsap.ticker.remove(updateLenis);
    };
  }, []);

  return (
    <div className="min-h-screen text-white selection:bg-violet-900/50 font-sans">
      <AnimatedBackground />

      <nav className={`fixed top-0 w-full z-[100] transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#020202]/[0.85] backdrop-blur-md border-b border-white/[0.05] py-5 px-6 md:px-16' 
          : 'bg-transparent py-8 md:py-10 px-8 md:px-16'
      }`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center w-full">
          <Magnetic>
            <div 
              onClick={() => {
                if (view !== 'home') {
                  navigateTo('home');
                } else {
                  window.lenis?.scrollTo(0, { duration: 1.8 });
                }
              }}
              className="text-lg md:text-xl font-black tracking-tighter cursor-pointer text-white mix-blend-difference"
            >
              VENMUGIL RAJAN.DEV
            </div>
          </Magnetic>
          
          <div className="hidden md:flex gap-8 md:gap-16 text-[10px] font-bold tracking-[0.3em] uppercase">
            {['About', 'Skills', 'Projects', 'Feats', 'Contact'].map((item) => (
              <Magnetic key={item}>
                <a 
                  href={`#${item.toLowerCase()}`} 
                  onClick={(e) => {
                    e.preventDefault();
                    if (item === 'Feats') {
                      navigateTo('feats');
                    } else {
                      if (view !== 'home') {
                        navigateTo('home', item.toLowerCase());
                      } else {
                        window.lenis?.scrollTo(`#${item.toLowerCase()}`, { duration: 1.8 });
                      }
                    }
                  }}
                  className="hover:opacity-40 transition-opacity whitespace-nowrap text-white"
                >
                  {item}
                </a>
              </Magnetic>
            ))}
          </div>

          <div className="md:hidden flex items-center z-50">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-violet-400 transition-colors focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-0 h-screen w-screen bg-[#020202] z-40 flex flex-col justify-between p-10 md:hidden"
            >
              <div className="h-10" />
              <div className="flex flex-col gap-8 text-center mt-10">
                {['About', 'Skills', 'Projects', 'Feats', 'Contact'].map((item, index) => (
                  <motion.a
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setIsMenuOpen(false);
                      if (item === 'Feats') {
                        navigateTo('feats');
                      } else {
                        if (view !== 'home') {
                          navigateTo('home', item.toLowerCase());
                        } else {
                          setTimeout(() => {
                            window.lenis?.scrollTo(`#${item.toLowerCase()}`, { duration: 1.8 });
                          }, 300);
                        }
                      }
                    }}
                    className="text-3xl font-black tracking-widest uppercase hover:text-violet-400 transition-colors"
                  >
                    {item}
                  </motion.a>
                ))}
              </div>
              <div className="flex flex-col items-center gap-6 mt-auto">
                <div className="flex gap-6 text-white/80">
                  <a href="https://github.com/venmugilrajan" target="_blank" rel="noopener noreferrer" className="hover:text-violet-400 transition-colors"><Github size={20} /></a>
                  <a href="https://www.linkedin.com/in/venmugil-rajan-s-1362b3354/" target="_blank" rel="noopener noreferrer" className="hover:text-violet-400 transition-colors"><Linkedin size={20} /></a>
                  <a href="https://leetcode.com/u/Venmugilrajans/" target="_blank" rel="noopener noreferrer" className="hover:text-violet-400 transition-colors"><Code2 size={20} /></a>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      setIsMenuOpen(false);
                      setIsContactOpen(true);
                    }}
                    className="hover:text-violet-400 transition-colors cursor-pointer bg-transparent border-none p-0 focus:outline-none"
                  >
                    <Mail size={20} />
                  </button>
                </div>
                <div className="text-[8px] tracking-[0.3em] text-white/40 uppercase text-center">
                  © 2026 VENMUGIL RAJAN
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <AnimatePresence mode="wait">
        {view === 'projects' ? (
          <motion.main
            key="projects"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="relative z-10 pt-32 min-h-screen flex flex-col justify-between"
          >
          {/* Back to Home Button */}
          <div className="max-w-7xl mx-auto px-6 md:px-20 mb-6 w-full relative z-20">
            <Magnetic strength={0.2}>
              <button 
                onClick={() => navigateTo('home')} 
                className="inline-flex items-center gap-4 text-white/60 hover:text-white transition-colors text-sm font-bold tracking-[0.2em] uppercase cursor-pointer"
              >
                <ArrowRight size={18} className="rotate-180" /> BACK TO HOME
              </button>
            </Magnetic>
          </div>

          {/* Heading with WORK outline background */}
          <div className="relative w-full overflow-hidden py-4 md:py-6">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
              <h2 className="text-[18vw] font-black opacity-[0.12] tracking-tighter leading-none" style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.25)", color: "transparent" }}>WORK</h2>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-center tracking-tighter uppercase relative z-10 px-4">ALL PROJECTS</h1>
          </div>

          {/* Horizontal scroll cards wrapper — supports mouse drag on desktop, touch swipe on mobile */}
          <div ref={setProjectsContainer} data-lenis-prevent className="w-full flex overflow-x-auto gap-5 md:gap-8 py-8 md:py-10 px-4 md:px-20 no-scrollbar snap-x snap-mandatory relative z-10 select-none cursor-grab active:cursor-grabbing projects-slider-drag">
            {[
              {
                title: "Online Leave Portal",
                description: "Full-stack portal for student-teacher leave management with PHP/MySQL backend.",
                image: "https://images.unsplash.com/photo-1484417894907-623942c8ee29?auto=format&fit=crop&q=80&w=2000",
                link: "https://github.com/venmugilrajan",
                tags: ["#PHP", "#MySQL", "#HTML5", "#CSS3"]
              },
              {
                title: "Face Recognition CNN",
                description: "Deep learning application using Convolutional Neural Networks for real-time face identification.",
                image: faceImg,
                link: "https://github.com/venmugilrajan/face_recognition_cnn",
                tags: ["#Python", "#CNN", "#TensorFlow", "#OpenCV"]
              },
              {
                title: "Digit Recognizer",
                description: "Machine learning interface powered by CNN to accurately identify handwritten digits.",
                image: digitImg,
                link: "https://github.com/venmugilrajan/DIGIT_RECOGNIZER_CNN",
                tags: ["#MachineLearning", "#CNN", "#Python", "#Keras"]
              },
              {
                title: "Student Reward Site",
                description: "A comprehensive platform designed for tracking and managing student rewards and achievements.",
                image: rewardImg,
                link: "https://venmugilrajan-student-reward-points.hf.space/",
                tags: ["#Gradio", "#Python", "#HFSpace"]
              },
              {
                title: "Weather Prediction LSTM",
                description: "A deep learning system using Long Short-Term Memory (LSTM) networks to forecast weather variables and patterns.",
                image: weatherImg,
                link: "https://github.com/venmugilrajan/WEATHER_PREDICTION_LSTM",
                tags: ["#LSTM", "#RNN", "#TensorFlow", "#DataScience"]
              },
              {
                title: "RepoGuard",
                description: "A security utility for monitoring and guarding GitHub repositories against secret leaks, vulnerabilities, and unauthorized changes.",
                image: repoGuardImg,
                link: "https://github.com/venmugilrajan/RepoGuard",
                tags: ["#Security", "#Git", "#Automation", "#Python"]
              },
              {
                title: "Placement Predictor ML",
                description: "A machine learning based placement predictor that evaluates CGPA, aptitude score, and number of projects to determine placement likelihood using Random Forest Classifier.",
                image: placementPredictionImg,
                link: "https://github.com/venmugilrajan/Placement_prediction",
                tags: ["#MachineLearning", "#Python", "#Flask", "#Scikit-Learn"]
              }
            ].map((proj, idx) => (
              <ProjectCard key={idx} proj={proj} idx={idx} />
            ))}
          </div>

          {/* Bottom Back to Home Button */}
          <div className="max-w-7xl mx-auto px-6 md:px-20 py-10 flex justify-center relative z-20 w-full">
            <Magnetic strength={0.3}>
              <button 
                onClick={() => navigateTo('home')} 
                className="px-10 py-5 bg-white text-black font-black text-sm rounded-full hover:scale-105 transition-transform duration-300 flex items-center gap-4 cursor-pointer"
              >
                BACK TO HOME <ArrowRight size={18} className="rotate-180" />
              </button>
            </Magnetic>
          </div>

            <Footer onSayHiClick={() => setIsContactOpen(true)} />
          </motion.main>
        ) : view === 'feats' ? (
          <motion.main
            key="feats"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="relative z-10 pt-32 min-h-screen flex flex-col justify-between"
          >
          {/* Back to Home Button */}
          <div className="max-w-7xl mx-auto px-6 md:px-20 mb-6 w-full relative z-20">
            <Magnetic strength={0.2}>
              <button 
                onClick={() => navigateTo('home')} 
                className="inline-flex items-center gap-4 text-white/60 hover:text-white transition-colors text-sm font-bold tracking-[0.2em] uppercase cursor-pointer"
              >
                <ArrowRight size={18} className="rotate-180" /> BACK TO HOME
              </button>
            </Magnetic>
          </div>
             {/* Heading with FEATS outline background */}
          <div className="relative w-full overflow-hidden py-4 md:py-6">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
              <h2 className="text-[18vw] font-black opacity-[0.12] tracking-tighter leading-none" style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.25)", color: "transparent" }}>FEATS</h2>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-center tracking-tighter uppercase relative z-10 px-4">ACHIEVEMENTS & PROFILES</h1>
          </div>

          {/* Achievements Grid with staggered children entrance animations */}
          <motion.div 
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
            initial="hidden"
            animate="visible"
            className="max-w-7xl mx-auto px-6 md:px-20 py-10 relative z-10 w-full grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* LeetCode Profile Widget Card */}
            <motion.a 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              href="https://leetcode.com/u/Venmugilrajans/" 
              target="_blank" 
              rel="noopener noreferrer" 
            className="bg-[#0c0c0c] border border-white/20 rounded-tr-[2.5rem] rounded-bl-[2.5rem] p-5 md:p-8 flex flex-col justify-between items-center shadow-2xl min-h-[360px] md:h-[400px] hover:border-violet-500/50 transition-all duration-300 cursor-pointer block hover:scale-[1.01]"
            >
              <div className="w-full flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-500 font-black">L</div>
                  <div>
                    <h4 className="text-sm font-bold text-white leading-tight">Venmugilrajans</h4>
                    <span className="text-[10px] text-white/40">LeetCode Profile</span>
                  </div>
                </div>
              </div>

              <div className="w-full h-[200px] rounded-xl overflow-hidden bg-white/[0.03] border border-white/10 flex items-center justify-center mb-4">
                <img src={leetcodeStatsImg} className="w-full h-full object-contain" alt="Leetcode Profile Statistics" />
              </div>
              
              <span className="text-xs font-black text-white/80 uppercase tracking-wider mt-4 hover:underline">
                View Live Profile →
              </span>
            </motion.a>

            {/* Java SE 17 Developer – Oracle */}
            <motion.a 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              href="https://catalog-education.oracle.com/pls/certview/sharebadge?id=1D3EA450257E886F877C6A8BB1ACD3C44B36D0AA8695B836071B56AC09982A84"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#fcfbfa] text-[#050505] rounded-tr-[2.5rem] rounded-bl-[2.5rem] p-5 md:p-6 flex flex-col justify-between border border-black/10 min-h-[360px] md:h-[400px] shadow-2xl transition-all duration-300 cursor-pointer block hover:scale-[1.01] hover:border-violet-500/30"
            >
              <div className="w-full h-[180px] rounded-xl overflow-hidden border border-black/10 bg-white">
                <img src={javaCertImg} className="w-full h-full object-contain bg-white" alt="Java SE 17 Developer Certification" />
              </div>
              <div className="mt-4 flex-grow">
                <h3 className="text-lg font-black tracking-tight leading-tight mb-2 uppercase">JAVA SE 17 DEVELOPER – Oracle</h3>
                <div className="flex flex-wrap gap-2">
                  {["#Java", "#Oracle", "#Backend", "#SoftwareDevelopment"].map((tag) => (
                    <span key={tag} className="text-[9px] font-bold text-violet-700 bg-violet-700/5 px-2 py-0.5 rounded-full">{tag}</span>
                  ))}
                </div>
              </div>
              <span className="text-xs font-black text-violet-700 hover:text-violet-900 transition-colors uppercase tracking-wider mt-4 block">
                Verify Certificate →
              </span>
            </motion.a>

            {/* Python for Data Science – Cognitive Class */}
            <motion.a 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              href="https://courses.cognitiveclass.ai/certificates/27e9670f63de45c7a1d677dea3155c8d"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#fcfbfa] text-[#050505] rounded-tr-[2.5rem] rounded-bl-[2.5rem] p-5 md:p-6 flex flex-col justify-between border border-black/10 min-h-[360px] md:h-[400px] shadow-2xl transition-all duration-300 cursor-pointer block hover:scale-[1.01] hover:border-violet-500/30"
            >
              <div className="w-full h-[180px] rounded-xl overflow-hidden border border-black/10 bg-white">
                <img src={pythonDsCertImg} className="w-full h-full object-contain bg-white" alt="Python for Data Science Certification" />
              </div>
              <div className="mt-4 flex-grow">
                <h3 className="text-lg font-black tracking-tight leading-tight mb-2 uppercase">Python for Data Science – Cognitive Class</h3>
                <div className="flex flex-wrap gap-2">
                  {["#Python", "#DataScience", "#CognitiveClass", "#IBM"].map((tag) => (
                    <span key={tag} className="text-[9px] font-bold text-violet-700 bg-violet-700/5 px-2 py-0.5 rounded-full">{tag}</span>
                  ))}
                </div>
              </div>
              <span className="text-xs font-black text-violet-700 hover:text-violet-900 transition-colors uppercase tracking-wider mt-4 block">
                Verify Certificate →
              </span>
            </motion.a>

            {/* Oracle Cloud Infrastructure */}
            <motion.a 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              href="https://catalog-education.oracle.com/ords/certview/sharebadge?id=97EAAF86588703C016AD49C5D2D1227FFF0125CB02B79F2FA21515C6C5EFF3F0"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#fcfbfa] text-[#050505] rounded-tr-[2.5rem] rounded-bl-[2.5rem] p-5 md:p-6 flex flex-col justify-between border border-black/10 min-h-[360px] md:h-[400px] shadow-2xl transition-all duration-300 cursor-pointer block hover:scale-[1.01] hover:border-violet-500/30"
            >
              <div className="w-full h-[180px] rounded-xl overflow-hidden border border-black/10 bg-white">
                <img src={ociCertImg} className="w-full h-full object-contain bg-white" alt="Oracle Cloud Infrastructure Certification" />
              </div>
              <div className="mt-4 flex-grow">
                <h3 className="text-lg font-black tracking-tight leading-tight mb-2 uppercase">Oracle Cloud Infrastructure – Oracle</h3>
                <div className="flex flex-wrap gap-2">
                  {["#OCI", "#CloudComputing", "#Infrastructure", "#Oracle"].map((tag) => (
                    <span key={tag} className="text-[9px] font-bold text-violet-700 bg-violet-700/5 px-2 py-0.5 rounded-full">{tag}</span>
                  ))}
                </div>
              </div>
              <span className="text-xs font-black text-violet-700 hover:text-violet-900 transition-colors uppercase tracking-wider mt-4 block">
                Verify Certificate →
              </span>
            </motion.a>
          </motion.div>

          {/* Bottom Back to Home Button */}
          <div className="max-w-7xl mx-auto px-6 md:px-20 py-10 flex justify-center relative z-20 w-full">
            <Magnetic strength={0.3}>
              <button 
                onClick={() => navigateTo('home')} 
                className="px-10 py-5 bg-white text-black font-black text-sm rounded-full hover:scale-105 transition-transform duration-300 flex items-center gap-4 cursor-pointer"
              >
                BACK TO HOME <ArrowRight size={18} className="rotate-180" />
              </button>
            </Magnetic>
          </div>

            <Footer onSayHiClick={() => setIsContactOpen(true)} />
          </motion.main>
        ) : (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <Hero id="hero" onSayHiClick={() => setIsContactOpen(true)} />
          
          <main className="relative z-10">
            <section id="about">
              <PinnedSection 
                title="About Me"
                description="I am Venmugil Rajan, a Computer Science student and a detail-oriented aspiring Software / Full-Stack Developer. I focus on combining programming, web development, UI/UX design, and machine learning to craft high-quality, visually immersive digital solutions."
                image={profileImg}
              />
            </section>

            <section id="skills" className="py-20 md:py-40 px-6 md:px-20">
              <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl sm:text-5xl md:text-8xl font-black mb-10 md:mb-20 tracking-tighter">TECHNICAL ARSENAL</h2>
                
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

              <ParallaxSection 
                number="04"
                title="Student Reward Site"
                subtitle="A comprehensive platform designed for tracking and managing student rewards and achievements."
                image={rewardImg}
                speed={-0.05}
                link="https://venmugilrajan-student-reward-points.hf.space/"
                buttonLabel="VIEW WEBSITE"
                reverse
              />

              <ParallaxSection 
                number="05"
                title="Placement Predictor ML"
                subtitle="A machine learning based placement predictor that evaluates CGPA, aptitude score, and projects to determine placement likelihood."
                image={placementPredictionImg}
                speed={0.1}
                link="https://github.com/venmugilrajan/Placement_prediction"
              />

              <div className="flex justify-center py-20 relative z-20">
                <Magnetic strength={0.3}>
                  <button 
                    onClick={() => navigateTo('projects')}
                    className="px-10 py-5 bg-white text-black font-black text-sm rounded-full hover:scale-105 transition-transform duration-300 flex items-center gap-4 cursor-pointer"
                  >
                    VIEW MORE PROJECTS <ArrowRight size={20} />
                  </button>
                </Magnetic>
              </div>
            </section>

            <section id="expertise" className="py-20 md:py-40 px-6 md:px-20 border-y border-white/10">
              <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl sm:text-4xl md:text-6xl font-black mb-10 md:mb-16 tracking-tighter uppercase italic">Certifications</h2>
                <div className="space-y-6">
                  {[
                    { name: 'JAVA SE 17 DEVELOPER – Oracle', link: 'https://catalog-education.oracle.com/pls/certview/sharebadge?id=1D3EA450257E886F877C6A8BB1ACD3C44B36D0AA8695B836071B56AC09982A84' },
                    { name: 'Python for Data Science – Cognitive Class', link: 'https://courses.cognitiveclass.ai/certificates/27e9670f63de45c7a1d677dea3155c8d' }
                  ].map((cert, i) => (
                    <Magnetic key={i} strength={0.1}>
                      <a href={cert.link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between group py-6 border-b border-white/10 w-full hover:px-4 transition-all duration-500">
                        <span className="text-lg sm:text-xl md:text-3xl font-bold text-white/70 group-hover:text-white transition-colors pr-4">{cert.name}</span>
                        <ExternalLink className="opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all flex-shrink-0" />
                      </a>
                    </Magnetic>
                  ))}
                </div>
              </div>
            </section>

            <Footer onSayHiClick={() => setIsContactOpen(true)} />
          </main>
        </motion.div>
      )}
    </AnimatePresence>
      <ContactForm isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </div>
  );
};

const ProjectCard = ({ proj, idx }) => {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      className="flip-card snap-center"
      onTouchEnd={(e) => { e.stopPropagation(); setFlipped(f => !f); }}
      style={{ transform: 'translateZ(0)' }}
    >
      <div className={`flip-card-inner${flipped ? ' flipped' : ''}`}>
        {/* Front Side */}
        <div className="flip-card-front">
          <h3 className="text-xl font-bold tracking-tight text-center mt-4 uppercase">{proj.title}</h3>
          <p className="text-xs text-black/75 leading-relaxed font-semibold px-2 py-4 mt-4 text-center">
            {proj.description}
          </p>
          <div className="text-[10px] tracking-[0.2em] font-black text-black/30 mt-auto uppercase">
            PROJECT 0{idx + 1}
          </div>
        </div>

        {/* Back Side */}
        <div className="flip-card-back">
          <div className="w-full aspect-[16/10] rounded-xl overflow-hidden bg-white/[0.03] border border-white/10 mb-4">
            <img src={proj.image} className="w-full h-full object-cover" alt={proj.title} />
          </div>
          <div className="h-px bg-white/20 w-full mb-4" />
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 justify-start mb-6">
            {proj.tags.map((tag, tIdx) => (
              <span key={tIdx} className="text-[9px] font-mono font-bold tracking-wider text-violet-300">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between mt-auto">
            <a
              href={proj.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="px-6 py-2.5 bg-white text-black font-black text-xs rounded-full hover:scale-105 transition-transform cursor-pointer"
            >
              Visit
            </a>
            <a
              href={proj.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              <Github size={20} />
            </a>
          </div>
        </div>
      </div>
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
        <li key={i} className="flex items-center gap-3 text-white/80 group-hover:text-white transition-colors">
          <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
          {skill}
        </li>
      ))}
    </ul>
  </div>
);

const Hero = ({ id, onSayHiClick }) => {
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
      <div className="z-10 text-center uppercase tracking-tighter px-4">
        <div className="hero-sub text-xs md:text-sm font-bold tracking-[0.8em] text-violet-300 mb-6 font-mono select-none">
          [ INITIALIZING CORE ]
        </div>
        <h1 className="text-5xl sm:text-7xl md:text-[13vw] font-black leading-[0.9] md:leading-[0.8] mb-8 relative flex flex-col items-center">
          <SplitText className="block mb-2">VENMUGIL</SplitText>
          <SplitText className="block text-gradient">RAJAN</SplitText>
        </h1>
        <p className="hero-sub text-sm flex flex-col md:flex-row gap-4 items-center justify-center font-bold tracking-[0.4em] text-white/85 mb-12">
          <span>SOFTWARE DEVELOPER</span>
          <span className="hidden md:inline">•</span>
          <span>FULL-STACK ARCHITECT</span>
        </p>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
        <ScrollArrow targetId="about" />
      </div>

      <div className="absolute bottom-28 md:bottom-10 left-1/2 md:left-20 -translate-x-1/2 md:translate-x-0 flex gap-6 text-white/80 z-20">
          <Magnetic><a href="https://github.com/venmugilrajan" target="_blank" rel="noopener noreferrer"><Github size={18} className="cursor-pointer hover:text-white" /></a></Magnetic>
          <Magnetic><a href="https://www.linkedin.com/in/venmugil-rajan-s-1362b3354/" target="_blank" rel="noopener noreferrer"><Linkedin size={18} className="cursor-pointer hover:text-white" /></a></Magnetic>
          <Magnetic><a href="https://leetcode.com/u/Venmugilrajans/" target="_blank" rel="noopener noreferrer"><Code2 size={18} className="cursor-pointer hover:text-white" /></a></Magnetic>
          <Magnetic>
            <button 
              onClick={(e) => {
                e.preventDefault();
                if (onSayHiClick) onSayHiClick();
              }}
              className="cursor-pointer hover:text-white bg-transparent border-none p-0 flex items-center justify-center focus:outline-none"
            >
              <Mail size={18} />
            </button>
          </Magnetic>
      </div>
    </section>
  );
};

const PinnedSection = ({ title, description, image, reverse = false }) => {
  const containerRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(imgRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.5
        },
        scale: 1.1,
        rotate: reverse ? -1 : 1,
        force3D: true
      });
    }, containerRef);

    return () => ctx.revert();
  }, [reverse]);

  return (
    <section ref={containerRef} className="min-h-screen flex items-center justify-center relative overflow-hidden py-20 px-6 md:px-10">
      <div className={`w-full max-w-7xl flex flex-col md:flex-row items-center gap-12 md:gap-20 ${reverse ? 'md:flex-row-reverse' : ''}`}>
        <div className="w-full md:w-1/2">
          <h2 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] md:leading-[0.8]">{title}</h2>
          <p className="text-lg sm:text-xl md:text-2xl text-white/85 max-w-md leading-relaxed font-light">{description}</p>
        </div>
        <div className="w-full md:w-1/2 aspect-square relative overflow-hidden rounded-[2rem] bg-white/[0.03] border border-white/10 p-4 max-w-md md:max-w-none">
          <img 
            ref={imgRef}
            src={image} 
            className="w-full h-full object-cover rounded-2xl transition-all duration-700 [will-change:transform]"
            alt={title}
          />
        </div>
      </div>
    </section>
  );
};

const ParallaxSection = ({ id, number, title, subtitle, image, speed, link = "#", reverse = false, objectPosition = "center", buttonLabel = "VIEW REPO" }) => {
  const sectionRef = useRef(null);

  return (
    <section id={id} ref={sectionRef} className={`relative min-h-[80vh] py-16 px-6 md:py-32 md:px-20 flex flex-col md:flex-row items-center gap-12 md:gap-16 ${reverse ? 'md:flex-row-reverse' : ''}`}>
      <div className="w-full md:w-5/12">
        <span className="text-6xl md:text-8xl font-black opacity-10 leading-none block mb-6 font-mono">{number}</span>
        <h2 className="text-4xl sm:text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-none">{title}</h2>
        <p className="text-base sm:text-lg md:text-2xl text-white/80 mb-12 max-w-md font-light leading-relaxed">{subtitle}</p>
        <Magnetic>
          <a 
            href={link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-6 group cursor-pointer border border-white/20 px-8 py-4 rounded-full hover:bg-white hover:text-black transition-all duration-500"
          >
            <span className="text-sm font-black tracking-[0.2em] uppercase">{buttonLabel}</span>
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

const Footer = ({ onSayHiClick }) => {
    return (
        <footer id="contact" className="relative min-h-screen md:h-screen flex flex-col justify-between items-center py-16 md:py-20 px-6 md:px-10 overflow-hidden">

            <div className="absolute inset-0 z-[-1] overflow-hidden">
                <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-violet-900/10 blur-[150px] rounded-full" />
                <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-900/10 blur-[150px] rounded-full" />
            </div>

            {/* Top spacer for layout balance on desktop */}
            <div className="hidden md:block h-10" />

            <div className="text-center relative z-20 my-auto">
                <div className="text-xs font-bold tracking-[1em] text-violet-400 mb-8 md:mb-12 uppercase">[ Available for work ]</div>
                <h2 className="text-5xl sm:text-6xl md:text-[9vw] font-black tracking-tighter mb-10 md:mb-16 leading-none uppercase">
                    Connect <br /> <span className="text-gradient">Globally.</span>
                </h2>
                <div className="flex flex-col sm:flex-row gap-6 items-center justify-center">
                    <Magnetic strength={0.3}>
                        <button 
                            onClick={(e) => {
                                e.preventDefault();
                                if (onSayHiClick) onSayHiClick();
                            }}
                            className="px-10 py-5 md:px-16 md:py-6 bg-white text-black font-black text-lg md:text-xl rounded-full hover:scale-105 transition-transform flex items-center gap-4 cursor-pointer"
                        >
                            SAY HI <Mail size={20} strokeWidth={3} />
                        </button>
                    </Magnetic>
                    <Magnetic strength={0.2}>
                       <a href="https://drive.google.com/file/d/1znc57ohETOuLlvZAoe8idFF_pqjy2oqq/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="px-8 py-5 md:px-12 md:py-6 border border-white/20 text-white font-bold text-base md:text-lg rounded-full hover:bg-white/5 transition-colors">
                            DOWNLOAD RESUME
                        </a>
                    </Magnetic>
                </div>
            </div>

            <div className="w-full max-w-7xl mt-16 md:mt-0 flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] font-bold tracking-[0.4em] uppercase text-white/80 z-20">
                <div className="text-center md:text-left">© 2026 VENMUGIL RAJAN • CRAFTED WITH REACT & GSAP</div>
                <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-white/85">
                    <a href="https://github.com/venmugilrajan" target="_blank" className="hover:text-white transition-colors">GITHUB</a>
                    <a href="https://www.linkedin.com/in/venmugil-rajan-s-1362b3354/" target="_blank" className="hover:text-white transition-colors">LINKEDIN</a>
                    <a href="https://leetcode.com/u/Venmugilrajans/" target="_blank" className="hover:text-white transition-colors">LEETCODE</a>
                    <button 
                        onClick={(e) => {
                            e.preventDefault();
                            if (onSayHiClick) onSayHiClick();
                        }}
                        className="hover:text-white transition-colors cursor-pointer bg-transparent border-none p-0 focus:outline-none"
                    >
                        EMAIL
                    </button>
                </div>
            </div>
        </footer>
    );
};

const ContactForm = ({ isOpen, onClose }) => {
  const [senderName, setSenderName] = useState('');
  const [fromEmail, setFromEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');

  // IMPORTANT: The user needs to paste their Web3Forms key here to receive emails.
  const WEB3FORMS_ACCESS_KEY = "17038924-8555-4d86-867c-cbbe46c6efe3"; 

  const handleVerify = (e) => {
    e.preventDefault();
    if (!fromEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fromEmail)) {
      setError('Please enter a valid email address');
      return;
    }
    setError('');
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
    }, 1500);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!isVerified) {
      setError('Please verify your email address first');
      return;
    }
    if (!subject.trim() || !message.trim()) {
      setError('Subject and message body are required');
      return;
    }
    if (WEB3FORMS_ACCESS_KEY === "YOUR_ACCESS_KEY_HERE" || !WEB3FORMS_ACCESS_KEY) {
      setError('Please enter your Web3Forms access key in App.jsx (line 1032) to receive emails.');
      return;
    }

    setIsSending(true);
    setError('');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          name: senderName,
          from_name: senderName,
          email: fromEmail,
          subject: `[PORTFOLIO DISPATCH] ${subject}`,
          message: message,
          theme: "dark"
        })
      });

      const result = await response.json();
      if (result.success) {
        setIsSent(true);
        setSenderName('');
        setFromEmail('');
        setSubject('');
        setMessage('');
        setIsVerified(false);
      } else {
        setError(result.message || 'Failed to transmit dispatch.');
      }
    } catch (err) {
      setError('A connection transmission error occurred.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-end md:items-center justify-center bg-black/75 backdrop-blur-sm px-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ y: '100%', opacity: 0.8 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0.8 }}
              transition={{ type: 'spring', damping: 25, stiffness: 180 }}
              className="w-full max-w-lg burnt-paper rounded-t-[2.5rem] md:rounded-[2.5rem] p-10 md:p-12 flex flex-col gap-6 relative select-text"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 w-10 h-10 rounded-full border border-[#705328]/40 flex items-center justify-center text-[#2b1805] hover:bg-[#2b1805]/10 transition-colors focus:outline-none"
                aria-label="Close"
              >
                <X size={20} />
              </button>

              {isSent ? (
                /* Success State */
                <div className="flex flex-col items-center justify-center py-10 text-center gap-6">
                  <span className="text-5xl animate-bounce">✉</span>
                  <h3 className="text-2xl font-black tracking-widest text-[#2b1805] uppercase">
                    DISPATCH TRANSFERRED
                  </h3>
                  <p className="text-xs text-[#5c452b] uppercase font-bold max-w-xs leading-relaxed">
                    Your direct correspondence has been successfully transmitted directly to mailtovenmugilrajan@gmail.com
                  </p>
                  <button
                    onClick={() => {
                      setIsSent(false);
                      onClose();
                    }}
                    className="mt-6 px-8 py-3 bg-[#2b1805] text-[#fdfbf7] font-bold rounded-lg uppercase tracking-wider text-xs hover:scale-105 transition-transform"
                  >
                    Close Receipt
                  </button>
                </div>
              ) : (
                /* Input Form State */
                <>
                  <div className="border-b border-[#705328]/30 pb-4">
                    <h3 className="text-2xl font-black tracking-widest text-[#2b1805] uppercase">
                      DISPATCH WIRE
                    </h3>
                    <p className="text-[10px] tracking-wider text-[#5c452b] uppercase font-bold mt-1">
                      Post direct correspondence to venmugilrajan.dev
                    </p>
                  </div>

                  <form onSubmit={handleSend} className="flex flex-col gap-5">
                    {/* To field */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="to-field" className="burnt-label">To:</label>
                      <div className="relative">
                        <input
                          id="to-field"
                          type="text"
                          value="mailtovenmugilrajan@gmail.com"
                          readOnly
                          className="burnt-input opacity-75 font-mono select-none"
                          style={{ cursor: 'not-allowed' }}
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#5c452b] uppercase tracking-wider bg-[#dbbe89]/40 px-2 py-0.5 rounded">
                          LOCKED
                        </span>
                      </div>
                    </div>

                    {/* Name field */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="name-field" className="burnt-label">Name (Your Name):</label>
                      <input
                        id="name-field"
                        type="text"
                        placeholder="e.g. John Doe"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        required
                        disabled={isSending}
                        className="burnt-input font-mono"
                      />
                    </div>

                    {/* From field with verify */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="from-field" className="burnt-label">From (Your Email):</label>
                      <div className="flex gap-3 items-end">
                        <div className="relative flex-grow">
                          <input
                            id="from-field"
                            type="email"
                            placeholder="e.g. sender@gmail.com"
                            value={fromEmail}
                            onChange={(e) => {
                              setFromEmail(e.target.value);
                              if (isVerified) setIsVerified(false);
                            }}
                            required
                            disabled={isVerified || isSending}
                            className="burnt-input font-mono"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleVerify}
                          disabled={isVerifying || isVerified || !fromEmail || isSending}
                          className={`px-4 py-2 border rounded font-mono text-xs tracking-wider uppercase transition-all flex-shrink-0 ${
                            isVerified
                              ? 'border-green-800 text-green-800 bg-green-100/30'
                              : isVerifying
                              ? 'border-orange-800 text-orange-800 animate-pulse'
                              : 'border-[#5c452b] text-[#2b1805] hover:bg-[#2b1805]/10'
                          }`}
                        >
                          {isVerified ? '✓ Verified' : isVerifying ? 'Verifying...' : 'Verify'}
                        </button>
                      </div>
                    </div>

                    {/* Subject */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="subject-field" className="burnt-label">Subject:</label>
                      <input
                        id="subject-field"
                        type="text"
                        placeholder="Enter message subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                        disabled={isSending}
                        className="burnt-input font-mono"
                      />
                    </div>

                    {/* Body */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="message-field" className="burnt-label">Message:</label>
                      <textarea
                        id="message-field"
                        placeholder="Type message contents..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        rows={4}
                        disabled={isSending}
                        className="burnt-input font-mono resize-none"
                      />
                    </div>

                    {error && (
                      <div className="text-red-800 text-xs font-bold font-mono tracking-wide">
                        * {error}
                      </div>
                    )}

                    {/* Action Button */}
                    <button
                      type="submit"
                      disabled={!isVerified || isSending}
                      className={`w-full py-4 mt-2 rounded-xl font-bold tracking-widest uppercase transition-all duration-300 ${
                        isVerified && !isSending
                          ? 'bg-[#2b1805] text-[#fdfbf7] hover:scale-[1.02] shadow-lg'
                          : 'bg-[#5c452b]/20 text-[#5c452b]/50 cursor-not-allowed border border-[#705328]/20'
                      }`}
                    >
                      {isSending ? 'Transmitting Wire...' : 'Transmit Dispatch'}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
  );
};

export default App;
