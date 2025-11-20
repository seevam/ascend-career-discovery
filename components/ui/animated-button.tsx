'use client';

import React, { useState, useRef, ButtonHTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RippleProps {
  x: number;
  y: number;
}

interface AnimatedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  enableRipple?: boolean;
  children: React.ReactNode;
}

export function AnimatedButton({
  variant = 'default',
  size = 'default',
  enableRipple = true,
  children,
  className,
  onClick,
  disabled,
  ...props
}: AnimatedButtonProps) {
  const [ripples, setRipples] = useState<RippleProps[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (enableRipple && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setRipples([...ripples, { x, y }]);

      // Remove ripple after animation
      setTimeout(() => {
        setRipples((prev) => prev.slice(1));
      }, 600);
    }

    if (onClick) {
      onClick(e);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      <Button
        ref={buttonRef}
        variant={variant}
        size={size}
        className={cn('relative overflow-hidden', className)}
        onClick={handleClick}
        disabled={disabled}
        {...props}
      >
        {/* Content */}
        <span className="relative z-10">{children}</span>

        {/* Ripple effects */}
        {enableRipple && ripples.map((ripple, index) => (
          <motion.span
            key={index}
            className="absolute rounded-full bg-white/30"
            style={{
              left: ripple.x,
              top: ripple.y,
            }}
            initial={{ width: 0, height: 0, x: 0, y: 0 }}
            animate={{
              width: 300,
              height: 300,
              x: -150,
              y: -150,
              opacity: [1, 0],
            }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        ))}
      </Button>
    </motion.div>
  );
}
