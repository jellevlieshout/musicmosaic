import { useEffect, useRef } from 'react';

interface AudioWaveProps {
  color?: string;
  amplitude?: number;
  frequency?: number;
  speed?: number;
  mirror?: boolean;
  isPlaying?: boolean;
}

export default function AudioWave({ 
  color = "#00ffff", 
  amplitude = 20, 
  frequency = 0.02, 
  speed = 0.05,
  mirror = false,
  isPlaying = true
}: AudioWaveProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const timeRef = useRef(0);
  const barsRef = useRef<number[]>([]);

  // Initialize bars with random heights
  useEffect(() => {
    barsRef.current = Array(15).fill(0).map(() => Math.random() * amplitude * 1.5);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      if (!ctx || !canvas) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = 3;
      const gap = 2;
      const totalBars = 15;
      const startX = (canvas.width - (totalBars * (barWidth + gap) - gap)) / 2;

      // Draw audio bars
      for (let i = 0; i < totalBars; i++) {
        const x = startX + i * (barWidth + gap);
        const xPos = mirror ? canvas.width - x - barWidth : x;

        if (isPlaying) {
          // Simulate audio levels with some randomness and smooth transitions
          // Only update every few frames to slow down the frequency
          if (Math.random() < 0.2) { // 20% chance to update each frame
            const targetHeight = Math.random() * amplitude * 1.5; // 50% taller bars
            barsRef.current[i] += (targetHeight - barsRef.current[i]) * 0.2; // Slower transition
          }
        }

        const barHeight = barsRef.current[i];
        
        // Draw the bar
        ctx.fillStyle = color;
        ctx.fillRect(
          xPos,
          canvas.height / 2 - barHeight / 2,
          barWidth,
          barHeight
        );
      }

      // Continue animation
      animationRef.current = requestAnimationFrame(draw);
    };

    // Start animation
    draw();

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [color, amplitude, frequency, speed, mirror, isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      width={75}
      height={150}
    />
  );
} 