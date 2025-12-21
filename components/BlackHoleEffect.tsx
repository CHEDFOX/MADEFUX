
import React, { useEffect, useRef } from 'react';
import { PageState } from '../App';

interface BlackHoleEffectProps {
  state: PageState;
}

const BlackHoleEffect: React.FC<BlackHoleEffectProps> = ({ state }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const speedRef = useRef(1);
  const targetSpeedRef = useRef(1);

  useEffect(() => {
    // Determine target speed based on app state
    switch (state) {
      case PageState.THRESHOLD:
        targetSpeedRef.current = 1.5;
        break;
      case PageState.TRANSITION:
        targetSpeedRef.current = 25; // Warp speed
        break;
      case PageState.CONTENT:
        targetSpeedRef.current = 3; // Calm background
        break;
    }
  }, [state]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const particleCount = 250;

    class Particle {
      x: number;
      y: number;
      z: number;
      prevX: number;
      prevY: number;
      color: string;

      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = (Math.random() - 0.5) * canvas!.width * 2;
        this.y = (Math.random() - 0.5) * canvas!.height * 2;
        this.z = initial ? Math.random() * canvas!.width : canvas!.width;
        this.prevX = (this.x / this.z) * (canvas!.width / 2) + canvas!.width / 2;
        this.prevY = (this.y / this.z) * (canvas!.height / 2) + canvas!.height / 2;
        this.color = `rgba(255, 255, 255, ${Math.random() * 0.4 + 0.1})`;
      }

      update(speed: number) {
        this.prevX = (this.x / this.z) * (canvas!.width / 2) + canvas!.width / 2;
        this.prevY = (this.y / this.z) * (canvas!.height / 2) + canvas!.height / 2;

        this.z -= speed;

        if (this.z <= 0) {
          this.reset();
        }
      }

      draw() {
        const sx = (this.x / this.z) * (canvas!.width / 2) + canvas!.width / 2;
        const sy = (this.y / this.z) * (canvas!.height / 2) + canvas!.height / 2;

        ctx!.beginPath();
        ctx!.strokeStyle = this.color;
        // Thicker lines during transition for cinematic "stretch"
        ctx!.lineWidth = Math.max(0.5, (1 - this.z / canvas!.width) * (state === PageState.TRANSITION ? 4 : 2));
        ctx!.moveTo(this.prevX, this.prevY);
        ctx!.lineTo(sx, sy);
        ctx!.stroke();
      }
    }

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      // Lerp speed for smooth acceleration/deceleration
      speedRef.current += (targetSpeedRef.current - speedRef.current) * 0.05;

      // Darker trails during transition
      const fadeAlpha = state === PageState.TRANSITION ? 0.3 : 0.15;
      ctx.fillStyle = `rgba(0, 0, 0, ${fadeAlpha})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.update(speedRef.current);
        p.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    const handleResize = () => {
      init();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [state]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ filter: state === PageState.TRANSITION ? 'blur(1px)' : 'none' }}
    />
  );
};

export default BlackHoleEffect;
