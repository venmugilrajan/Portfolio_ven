import React, { useEffect, useRef } from 'react';

const DotGrid = ({ dotColor = 'rgba(255, 255, 255, 0.2)', dotSize = 1, spacing = 30, mouseRadius = 100 }) => {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const dots = [];

    const initDots = () => {
      dots.length = 0;
      const width = canvas.width;
      const height = canvas.height;
      for (let x = spacing / 2; x < width; x += spacing) {
        for (let y = spacing / 2; y < height; y += spacing) {
          dots.push({
            x,
            y,
            originalX: x,
            originalY: y,
          });
        }
      }
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initDots();
    };

    const onMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove);
    resize();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      dots.forEach((dot) => {
        const dx = mouse.current.x - dot.originalX;
        const dy = mouse.current.y - dot.originalY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouseRadius) {
          const power = (mouseRadius - distance) / mouseRadius;
          const forceX = dx * power * 0.4;
          const forceY = dy * power * 0.4;
          dot.x = dot.originalX - forceX;
          dot.y = dot.originalY - forceY;
        } else {
          dot.x += (dot.originalX - dot.x) * 0.1;
          dot.y += (dot.originalY - dot.y) * 0.1;
        }

        ctx.fillStyle = dotColor;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dotSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Add a tiny glow for better visibility
        if (distance < mouseRadius) {
            ctx.fillStyle = dotColor.replace('0.4', '0.1');
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, dotSize * 3, 0, Math.PI * 2);
            ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [dotColor, dotSize, spacing, mouseRadius]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
    />
  );
};

export default DotGrid;
