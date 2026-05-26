import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Github, Linkedin, Mail, Code2, ExternalLink, Award, Sparkles, BookOpen } from 'lucide-react';
import profileImg from './Gemini_Generated_Image_xuuob3xuuob3xuuo.png';
import faceImg from './face.png';
import digitImg from './digit.png';
import rewardImg from './reward.jpg';

// --- Particle Background for Skills Section ---
const ParticleCanvas = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let particles = [];
    let mouse = { x: null, y: null };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 1.2;
        this.vy = (Math.random() - 0.5) * 1.2;
        this.radius = Math.random() * 3 + 1;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
      draw() {
        ctx.fillStyle = 'rgba(59, 130, 246, 0.4)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < 50; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      // Draw lines between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.12 * (1 - dist / 110)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw lines to mouse
      if (mouse.x !== null) {
        particles.forEach((p) => {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160) {
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.25 * (1 - dist / 160)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        });
      }

      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />;
};

// --- Custom Drag-to-Scroll Container ---
const HorizontalScroll = ({ children }) => {
  const containerRef = useRef(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown = (e) => {
    isDown.current = true;
    startX.current = e.pageX - containerRef.current.offsetLeft;
    scrollLeft.current = containerRef.current.scrollLeft;
  };

  const onMouseLeave = () => {
    isDown.current = false;
  };

  const onMouseUp = () => {
    isDown.current = false;
  };

  const onMouseMove = (e) => {
    if (!isDown.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    containerRef.current.scrollLeft = scrollLeft.current - walk;
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={onMouseDown}
      onMouseLeave={onMouseLeave}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      className="flex gap-10 overflow-x-auto no-scrollbar py-8 px-10 cursor-grab active:cursor-grabbing select-none w-full max-w-7xl mx-auto scroll-smooth"
    >
      {children}
    </div>
  );
};

// --- Custom Mouse Cursor Follower ---
const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [followerPos, setFollowerPos] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const onMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleHover = (e) => {
      const target = e.target;
      const isInteractive = target.closest('a, button, .cursor-pointer');
      setHovered(!!isInteractive);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', handleHover);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', handleHover);
    };
  }, []);

  // Smooth follower animation
  useEffect(() => {
    let animationId;
    const updateFollower = () => {
      setFollowerPos((prev) => {
        const dx = position.x - prev.x;
        const dy = position.y - prev.y;
        return {
          x: prev.x + dx * 0.15,
          y: prev.y + dy * 0.15,
        };
      });
      animationId = requestAnimationFrame(updateFollower);
    };
    updateFollower();
    return () => cancelAnimationFrame(animationId);
  }, [position]);

  return (
    <>
      <div
        className="custom-cursor hidden md:block"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          opacity: hovered ? 0 : 1,
        }}
      />
      <div
        className="custom-cursor-follower hidden md:block"
        style={{
          left: `${followerPos.x}px`,
          top: `${followerPos.y}px`,
          transform: `translate(-50%, -50%) scale(${hovered ? 1.5 : 1})`,
          backgroundColor: hovered ? 'rgba(59, 130, 246, 0.05)' : 'transparent',
        }}
      />
    </>
  );
};

// --- Main App Component ---
export default function App() {
  const [page, setPage] = useState('home'); // 'home', 'skills', 'work', 'experience', 'feats'
  const [isOpened, setIsOpened] = useState(false);

  // Auto-reset state when returning to home page
  const navigateTo = (nextPage) => {
    setPage(nextPage);
  };

  const isDark = page === 'work' || page === 'experience';

  return (
    <div className={`min-h-screen relative font-karla transition-colors duration-700 ${isDark ? 'theme-dark' : 'bg-background text-darkBackground'}`}>
      <CustomCursor />
      
      {/* Outer Layout Frame */}
      <div className="border-frame" />

      {/* Shared Navigations */}
      <header className="fixed top-8 left-8 right-8 flex justify-between items-center z-50 pointer-events-none">
        <div 
          onClick={() => {
            setIsOpened(false);
            navigateTo('home');
          }}
          className="text-2xl font-pacifico font-bold tracking-tight cursor-pointer pointer-events-auto hover:opacity-75 transition-opacity"
        >
          VR
        </div>

        {/* Back Navigation Arrow */}
        <AnimatePresence>
          {page !== 'home' && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={() => navigateTo('home')}
              className={`p-3 rounded-full border border-current pointer-events-auto hover:bg-current hover:text-white transition-all flex items-center justify-center`}
              aria-label="Back to home"
            >
              <ArrowLeft size={18} />
            </motion.button>
          )}
        </AnimatePresence>

        <a 
          href="mailto:venmugilrajans@gmail.com" 
          className="text-xs font-bold uppercase tracking-[0.2em] pointer-events-auto hover:opacity-50 transition-opacity"
        >
          Say hi..
        </a>
      </header>

      {/* Social Sidebar */}
      <div className="fixed bottom-8 left-8 hidden md:flex flex-col gap-6 z-50 items-center">
        <div className="w-[1px] h-20 bg-current opacity-30" />
        <a href="https://github.com/venmugilrajan" target="_blank" rel="noopener noreferrer" className="hover:opacity-60 transition-opacity"><Github size={16} /></a>
        <a href="https://www.linkedin.com/in/venmugil-rajan-s-1362b3354/" target="_blank" rel="noopener noreferrer" className="hover:opacity-60 transition-opacity"><Linkedin size={16} /></a>
        <a href="mailto:venmugilrajans@gmail.com" className="hover:opacity-60 transition-opacity"><Mail size={16} /></a>
        <a href="https://leetcode.com/u/Venmugilrajans/" target="_blank" rel="noopener noreferrer" className="hover:opacity-60 transition-opacity"><Code2 size={16} /></a>
      </div>

      {/* Main Content Router */}
      <main className="min-h-screen w-full flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          {page === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="relative w-full h-screen flex items-center justify-center"
            >
              {/* Splitting Background Animation */}
              <div className="absolute inset-0 flex h-full w-full overflow-hidden">
                <motion.div 
                  initial={{ width: '50%' }}
                  animate={{ width: isOpened ? '50%' : '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 120 }}
                  className="h-full bg-background relative"
                >
                  {/* Left part splits black when open */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isOpened ? 1 : 0 }}
                    className="absolute inset-0 bg-darkBackground"
                  />
                </motion.div>
                <div className="h-full w-[1px] bg-black/10 relative z-10" />
                <motion.div 
                  initial={{ width: '50%' }}
                  animate={{ width: isOpened ? '50%' : '0%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 120 }}
                  className="h-full bg-background"
                />
              </div>

              {/* Close split-screen center arrow */}
              {isOpened && (
                <motion.button
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => setIsOpened(false)}
                  className="absolute top-24 left-1/2 -translate-x-1/2 p-3 rounded-full border border-black dark:border-white z-50 text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                >
                  <ArrowLeft size={18} />
                </motion.button>
              )}

              {/* Centered click target (Yin-Yang) */}
              {!isOpened && (
                <div className="flex flex-col items-center gap-4 z-20">
                  <button 
                    onClick={() => setIsOpened(true)}
                    className="w-40 h-40 rounded-full flex items-center justify-center cursor-pointer overflow-hidden relative group transition-transform duration-500 hover:scale-105 active:scale-95"
                    aria-label="Enter site"
                  >
                    <svg viewBox="0 0 100 100" className="w-full h-full yin-yang-spin">
                      <path d="M 50,0 A 50,50 0 0,0 50,100 A 25,25 0 0,0 50,50 A 25,25 0 0,1 50,0 Z" fill="#020202" />
                      <path d="M 50,0 A 50,50 0 0,1 50,100 A 25,25 0 0,0 50,50 A 25,25 0 0,1 50,0 Z" fill="#FCFBF7" />
                      <circle cx="50" cy="25" r="8" fill="#020202" />
                      <circle cx="50" cy="75" r="8" fill="#FCFBF7" />
                    </svg>
                  </button>
                  <span className="text-xs uppercase tracking-[0.4em] font-mono opacity-50 animate-pulse">click here</span>
                </div>
              )}

              {/* Split Screen Profile Contents */}
              {isOpened && (
                <div className="relative z-20 flex flex-col items-center justify-center px-6 w-full max-w-5xl h-full">
                  {/* Split Frame Text Box */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="w-full md:w-11/12 border border-white/20 md:border-transparent flex flex-col md:flex-row items-center relative py-12 md:py-0"
                  >
                    {/* Left text - aligns over black side */}
                    <div className="w-full md:w-1/2 text-white pr-0 md:pr-10 text-center md:text-left z-20">
                      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-4 leading-none font-sans">
                        Hi,<br />I'm Venmugil Rajan
                      </h1>
                      <p className="text-sm md:text-base text-white/60 font-light leading-relaxed mb-6 font-mono max-w-sm mx-auto md:mx-0">
                        A software/full-stack developer passionate about building clean algorithms and immersive experiences.
                      </p>
                    </div>

                    {/* Right text - aligns over white side */}
                    <div className="w-full md:w-1/2 text-darkBackground pl-0 md:pl-10 text-center md:text-left z-20 mt-6 md:mt-0">
                      <p className="text-sm md:text-lg text-black/70 font-light leading-relaxed max-w-md">
                        I specialize in programming, web architecture, and machine learning models. I enjoy building visually rich interfaces, optimizing scroll animations, and implementing creative frontends.
                      </p>
                    </div>

                    {/* Central Border Overlay Card wrapper */}
                    <div className="absolute inset-0 border border-black/10 dark:border-white/10 rounded-2xl pointer-events-none hidden md:block" />

                    {/* Center Floating Profile Photo */}
                    <motion.div 
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, type: 'spring' }}
                      className="absolute left-1/2 -translate-x-1/2 w-48 h-48 md:w-64 md:h-64 rounded-full border border-black/15 bg-background overflow-hidden p-3 z-30 hidden md:block"
                    >
                      <img 
                        src={profileImg} 
                        alt="Venmugil Rajan Profile" 
                        className="w-full h-full object-cover rounded-full select-none"
                      />
                    </motion.div>
                  </motion.div>

                  {/* Marginalized Nav Anchors inside Open Split */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="absolute inset-x-8 bottom-8 flex justify-between text-[10px] font-bold uppercase tracking-[0.3em] font-mono z-30 pointer-events-auto"
                  >
                    <div className="flex gap-8">
                      <button onClick={() => navigateTo('experience')} className="hover:opacity-40 transition-opacity">Experience</button>
                      <button onClick={() => navigateTo('work')} className="hover:opacity-40 transition-opacity">Projects</button>
                    </div>
                    <div className="flex gap-8">
                      <button onClick={() => navigateTo('skills')} className="hover:opacity-40 transition-opacity">My Skills</button>
                      <button onClick={() => navigateTo('feats')} className="hover:opacity-40 transition-opacity">Feats</button>
                    </div>
                  </motion.div>
                </div>
              )}
            </motion.div>
          )}

          {/* --- Skills View --- */}
          {page === 'skills' && (
            <motion.div
              key="skills"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="relative w-full min-h-screen flex flex-col justify-center items-center neon-glow-border py-24 px-6 z-10"
            >
              <ParticleCanvas />
              <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none opacity-[0.03] z-0">
                <span className="text-[20vw] font-black tracking-tighter">SKILLS</span>
              </div>

              <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 z-10">
                {/* Left Card: Web Architecture */}
                <motion.div 
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white/40 backdrop-blur-md border border-black/5 p-10 rounded-3xl"
                >
                  <h3 className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-blue-500 mb-6 flex items-center gap-3">
                    <Sparkles size={16} /> Web Architecture
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {['HTML5', 'CSS3', 'JavaScript', 'React.js', 'PHP', 'MySQL', 'TailwindCSS', 'Git'].map((skill, idx) => (
                      <div key={idx} className="flex items-center gap-3 py-2 border-b border-black/5">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <span className="text-sm font-medium text-black/80">{skill}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Right Card: Programming & Machine Learning */}
                <motion.div 
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white/40 backdrop-blur-md border border-black/5 p-10 rounded-3xl"
                >
                  <h3 className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-blue-500 mb-6 flex items-center gap-3">
                    <Code2 size={16} /> Technical Arsenal
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {['C', 'C++', 'Java', 'Python', 'Machine Learning', 'TensorFlow', 'Jupyter', 'Unity'].map((skill, idx) => (
                      <div key={idx} className="flex items-center gap-3 py-2 border-b border-black/5">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <span className="text-sm font-medium text-black/80">{skill}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Bottom Spinning Decorative Yin-Yang */}
              <div className="absolute bottom-8 right-8">
                <svg viewBox="0 0 100 100" className="w-10 h-10 yin-yang-spin opacity-45">
                  <path d="M 50,0 A 50,50 0 0,0 50,100 A 25,25 0 0,0 50,50 A 25,25 0 0,1 50,0 Z" fill="#020202" />
                  <path d="M 50,0 A 50,50 0 0,1 50,100 A 25,25 0 0,0 50,50 A 25,25 0 0,1 50,0 Z" fill="#FCFBF7" />
                  <circle cx="50" cy="25" r="8" fill="#020202" />
                  <circle cx="50" cy="75" r="8" fill="#FCFBF7" />
                </svg>
              </div>
            </motion.div>
          )}

          {/* --- Work/Projects View --- */}
          {page === 'work' && (
            <motion.div
              key="work"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="relative w-full min-h-screen flex flex-col justify-center items-center py-24 px-6 z-10"
            >
              {/* Background Watermark */}
              <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none opacity-[0.03] z-0">
                <span className="text-[22vw] font-black tracking-tighter text-white">WORK</span>
              </div>

              {/* Leaf Cards grab-scroll container */}
              <HorizontalScroll>
                {[
                  {
                    num: '01',
                    title: 'Online Leave Portal',
                    desc: 'Full-stack portal for student-teacher leave management with PHP/MySQL backend and automated email notifications.',
                    tech: 'PHP, MySQL, PHPMailer, HTML/CSS',
                    link: 'https://github.com/venmugilrajan/online_leave_portal',
                  },
                  {
                    num: '02',
                    title: 'Face Recognition CNN',
                    desc: 'Deep learning application using Convolutional Neural Networks and OpenCV for real-time face identification.',
                    tech: 'Python, OpenCV, TensorFlow, CNN',
                    link: 'https://github.com/venmugilrajan/face_recognition_cnn',
                  },
                  {
                    num: '03',
                    title: 'Digit Recognizer',
                    desc: 'Machine learning drawing interface powered by CNN to accurately identify handwritten numbers.',
                    tech: 'Python, TensorFlow, Gradio, CNN',
                    link: 'https://github.com/venmugilrajan/DIGIT_RECOGNIZER_CNN',
                  },
                  {
                    num: '04',
                    title: 'Student Reward Site',
                    desc: 'A gamified platform designed for tracking and managing student rewards and classroom achievements.',
                    tech: 'React, Tailwind CSS, Lucide Icons',
                    link: 'https://venmugilrajan-student-reward-points.hf.space/',
                  }
                ].map((proj, idx) => (
                  <div 
                    key={idx}
                    className="leaf-card w-[320px] md:w-[380px] h-[450px] bg-background text-darkBackground flex-shrink-0 flex flex-col justify-between p-8 relative overflow-hidden"
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-4xl font-black font-mono opacity-25">{proj.num}</span>
                      <a href={proj.link} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-black/5 hover:bg-black hover:text-white transition-colors">
                        <ExternalLink size={16} />
                      </a>
                    </div>

                    <div className="my-auto">
                      <h3 className="text-xl md:text-2xl font-black tracking-tight mb-4">{proj.title}</h3>
                      <p className="text-xs md:text-sm text-black/70 font-light leading-relaxed mb-4">
                        {proj.desc}
                      </p>
                    </div>

                    <div>
                      <span className="text-[9px] font-bold tracking-[0.2em] font-mono uppercase text-black/50 block">TECH STACK</span>
                      <span className="text-xs font-semibold text-black/80">{proj.tech}</span>
                    </div>
                  </div>
                ))}
              </HorizontalScroll>

              {/* Bottom Swipe cue */}
              <div className="absolute bottom-8 right-8 flex items-center gap-6">
                <span className="text-xs uppercase tracking-[0.4em] font-mono opacity-30 select-none">Swipe..</span>
                <svg viewBox="0 0 100 100" className="w-10 h-10 yin-yang-spin opacity-45">
                  <path d="M 50,0 A 50,50 0 0,0 50,100 A 25,25 0 0,0 50,50 A 25,25 0 0,1 50,0 Z" fill="#020202" />
                  <path d="M 50,0 A 50,50 0 0,1 50,100 A 25,25 0 0,0 50,50 A 25,25 0 0,1 50,0 Z" fill="#FCFBF7" />
                  <circle cx="50" cy="25" r="8" fill="#020202" />
                  <circle cx="50" cy="75" r="8" fill="#FCFBF7" />
                </svg>
              </div>
            </motion.div>
          )}

          {/* --- Experience/Timeline View --- */}
          {page === 'experience' && (
            <motion.div
              key="experience"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="relative w-full min-h-screen py-32 px-6 z-10 overflow-y-auto no-scrollbar"
            >
              <div className="max-w-4xl mx-auto relative">
                {/* Center timeline line */}
                <div className="timeline-line" />

                {/* Timeline Items */}
                <div className="space-y-16">
                  {[
                    {
                      role: 'Freelance Full-Stack Developer',
                      company: 'Self-Employed / Independent Work',
                      duration: '2024 - Present',
                      location: 'Remote',
                      desc: [
                        'Constructed fully custom web applications using PHP, React, and MySQL.',
                        'Optimized interactive frontends and GSAP timeline scrolling layouts.',
                        'Connected deep learning and machine learning script outputs to Streamlit and Gradio interfaces.'
                      ]
                    },
                    {
                      role: 'Machine Learning Training Engineer',
                      company: 'Academic Research & Projects',
                      duration: '2023 - 2024',
                      location: 'Coimbatore, India',
                      desc: [
                        'Implemented custom CNN layers for high-accuracy Handwritten Digit Recognition.',
                        'Built robust CNN facial recognition classification algorithms.',
                        'Explored TensorFlow/Keras datasets to construct skin disease classification systems.'
                      ]
                    },
                    {
                      role: 'Bachelor of Computer Science',
                      company: 'University Education',
                      duration: '2021 - 2024',
                      location: 'India',
                      desc: [
                        'Graduated with honors in Computer Science.',
                        'Relevant coursework: Data Structures, Algorithms, DBMS, Software Engineering, AI & Machine Learning.',
                        'Spearheaded development of departmental leave systems and administrative portals.'
                      ]
                    }
                  ].map((exp, idx) => (
                    <div key={idx} className="flex flex-col md:flex-row items-stretch relative">
                      {/* Timeline dot */}
                      <div className="absolute left-[20px] md:left-1/2 -translate-x-1/2 top-4 w-4 h-4 rounded-full bg-white border border-black z-20" />

                      {/* Left Metadata Card */}
                      <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="w-full md:w-[45%] pl-12 md:pl-0 md:text-right pr-0 md:pr-10 mb-4 md:mb-0 flex flex-col justify-center"
                      >
                        <h4 className="text-lg md:text-xl font-bold tracking-tight text-white">{exp.role}</h4>
                        <span className="text-xs font-mono text-white/50 block mt-1">{exp.company}</span>
                        <span className="text-xs font-bold text-blue-400 mt-2">{exp.duration} • {exp.location}</span>
                      </motion.div>

                      {/* Spacer for Timeline */}
                      <div className="w-[10%] hidden md:block" />

                      {/* Right Description Card */}
                      <motion.div 
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="w-full md:w-[45%] pl-12 md:pl-10 flex items-center"
                      >
                        <div className="bg-white/[0.03] border border-white/5 p-6 rounded-2xl w-full">
                          <ul className="space-y-3 text-xs md:text-sm text-white/70 font-light leading-relaxed">
                            {exp.desc.map((bullet, bidx) => (
                              <li key={bidx} className="flex gap-2">
                                <span className="text-blue-500 font-mono">•</span>
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* --- Achievements / Feats View --- */}
          {page === 'feats' && (
            <motion.div
              key="feats"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="relative w-full min-h-screen py-32 px-6 z-10 overflow-y-auto no-scrollbar"
            >
              {/* Overlay background textures */}
              <div className="absolute inset-0 bg-white/20 select-none pointer-events-none opacity-[0.02] z-0 flex items-center justify-center">
                <span className="text-[18vw] font-black tracking-tighter text-black">FEATS</span>
              </div>

              <div className="max-w-4xl mx-auto z-10 relative">
                <h2 className="text-xs font-mono font-bold uppercase tracking-[0.3em] text-blue-600 mb-10 text-center flex items-center justify-center gap-3">
                  <Award size={18} /> Verified Expertise & Credentials
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                    {
                      title: 'Java SE 17 Developer',
                      issuer: 'Oracle Certified Professional',
                      badge: 'https://catalog-education.oracle.com/pls/certview/sharebadge?id=1D3EA450257E886F877C6A8BB1ACD3C44B36D0AA8695B836071B56AC09982A84',
                      desc: 'Certified competence in building modular object-oriented applications, managing concurrency APIs, and implementing memory-safe constructs in Java SE 17.'
                    },
                    {
                      title: 'OCI Cloud Infrastructure',
                      issuer: 'Oracle Certified Associate',
                      badge: 'https://catalog-education.oracle.com/ords/certview/sharebadge?id=97EAAF86588703C016AD49C5D2D1227FFF0125CB02B79F2FA21515C6C5EFF3F0',
                      desc: 'Architecting containerized cloud pipelines, load balancers, database instances, and securing microservices on Oracle Cloud Infrastructure.'
                    },
                    {
                      title: 'AWS Cloud Fundamentals',
                      issuer: 'Amazon Essentials Training',
                      badge: 'https://venmugilrajan.github.io/portfolio/aws%20cloud%20practitioner%20essentials.pdf',
                      desc: 'Familiarity with cloud security models, serverless functions (Lambda), EC2 cluster management, and S3 asset buckets.'
                    },
                    {
                      title: 'Python for Data Science',
                      issuer: 'Cognitive Class Certificate',
                      badge: 'https://courses.cognitiveclass.ai/certificates/27e9670f63de45c7a1d677dea3155c8d',
                      desc: 'Expertise in data extraction, CSV processing, statistical calculations, and graphing using Pandas, NumPy, and Matplotlib.'
                    }
                  ].map((feat, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ y: 20, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white/50 backdrop-blur-md border border-black/5 p-8 rounded-3xl flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-bold tracking-tight text-black">{feat.title}</h3>
                            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider font-mono">{feat.issuer}</span>
                          </div>
                          <BookOpen className="text-blue-500" size={20} />
                        </div>
                        <p className="text-xs md:text-sm text-black/70 font-light leading-relaxed mb-6">
                          {feat.desc}
                        </p>
                      </div>

                      <a 
                        href={feat.badge} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-black hover:text-blue-600 transition-colors"
                      >
                        Verify Credential <ExternalLink size={12} />
                      </a>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
