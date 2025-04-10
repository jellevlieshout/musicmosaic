import React, { useState, useEffect } from 'react';
import '@/styles/neon.css';

type FlickerState = {
  M: boolean;
  U: boolean;
  S: boolean;
  I: boolean;
  C: boolean;
  M2: boolean;
  O: boolean;
  S2: boolean;
  A: boolean;
  I2: boolean;
  C2: boolean;
};

const NeonTitle = () => {
  const [flickerStates, setFlickerStates] = useState<FlickerState>({
    M: false, U: false, S: false, I: false, C: false,
    M2: false, O: false, S2: false, A: false, I2: false, C2: false
  });

  useEffect(() => {
    // Function to randomly update flicker states
    const flickerLetter = () => {
      const letters = ['M', 'U', 'S', 'I', 'C', 'M2', 'O', 'S2', 'A', 'I2', 'C2'] as const;
      const randomLetter = letters[Math.floor(Math.random() * letters.length)];
      
      setFlickerStates(prevState => ({
        ...prevState,
        [randomLetter]: !prevState[randomLetter]
      }));
    };

    // Set up interval for flickering effect
    const flickerInterval = setInterval(flickerLetter, 100);
    
    // Clean up interval on component unmount
    return () => clearInterval(flickerInterval);
  }, []);

  // Function to determine letter style based on flicker state
  const getLetterStyle = (letter: keyof FlickerState, isMusicRow: boolean) => {
    const baseStyle = "font-bold transition-all duration-100 neon-text neon-tubes-styling";
    const normalGlow = isMusicRow ? "text-purple-300" : "text-cyan-300";
    const brightGlow = "text-white";
    
    return `${baseStyle} ${flickerStates[letter] ? brightGlow : normalGlow}`;
  };

  // Function to get text shadow style
  const getTextShadow = (letter: keyof FlickerState, isMusicRow: boolean) => {
    const color = isMusicRow ? "#ff00ff" : "#00ffff";
    return flickerStates[letter] 
      ? `0 0 5px #fff, 0 0 10px #fff, 0 0 20px ${color}, 0 0 30px ${color}, 0 0 40px ${color}`
      : `0 0 5px #fff, 0 0 10px ${color}, 0 0 20px ${color}`;
  };

  return (
    <div className="text-center" style={{fontSize: '6rem'}}>
      {/* First row: MUSIC */}
      <div className="flex justify-center mb-2">
        <span className={getLetterStyle('M', true)} style={{ textShadow: getTextShadow('M', true) }}>M</span>
        <span className={getLetterStyle('U', true)} style={{ textShadow: getTextShadow('U', true) }}>U</span>
        <span className={getLetterStyle('S', true)} style={{ textShadow: getTextShadow('S', true) }}>S</span>
        <span className={getLetterStyle('I', true)} style={{ textShadow: getTextShadow('I', true) }}>I</span>
        <span className={getLetterStyle('C', true)} style={{ textShadow: getTextShadow('C', true) }}>C</span>
      </div>
      
      {/* Second row: MOSAIC */}
      <div className="flex justify-center">
        <span className={getLetterStyle('M2', false)} style={{ textShadow: getTextShadow('M2', true) }}>M</span>
        <span className={getLetterStyle('O', false)} style={{ textShadow: getTextShadow('O', true) }}>O</span>
        <span className={getLetterStyle('S2', false)} style={{ textShadow: getTextShadow('S2', true) }}>S</span>
        <span className={getLetterStyle('A', false)} style={{ textShadow: getTextShadow('A', true) }}>A</span>
        <span className={getLetterStyle('I2', false)} style={{ textShadow: getTextShadow('I2', true) }}>I</span>
        <span className={getLetterStyle('C2', false)} style={{ textShadow: getTextShadow('C2', true) }}>C</span>
      </div>
    </div>
  );
};

export default NeonTitle; 