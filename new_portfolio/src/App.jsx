import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Github, Linkedin, Mail, Code2, ExternalLink, Award, Sparkles, BookOpen, Layers } from 'lucide-react';
import profileImg from './Gemini_Generated_Image_xuuob3xuuob3xuuo.png';

const ParticleCanvas = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    const particles = Array.from({ length: 50 }, () => ({
      x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.6, vy: (Math.random() - 0.5) * 0.6,
      r: Math.random() * 1.5 + 0.5,
    }));
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.fillStyle = 'rgba(91,79,232,0.4)';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      });
      for (let i = 0; i < particles.length; i++)
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx*dx+dy*dy);
          if (d < 100) {
            ctx.strokeStyle = `rgba(91,79,232,${0.12*(1-d/100)})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath(); ctx.moveTo(particles[i].x,particles[i].y); ctx.lineTo(particles[j].x,particles[j].y); ctx.stroke();
          }
        }
      animId = requestAnimationFrame(animate);
    };
    animate();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />;
};

const HorizontalScroll = ({ children }) => {
  const ref = useRef(null);
  const down = useRef(false), startX = useRef(0), sl = useRef(0);
  return (
    <div ref={ref}
      onMouseDown={e => { down.current = true; startX.current = e.pageX - ref.current.offsetLeft; sl.current = ref.current.scrollLeft; }}
      onMouseLeave={() => down.current = false} onMouseUp={() => down.current = false}
      onMouseMove={e => { if (!down.current) return; e.preventDefault(); ref.current.scrollLeft = sl.current - (e.pageX - ref.current.offsetLeft - startX.current) * 1.5; }}
      className="flex gap-8 overflow-x-auto no-scrollbar py-8 px-10 cursor-grab active:cursor-grabbing select-none w-full max-w-7xl mx-auto"
    >{children}</div>
  );
};

const CustomCursor = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [fol, setFol] = useState({ x: 0, y: 0 });
  const [hov, setHov] = useState(false);
  useEffect(() => {
    const move = e => setPos({ x: e.clientX, y: e.clientY });
    const hover = e => setHov(!!e.target.closest('a,button,.cursor-pointer'));
    window.addEventListener('mousemove', move); window.addEventListener('mouseover', hover);
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseover', hover); };
  }, []);
  useEffect(() => {
    let id;
    const upd = () => { setFol(p => ({ x: p.x+(pos.x-p.x)*0.15, y: p.y+(pos.y-p.y)*0.15 })); id = requestAnimationFrame(upd); };
    upd(); return () => cancelAnimationFrame(id);
  }, [pos]);
  return (
    <>
      <div className="custom-cursor hidden md:block" style={{ left: pos.x, top: pos.y, opacity: hov ? 0 : 1 }} />
      <div className="custom-cursor-follower hidden md:block" style={{ left: fol.x, top: fol.y, transform: `translate(-50%,-50%) scale(${hov?1.8:1})`, borderColor: hov?'rgba(91,79,232,0.9)':'rgba(91,79,232,0.4)' }} />
    </>
  );
};

export default function App() {
  const [page, setPage] = useState('home');
  const [isOpened, setIsOpened] = useState(false);
  const navigateTo = p => { setPage(p); setIsOpened(false); };
  const isHome = page === 'home';

  return (
    <div className="min-h-screen relative bg-background text-textPrimary font-karla overflow-hidden">
      <CustomCursor />
      <div className="border-frame" />

      {/* Header */}
      <header className="fixed top-6 left-6 right-6 flex justify-between items-center z-50 pointer-events-none">
        <div onClick={() => navigateTo('home')}
          className="text-2xl font-pacifico cursor-pointer pointer-events-auto hover:opacity-70 transition-opacity text-textPrimary">
          VR
        </div>
        <div className="pointer-events-auto">
          <AnimatePresence>
            {!isHome && (
              <motion.button key="back" initial={{ scale:0, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0, opacity:0 }}
                onClick={() => navigateTo('home')}
                className="p-2.5 rounded-full border border-accent/30 text-accent hover:bg-accent hover:text-white transition-all flex items-center justify-center"
                aria-label="Back">
                <ArrowLeft size={16} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
        <a href="mailto:venmugilrajans@gmail.com"
          className="pointer-events-auto text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-textMuted hover:text-accent transition-colors">
          Say hi..
        </a>
      </header>

      {/* Left Sidebar */}
      {isHome && (
        <div className={`fixed left-5 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-10 transition-colors duration-500`}>
          <button onClick={() => navigateTo('work')} className="nav-link-vertical">Projects</button>
          <div className="flex flex-col items-center gap-4 mt-2">
            <a href="https://github.com/venmugilrajan" target="_blank" rel="noopener noreferrer" className="text-textMuted hover:text-accent transition-colors"><Github size={14} /></a>
            <a href="https://www.linkedin.com/in/venmugil-rajan-s-1362b3354/" target="_blank" rel="noopener noreferrer" className="text-textMuted hover:text-accent transition-colors"><Linkedin size={14} /></a>
            <a href="mailto:venmugilrajans@gmail.com" className="text-textMuted hover:text-accent transition-colors"><Mail size={14} /></a>
            <a href="https://leetcode.com/u/Venmugilrajans/" target="_blank" rel="noopener noreferrer" className="text-textMuted hover:text-accent transition-colors"><Code2 size={14} /></a>
            <div className="w-px h-14 bg-muted/50 mt-1" />
          </div>
        </div>
      )}

      {/* Right Sidebar */}
      {isHome && (
        <div className="fixed right-5 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-10">
          <button onClick={() => navigateTo('feats')} className="nav-link-vertical">Feats</button>
          <div className="w-px h-14 bg-muted/50 mt-4" />
        </div>
      )}

      {/* Bottom Nav */}
      {isHome && (
        <div className="fixed bottom-6 left-5 right-5 flex justify-between z-50 pointer-events-none">
          <button onClick={() => setIsOpened(v => !v)}
            className={`pointer-events-auto text-[10px] font-mono font-bold uppercase tracking-[0.25em] transition-colors ${isOpened ? 'text-accent' : 'text-textMuted hover:text-accent'}`}>
            About
          </button>
          <button onClick={() => navigateTo('skills')}
            className="pointer-events-auto text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-textMuted hover:text-accent transition-colors">
            My Skills
          </button>
        </div>
      )}

      {/* Subpage Socials */}
      {!isHome && (
        <div className="fixed bottom-6 left-6 hidden md:flex flex-col items-center gap-5 z-50 text-textMuted">
          <div className="w-px h-16 bg-muted/50" />
          <a href="https://github.com/venmugilrajan" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors"><Github size={14} /></a>
          <a href="https://www.linkedin.com/in/venmugil-rajan-s-1362b3354/" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors"><Linkedin size={14} /></a>
          <a href="mailto:venmugilrajans@gmail.com" className="hover:text-accent transition-colors"><Mail size={14} /></a>
        </div>
      )}

      <main className="min-h-screen w-full flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">

          {/* HOME */}
          {isHome && (
            <motion.div key="home" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.5 }}
              className="relative w-full h-screen flex items-center justify-center">

              {/* Dot grid bg */}
              <div className="absolute inset-0 dot-grid opacity-60 z-0" />

              {/* Split background */}
              <div className="absolute inset-0 flex overflow-hidden z-0">
                <motion.div animate={{ width: isOpened ? '50%' : '100%' }} transition={{ type:'spring', damping:28, stiffness:110 }}
                  className="h-full bg-background" />
                <motion.div animate={{ width: isOpened ? '50%' : '0%' }} transition={{ type:'spring', damping:28, stiffness:110 }}
                  className="h-full bg-surface" />
              </div>

              {/* Divider line */}
              {isOpened && (
                <div className="absolute top-0 bottom-0 z-10 w-px"
                  style={{ left:'50%', background:'linear-gradient(to bottom, transparent, rgba(91,79,232,0.4), transparent)' }} />
              )}

              {/* Close button */}
              <AnimatePresence>
                {isOpened && (
                  <motion.button key="close" initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-20 }}
                    onClick={() => setIsOpened(false)}
                    className="absolute top-20 left-1/2 -translate-x-1/2 p-2.5 rounded-full border border-accent/30 text-accent hover:bg-accent hover:text-white transition-all z-50">
                    <ArrowLeft size={16} />
                  </motion.button>
                )}
              </AnimatePresence>

              {/* Entry button */}
              {!isOpened && (
                <div className="flex flex-col items-center gap-4 z-20">
                  <button onClick={() => setIsOpened(true)} aria-label="Enter"
                    className="relative w-36 h-36 flex items-center justify-center group cursor-pointer">
                    <div className="absolute inset-0 rounded-full border border-dashed border-accent/20 animate-[spin_30s_linear_infinite] group-hover:border-accent/40 transition-colors" />
                    <div className="absolute inset-4 rounded-full border border-accent/10 group-hover:border-accent/30 transition-colors" />
                    <div className="absolute inset-9 rounded-full bg-white border border-accent/20 group-hover:border-accent/60 group-hover:shadow-[0_0_24px_rgba(91,79,232,0.2)] flex flex-col items-center justify-center transition-all duration-300 shadow-sm">
                      <Layers size={20} className="text-accent group-hover:scale-110 transition-transform" />
                      <span className="text-[7px] font-mono font-bold tracking-[0.2em] text-accent/60 mt-1 group-hover:text-accent transition-colors">ENTER</span>
                    </div>
                  </button>
                  <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-textMuted animate-pulse">click here</span>
                </div>
              )}

              {/* Split profile */}
              {isOpened && (
                <div className="relative z-20 flex flex-col items-center justify-center w-full max-w-5xl px-6 h-full">
                  <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.25 }}
                    className="w-full max-w-4xl flex flex-col md:flex-row h-auto md:h-[480px]">

                    {/* Left — dark card */}
                    <div className="w-full md:w-1/2 min-h-[260px] md:h-full split-left-glow text-white flex flex-col justify-center p-10 md:p-12 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none shadow-2xl">
                      <span className="text-[10px] font-mono tracking-[0.35em] uppercase mb-4 flex items-center gap-2 text-white/50">
                        <span className="w-6 h-px bg-accent" /> Full-Stack Developer
                      </span>
                      <h1 className="text-4xl md:text-5xl font-black leading-none mb-5">
                        Hi,<br />I'm Venmugil<br />Rajan
                      </h1>
                      <p className="text-xs text-white/60 font-mono leading-relaxed">
                        Building high-performance web systems & smooth interactive interfaces. Certified in Java SE 17, OCI & AWS.
                      </p>
                      <div className="flex flex-wrap gap-2 mt-6">
                        {['React','Python','Java','ML'].map(t => (
                          <span key={t} className="text-[9px] font-mono px-2 py-1 border border-white/15 text-white/50 rounded-full">{t}</span>
                        ))}
                      </div>
                    </div>

                    {/* Right — light card with avatar */}
                    <div className="w-full md:w-1/2 h-[280px] md:h-full bg-surface relative flex items-end justify-center overflow-hidden rounded-b-2xl md:rounded-r-2xl md:rounded-bl-none shadow-2xl border border-surfaceAlt">
                      <div className="absolute inset-0" style={{ background:'radial-gradient(ellipse at 50% 100%, rgba(91,79,232,0.06) 0%, transparent 70%)' }} />
                      <img src={profileImg} alt="Venmugil" className="h-[92%] w-auto object-contain select-none z-10 relative" />
                    </div>
                  </motion.div>
                </div>
              )}
            </motion.div>
          )}

          {/* SKILLS */}
          {page === 'skills' && (
            <motion.div key="skills" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.4 }}
              className="relative w-full min-h-screen flex flex-col justify-center items-center py-24 px-6 z-10 bg-background">
              <ParticleCanvas />
              <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none opacity-[0.04] z-0">
                <span className="text-[20vw] font-black tracking-tighter text-accent">SKILLS</span>
              </div>
              <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 z-10">
                {[
                  { icon: <Code2 size={20} className="text-accent" />, title:'Full-Stack & Systems', desc:'Building responsive UIs, structured backends, and secure authentication systems.', items:['C, C++, Java, Python, SQL','React.js, TailwindCSS, PHP, MySQL','Git, GitHub, PHPMailer'] },
                  { icon: <Sparkles size={20} className="text-purple" />, title:'AI / ML & Ecosystem', desc:'Integrating ML classifiers, neural networks, and interactive training environments.', items:['TensorFlow, CNN, OpenCV, Keras','Streamlit, Gradio, Jupyter','PowerBI, Unity, Figma'] },
                ].map((s, i) => (
                  <motion.div key={i} initial={{ y:30, opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ delay: i*0.15 }}
                    className="glass-card rounded-2xl p-8">
                    <div className="flex items-center gap-3 mb-4">{s.icon}
                      <h3 className="font-mono font-bold text-sm uppercase tracking-wider text-textPrimary">{s.title}</h3>
                    </div>
                    <p className="text-xs text-textMuted leading-relaxed mb-5 font-mono">{s.desc}</p>
                    <ul className="space-y-2">
                      {s.items.map((it, j) => (
                        <li key={j} className="text-xs font-mono text-textMuted flex items-start gap-2">
                          <span className="text-accent mt-0.5">›</span>{it}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* PROJECTS */}
          {page === 'work' && (
            <motion.div key="work" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.4 }}
              className="relative w-full min-h-screen flex flex-col justify-center items-center py-24 z-10 bg-background">
              <div className="absolute inset-0 dot-grid opacity-40 z-0" />
              <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none opacity-[0.04] z-0">
                <span className="text-[22vw] font-black tracking-tighter text-textPrimary">WORK</span>
              </div>
              <HorizontalScroll>
                {[
                  { num:'01', title:'Online Leave Portal', desc:'Full-stack portal for student-teacher leave management with PHP/MySQL backend and automated email notifications.', tech:'PHP, MySQL, PHPMailer, HTML/CSS', link:'https://github.com/venmugilrajan/online_leave_portal' },
                  { num:'02', title:'Face Recognition CNN', desc:'Deep learning app using CNNs and OpenCV for real-time face identification.', tech:'Python, OpenCV, TensorFlow, CNN', link:'https://github.com/venmugilrajan/face_recognition_cnn' },
                  { num:'03', title:'Digit Recognizer', desc:'ML drawing interface powered by CNN to accurately identify handwritten numbers.', tech:'Python, TensorFlow, Gradio, CNN', link:'https://github.com/venmugilrajan/DIGIT_RECOGNIZER_CNN' },
                  { num:'04', title:'Student Reward Site', desc:'Gamified platform for tracking and managing student rewards and classroom achievements.', tech:'React, Tailwind CSS, Lucide Icons', link:'https://venmugilrajan-student-reward-points.hf.space/' },
                ].map((p, i) => (
                  <div key={i} className="proj-card w-[300px] md:w-[360px] h-[420px] flex-shrink-0 flex flex-col justify-between p-8">
                    <div className="flex justify-between items-start">
                      <span className="text-5xl font-black font-mono text-accent/10">{p.num}</span>
                      <a href={p.link} target="_blank" rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-accentLight border border-accent/15 hover:bg-accent hover:text-white text-accent transition-all">
                        <ExternalLink size={14} />
                      </a>
                    </div>
                    <div>
                      <h3 className="text-xl font-black tracking-tight mb-3 text-textPrimary">{p.title}</h3>
                      <p className="text-xs text-textMuted font-mono leading-relaxed">{p.desc}</p>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-accent/50 block mb-1">Tech Stack</span>
                      <span className="text-xs font-mono text-textMuted">{p.tech}</span>
                    </div>
                  </div>
                ))}
              </HorizontalScroll>
              <div className="absolute bottom-8 right-8 flex items-center gap-3 text-textMuted/40">
                <span className="text-[10px] font-mono uppercase tracking-widest">Drag</span>
                <Code2 size={14} className="animate-[spin_20s_linear_infinite]" />
              </div>
            </motion.div>
          )}

          {/* FEATS */}
          {page === 'feats' && (
            <motion.div key="feats" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.4 }}
              className="relative w-full min-h-screen py-28 px-6 z-10 overflow-y-auto no-scrollbar bg-background">
              <div className="absolute inset-0 dot-grid opacity-40 z-0" />
              <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none opacity-[0.04] z-0">
                <span className="text-[18vw] font-black tracking-tighter text-purple">FEATS</span>
              </div>
              <div className="max-w-4xl mx-auto z-10 relative">
                <p className="text-[10px] font-mono uppercase tracking-[0.35em] text-accent mb-10 text-center flex items-center justify-center gap-2">
                  <Award size={14} /> Verified Credentials
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { title:'Java SE 17 Developer', issuer:'Oracle Certified Professional', badge:'https://catalog-education.oracle.com/pls/certview/sharebadge?id=1D3EA450257E886F877C6A8BB1ACD3C44B36D0AA8695B836071B56AC09982A84', desc:'Certified in building modular OOP applications, concurrency APIs, and memory-safe Java SE 17 constructs.', tags:['Java','OOP','Concurrency'] },
                    { title:'OCI Cloud Infrastructure', issuer:'Oracle Certified Associate', badge:'https://catalog-education.oracle.com/ords/certview/sharebadge?id=97EAAF86588703C016AD49C5D2D1227FFF0125CB02B79F2FA21515C6C5EFF3F0', desc:'Architecting cloud pipelines, load balancers, and securing microservices on Oracle Cloud.', tags:['OCI','Cloud','Microservices'] },
                    { title:'AWS Cloud Fundamentals', issuer:'Amazon Essentials Training', badge:'https://venmugilrajan.github.io/portfolio/aws%20cloud%20practitioner%20essentials.pdf', desc:'Cloud security, Lambda serverless, EC2 clusters, and S3 asset architecture.', tags:['AWS','Serverless','DevOps'] },
                    { title:'Python for Data Science', issuer:'Cognitive Class Certificate', badge:'https://courses.cognitiveclass.ai/certificates/27e9670f63de45c7a1d677dea3155c8d', desc:'Data extraction, CSV processing, statistical analysis using Pandas, NumPy & Matplotlib.', tags:['Python','Pandas','Data'] },
                  ].map((f, i) => (
                    <motion.div key={i} initial={{ y:20, opacity:0 }} whileInView={{ y:0, opacity:1 }} viewport={{ once:true }} transition={{ delay:i*0.1 }}
                      className="feat-card p-7">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-base tracking-tight text-textPrimary">{f.title}</h3>
                          <span className="text-[10px] font-mono text-purple uppercase tracking-wider">{f.issuer}</span>
                        </div>
                        <BookOpen size={16} className="text-purple/50 mt-0.5" />
                      </div>
                      <p className="text-xs text-textMuted leading-relaxed mb-5 font-mono">{f.desc}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {f.tags.map((t, j) => <span key={j} className="tag-pill">#{t}</span>)}
                      </div>
                      <a href={f.badge} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-textMuted hover:text-accent transition-colors">
                        Verify Credential <ExternalLink size={10} />
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
