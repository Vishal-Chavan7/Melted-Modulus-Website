import React from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';

export const ScrollReveal = ({ children, className = '', delay = 0 }) => {
  const { ref, isRevealed } = useScrollReveal();
  
  const classes = `reveal ${isRevealed ? 'revealed' : ''} ${className} ${delay ? `reveal-delay-${delay}` : ''}`;
  
  return (
    <div ref={ref} className={classes.trim()}>
      {children}
    </div>
  );
};
