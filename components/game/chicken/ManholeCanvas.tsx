'use client';
import React, { useEffect, useRef } from 'react';

const ManholeWithFire = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Fire particle class
    class FireParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      size: number;
      baseX: number;

      constructor(baseX: number, baseY: number) {
        this.baseX = baseX;
        this.x = baseX + (Math.random() - 0.5) * 15;
        this.y = baseY;
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = -Math.random() * 3 - 2;
       

        this.maxLife = Math.random() * 50 + 50;
        this.size = Math.random() * 6 + 5;
         this.life = 0;
      }

      update() {
  this.life++;
  this.x += this.vx;
  this.y += this.vy;
  this.vy -= 0.08;
  this.vx += (this.baseX - this.x) * 0.015;
  this.size *= 0.97;
}


      draw(ctx: CanvasRenderingContext2D) {
        const alpha = this.life / this.maxLife;
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2);
        
        if (alpha > 0.7) {
          gradient.addColorStop(0, `rgba(255, 255, 240, ${alpha * 0.9})`);
          gradient.addColorStop(0.2, `rgba(255, 230, 120, ${alpha * 0.8})`);
          gradient.addColorStop(0.5, `rgba(255, 120, 50, ${alpha * 0.6})`);
          gradient.addColorStop(1, `rgba(255, 50, 20, 0)`);
        } else if (alpha > 0.4) {
          gradient.addColorStop(0, `rgba(255, 220, 100, ${alpha * 0.8})`);
          gradient.addColorStop(0.3, `rgba(255, 140, 50, ${alpha * 0.7})`);
          gradient.addColorStop(0.7, `rgba(255, 70, 30, ${alpha * 0.4})`);
          gradient.addColorStop(1, `rgba(200, 40, 20, 0)`);
        } else {
          gradient.addColorStop(0, `rgba(255, 120, 50, ${alpha * 0.6})`);
          gradient.addColorStop(0.4, `rgba(220, 60, 40, ${alpha * 0.4})`);
          gradient.addColorStop(1, `rgba(150, 30, 20, 0)`);
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
        ctx.fill();
      }

     isDead() {
  return this.life >= this.maxLife;
}

    }

    const particles: FireParticle[] = [];

    const drawManhole = (ctx: CanvasRenderingContext2D, cx: number, cy: number, withFire: boolean) => {
      // Shadow
      ctx.fillStyle = '#0d1418';
      ctx.beginPath();
      ctx.ellipse(cx, cy, 65, 40, 0, 0, Math.PI * 2);
      ctx.fill();

      // Outer ring
      ctx.strokeStyle = '#1e3a47';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 60, 37, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Inner area
      ctx.fillStyle = '#0a1215';
      ctx.beginPath();
      ctx.ellipse(cx, cy, 45, 28, 0, 0, Math.PI * 2);
      ctx.fill();

      // Grill bars
      ctx.fillStyle = '#1e3a47';
      ctx.fillRect(cx - 40, cy - 3, 80, 3);
      ctx.fillRect(cx - 30, cy - 10, 60, 2.5);
      ctx.fillRect(cx - 30, cy + 6, 60, 2.5);
      ctx.fillRect(cx - 20, cy - 17, 40, 2);
      ctx.fillRect(cx - 20, cy + 13, 40, 2);
    };

    let animationId: number;

    const animate = () => {
      // Clear canvas
      ctx.fillStyle = '#1a2832';
      ctx.fillRect(0, 0, width, height);

      // Draw manholes
      drawManhole(ctx, 150, 150, true);
      drawManhole(ctx, 350, 150, false);

      // Spawn new particles for left manhole (multiple per frame)
      for (let i = 0; i < 3; i++) {
        if (Math.random() > 0.3) {
          particles.push(new FireParticle(130, 140));
        }
        if (Math.random() > 0.3) {
          particles.push(new FireParticle(170, 140));
        }
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        
        if (particles[i].isDead()) {
          particles.splice(i, 1);
        } else {
          particles[i].draw(ctx);
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#1a2832]">
      <canvas
        ref={canvasRef}
        width={500}
        height={300}
        className="border border-gray-700 rounded-lg"
      />
    </div>
  );
};

export default ManholeWithFire;