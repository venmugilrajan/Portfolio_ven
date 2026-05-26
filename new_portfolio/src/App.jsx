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
  const [page, setPage] = useState('home'); // 'home', 'skills', 'work', 'feats'
  const [isOpened, setIsOpened] = useState(false);

  // Auto-reset state when returning to home page
  const navigateTo = (nextPage) => {
    setPage(nextPage);
  };

  const isDark = page === 'work';
  const isLeftDark = isDark || (page === 'home' && isOpened);

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
          className={`text-xs font-bold tracking-[0.35em] font-mono cursor-pointer pointer-events-auto hover:opacity-75 transition-opacity ${isLeftDark ? 'text-white' : 'text-black'}`}
        >
          VENMUGIL
        </div>

        {/* Navigation / Back Arrow in Center Header */}
        <div className="flex items-center gap-4 pointer-events-auto">
          {/* Back Navigation Arrow */}
          <AnimatePresence>
            {page !== 'home' && (
              <motion.button
                key="back-button"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                onClick={() => navigateTo('home')}
                className={`p-3 rounded-full border border-current hover:bg-current hover:text-white transition-all flex items-center justify-center`}
                aria-label="Back to home"
              >
                <ArrowLeft size={18} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <a 
          href="mailto:venmugilrajans@gmail.com" 
          className={`text-xs font-bold uppercase tracking-[0.2em] pointer-events-auto hover:opacity-50 transition-opacity ${isDark ? 'text-white' : 'text-black'}`}
        >
          Say hi..
        </a>
      </header>

      {/* Left Sidebar Nav & Socials (Homepage only) */}
      {page === 'home' && (
        <div className={`fixed left-4 md:left-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-8 md:gap-12 z-50 ${isLeftDark ? 'text-white' : 'text-black'}`}>
          <div className="flex flex-col items-center gap-12 md:gap-20 text-[10px] font-bold uppercase tracking-[0.3em] font-mono">
            {/* Projects (always on left sidebar) */}
            <button 
              onClick={() => navigateTo('work')} 
              className="hover:opacity-50 transition-opacity -rotate-90 origin-center my-4"
            >
              Projects
            </button>
          </div>
          
          {/* Social Icons */}
          <div className="flex flex-col items-center gap-4 md:gap-6 mt-4">
            <a href="https://github.com/venmugilrajan" target="_blank" rel="noopener noreferrer" className="hover:opacity-60 transition-opacity"><Github size={14} /></a>
            <a href="https://www.linkedin.com/in/venmugil-rajan-s-1362b3354/" target="_blank" rel="noopener noreferrer" className="hover:opacity-60 transition-opacity"><Linkedin size={14} /></a>
            <a href="mailto:venmugilrajans@gmail.com" className="hover:opacity-60 transition-opacity"><Mail size={14} /></a>
            <a href="https://leetcode.com/u/Venmugilrajans/" target="_blank" rel="noopener noreferrer" className="hover:opacity-60 transition-opacity"><Code2 size={14} /></a>
            <div className="w-[1px] h-12 md:h-20 bg-current opacity-30 mt-2" />
          </div>
        </div>
      )}

      {/* Right Sidebar Nav (Homepage only) */}
      {page === 'home' && (
        <div className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-12 z-50 text-black">
          <button 
            onClick={() => navigateTo('feats')} 
            className="hover:opacity-50 transition-opacity rotate-90 origin-center my-4 text-[10px] font-bold uppercase tracking-[0.3em] font-mono"
          >
            Feats
          </button>
          <div className="w-[1px] h-12 md:h-20 bg-black opacity-30 mt-4" />
        </div>
      )}

      {/* Bottom Nav Links (Homepage only) */}
      {page === 'home' && (
        <div className="fixed bottom-8 left-4 md:left-8 right-4 md:right-8 flex justify-between text-[10px] font-bold uppercase tracking-[0.3em] font-mono z-50 pointer-events-none">
          <button 
            onClick={() => setIsOpened(!isOpened)} 
            className={`pointer-events-auto hover:opacity-50 transition-opacity ${isOpened ? 'text-white' : 'text-black'}`}
          >
            About
          </button>
          <button 
            onClick={() => navigateTo('skills')} 
            className="pointer-events-auto hover:opacity-50 transition-opacity text-black"
          >
            My Skills
          </button>
        </div>
      )}

      {/* Social Sidebar (only on subpages) */}
      {page !== 'home' && (
        <div className={`fixed bottom-8 left-8 hidden md:flex flex-col gap-6 z-50 items-center ${isLeftDark ? 'text-white' : 'text-black'}`}>
          <div className="w-[1px] h-20 bg-current opacity-30" />
          <a href="https://github.com/venmugilrajan" target="_blank" rel="noopener noreferrer" className="hover:opacity-60 transition-opacity"><Github size={16} /></a>
          <a href="https://www.linkedin.com/in/venmugil-rajan-s-1362b3354/" target="_blank" rel="noopener noreferrer" className="hover:opacity-60 transition-opacity"><Linkedin size={16} /></a>
          <a href="mailto:venmugilrajans@gmail.com" className="hover:opacity-60 transition-opacity"><Mail size={16} /></a>
          <a href="https://leetcode.com/u/Venmugilrajans/" target="_blank" rel="noopener noreferrer" className="hover:opacity-60 transition-opacity"><Code2 size={16} /></a>
        </div>
      )}

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
              <AnimatePresence>
                {isOpened && (
                  <motion.button
                    key="close-split-button"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    onClick={() => setIsOpened(false)}
                    className="absolute top-24 left-1/2 -translate-x-1/2 p-3 rounded-full border border-black dark:border-white z-50 text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                  >
                    <ArrowLeft size={18} />
                  </motion.button>
                )}
              </AnimatePresence>

              {/* Centered click target (Code Orb) */}
              {!isOpened && (
                <div className="flex flex-col items-center gap-4 z-20">
                  <button 
                    onClick={() => setIsOpened(true)}
                    className="w-40 h-40 rounded-full flex items-center justify-center cursor-pointer overflow-hidden relative group transition-transform duration-500 hover:scale-105 active:scale-95"
                    aria-label="Enter site"
                  >
                    {/* Pulsing glow ring */}
                    <div className="absolute inset-0 rounded-full bg-blue-500/10 scale-90 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-500 animate-ping" />
                    
                    {/* Outer rotating dashed ring */}
                    <div className="absolute inset-2 rounded-full border border-dashed border-black/35 dark:border-white/35 animate-[spin_30s_linear_infinite] group-hover:border-blue-500/50 group-hover:animate-[spin_10s_linear_infinite] transition-all duration-500" />
                    
                    {/* Inner interactive disc */}
                    <div className="absolute inset-6 rounded-full bg-black text-white dark:bg-white dark:text-black flex flex-col items-center justify-center transition-transform duration-500 group-hover:scale-95 shadow-lg">
                      <Code2 size={28} className="group-hover:text-blue-400 group-hover:scale-110 transition-all duration-500" />
                      <span className="text-[8px] font-black tracking-[0.2em] uppercase font-mono mt-2 opacity-65 group-hover:opacity-100 group-hover:text-blue-400 transition-all duration-500">ENTER</span>
                    </div>
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
                    className="w-11/12 max-w-4xl min-h-[450px] md:h-[450px] flex flex-col md:flex-row relative z-20 overflow-visible"
                  >
                    {/* Left half - darkBackground background with rounded corners */}
                    <div className="w-full md:w-1/2 min-h-[250px] md:h-full border border-white/20 md:border-r-0 border-b-0 md:border-b bg-darkBackground text-white flex flex-col justify-center p-8 md:p-12 text-left z-10 rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none shadow-2xl">
                      <h1 className="text-3xl md:text-5xl font-black mb-4 leading-none font-sans">
                        Hi,<br />I'm Venmugil Rajan
                      </h1>
                      <p className="text-xs md:text-sm text-white/75 font-light font-mono leading-relaxed max-w-md">
                        Detail-oriented Software / Full-Stack Developer with certified expertise in Java SE 17, OCI, and AWS. Passionate about building high-performance web systems and smooth interactive interfaces.
                      </p>
                    </div>

                    {/* Right half - background (beige) with rounded corners */}
                    <div className="w-full md:w-1/2 h-[300px] md:h-full border border-black/10 md:border-l-0 border-t-0 md:border-t bg-background relative flex items-center justify-center overflow-hidden md:overflow-visible z-10 rounded-b-3xl md:rounded-r-3xl md:rounded-bl-none shadow-2xl">
                      <img 
                        src={profileImg} 
                        alt="Venmugil Rajan Profile" 
                        className="absolute bottom-0 h-[95%] md:h-[105%] w-auto object-contain select-none z-20 pointer-events-none"
                      />
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
                {/* Left Card: Full-Stack */}
                <motion.div 
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-[#f3f2ec] border-2 border-black p-8 md:p-10 text-black flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-4 mb-6 text-left">
                      <Code2 className="text-black" size={24} />
                      <h3 className="text-lg font-mono font-bold uppercase tracking-wider text-black">
                        Full-Stack & Systems
                      </h3>
                    </div>
                    <p className="text-xs md:text-sm text-black/70 font-light leading-relaxed mb-6 font-mono text-left">
                      Building responsive client interfaces, structured backend databases, and secure authentication models.
                    </p>
                    
                    <div className="mb-6 text-left">
                      <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-black block mb-2">I LIKE TO CODE IN</span>
                      <span className="text-xs md:text-sm font-semibold text-black/85 font-mono">C, C++, Java, Python, SQL</span>
                    </div>

                    <div className="text-left">
                      <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-black block mb-2">WEB PLATFORMS</span>
                      <ul className="space-y-1 text-xs md:text-sm font-semibold text-black/85 font-mono">
                        <li>• HTML5, CSS3, JavaScript</li>
                        <li>• React.js, TailwindCSS, PHP, MySQL</li>
                        <li>• Git, GitHub, PHPMailer</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>

                {/* Right Card: AI/ML & Ecosystem */}
                <motion.div 
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-[#f3f2ec] border-2 border-black p-8 md:p-10 text-black flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-4 mb-6 text-left">
                      <Sparkles className="text-black" size={24} />
                      <h3 className="text-lg font-mono font-bold uppercase tracking-wider text-black">
                        AI/ML & Ecosystem
                      </h3>
                    </div>
                    <p className="text-xs md:text-sm text-black/70 font-light leading-relaxed mb-6 font-mono text-left">
                      Integrating machine learning classifiers, neural networks, and interactive training environments.
                    </p>

                    <div className="mb-6 text-left">
                      <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-black block mb-2">INTEGRATIONS</span>
                      <span className="text-xs md:text-sm font-semibold text-black/85 font-mono">Machine Learning, CNN Models, OpenCV, TensorFlow, Keras</span>
                    </div>

                    <div className="text-left">
                      <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-black block mb-2">DEVELOPMENT TOOLS</span>
                      <ul className="space-y-1 text-xs md:text-sm font-semibold text-black/85 font-mono">
                        <li>• Streamlit, Gradio, Jupyter</li>
                        <li>• PowerBI, Figma, Canva</li>
                        <li>• Unity Game Engine, C#</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Bottom Spinning Decorative Code Emblem */}
              <div className="absolute bottom-8 right-8 text-black opacity-30 animate-[spin_20s_linear_infinite]">
                <Code2 size={24} />
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

                    <div className="my-auto text-left">
                      <h3 className="text-xl md:text-2xl font-black tracking-tight mb-4">{proj.title}</h3>
                      <p className="text-xs md:text-sm text-black/70 font-light leading-relaxed mb-4">
                        {proj.desc}
                      </p>
                    </div>

                    <div className="text-left">
                      <span className="text-[9px] font-bold tracking-[0.2em] font-mono uppercase text-black/50 block">TECH STACK</span>
                      <span className="text-xs font-semibold text-black/80">{proj.tech}</span>
                    </div>
                  </div>
                ))}
              </HorizontalScroll>

              {/* Bottom Swipe cue */}
              <div className="absolute bottom-8 right-8 flex items-center gap-6">
                <span className="text-xs uppercase tracking-[0.4em] font-mono opacity-30 select-none">Swipe..</span>
                <div className="text-white opacity-30 animate-[spin_20s_linear_infinite]">
                  <Code2 size={24} />
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
              style={{ 
                backgroundImage: "url('https://images.unsplash.com/photo-1513001900722-370f803f498d?q=80&w=1974&auto=format&fit=crop')", 
                backgroundSize: 'cover', 
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed'
              }}
            >
              {/* Desaturating/Texturizing Overlay */}
              <div className="absolute inset-0 bg-[#FCFBF7]/95 z-0 backdrop-blur-[1px]" />

              <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none opacity-[0.03] z-0">
                <span className="text-[18vw] font-black tracking-tighter text-black font-sans">FEATS</span>
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
                      desc: 'Certified competence in building modular object-oriented applications, managing concurrency APIs, and implementing memory-safe constructs in Java SE 17.',
                      tags: ['#Java', '#ObjectOriented', '#Concurrency', '#Backend']
                    },
                    {
                      title: 'OCI Cloud Infrastructure',
                      issuer: 'Oracle Certified Associate',
                      badge: 'https://catalog-education.oracle.com/ords/certview/sharebadge?id=97EAAF86588703C016AD49C5D2D1227FFF0125CB02B79F2FA21515C6C5EFF3F0',
                      desc: 'Architecting containerized cloud pipelines, load balancers, database instances, and securing microservices on Oracle Cloud Infrastructure.',
                      tags: ['#OracleCloud', '#OCI', '#Microservices', '#Infrastructure']
                    },
                    {
                      title: 'AWS Cloud Fundamentals',
                      issuer: 'Amazon Essentials Training',
                      badge: 'https://venmugilrajan.github.io/portfolio/aws%20cloud%20practitioner%20essentials.pdf',
                      desc: 'Familiarity with cloud security models, serverless functions (Lambda), EC2 cluster management, and S3 asset buckets.',
                      tags: ['#AWS', '#CloudPractitioner', '#Serverless', '#DevOps']
                    },
                    {
                      title: 'Python for Data Science',
                      issuer: 'Cognitive Class Certificate',
                      badge: 'https://courses.cognitiveclass.ai/certificates/27e9670f63de45c7a1d677dea3155c8d',
                      desc: 'Expertise in data extraction, CSV processing, statistical calculations, and graphing using Pandas, NumPy, and Matplotlib.',
                      tags: ['#Python', '#DataScience', '#Pandas', '#DataAnalysis']
                    }
                  ].map((feat, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ y: 20, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white/90 border-2 border-black p-8 rounded-none flex flex-col justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                    >
                      <div className="text-left">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-bold tracking-tight text-black">{feat.title}</h3>
                            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider font-mono">{feat.issuer}</span>
                          </div>
                          <BookOpen className="text-blue-500" size={20} />
                        </div>
                        <p className="text-xs md:text-sm text-black/70 font-light leading-relaxed mb-6 font-sans">
                          {feat.desc}
                        </p>
                      </div>

                      <div>
                        {/* Tags row */}
                        <div className="flex flex-wrap gap-2 mb-4 text-left">
                          {feat.tags.map((tag, tid) => (
                            <span key={tid} className="text-[9px] font-mono font-bold text-black/50 mr-2">
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="text-left">
                          <a 
                            href={feat.badge} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-black hover:text-blue-600 transition-colors"
                          >
                            Verify Credential <ExternalLink size={12} />
                          </a>
                        </div>
                      </div>
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
