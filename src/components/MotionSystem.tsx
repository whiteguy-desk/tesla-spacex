import React, { useEffect, useState, useRef } from 'react';

// Detect reduced motion preference
const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }

    try {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery?.matches || false);

      const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
      }
    } catch {
      // Safe fallback
    }
  }, []);

  return prefersReducedMotion;
};

// Custom Hook for Scroll Intersection with Safe Fallback
export const useScrollReveal = <T extends HTMLElement = HTMLDivElement>(
  threshold = 0.15,
  rootMargin = '0px 0px -50px 0px'
) => {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Safe fallback if IntersectionObserver is unavailable in legacy environments
    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(node);

    return () => {
      if (node) observer.unobserve(node);
    };
  }, [threshold, rootMargin]);

  return { ref, isVisible };
};

// 1. PAGE TRANSITION WRAPPER
export interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children, className = '' }) => {
  const prefersReduced = usePrefersReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      className={`animate-in fade-in slide-in-from-bottom-2 duration-500 ease-out fill-mode-forwards ${className}`}
    >
      {children}
    </div>
  );
};

// 2. SCROLL REVEAL COMPONENT
export interface RevealProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  duration?: number;
  delay?: number;
  className?: string;
}

export const Reveal: React.FC<RevealProps> = ({
  children,
  direction = 'up',
  duration = 600,
  delay = 0,
  className = '',
}) => {
  const { ref, isVisible } = useScrollReveal();
  const prefersReduced = usePrefersReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  let transformStyle = 'translate3d(0, 0, 0)';
  if (!isVisible) {
    switch (direction) {
      case 'up':
        transformStyle = 'translate3d(0, 30px, 0)';
        break;
      case 'down':
        transformStyle = 'translate3d(0, -30px, 0)';
        break;
      case 'left':
        transformStyle = 'translate3d(30px, 0, 0)';
        break;
      case 'right':
        transformStyle = 'translate3d(-30px, 0, 0)';
        break;
      case 'none':
        transformStyle = 'translate3d(0, 0, 0)';
        break;
    }
  }

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: transformStyle,
        transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: 'opacity, transform',
      }}
      className={className}
    >
      {children}
    </div>
  );
};

// 3. STAGGER CONTAINER & ITEM
export interface StaggerContainerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  staggerDelay = 80,
  className = '',
}) => {
  const { ref, isVisible } = useScrollReveal();
  const prefersReduced = usePrefersReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={className}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;

        const delay = index * staggerDelay;
        return (
          <div
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translate3d(0, 0, 0)' : 'translate3d(0, 24px, 0)',
              transition: `opacity 550ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 550ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
              willChange: 'opacity, transform',
            }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
};

// 4. MOTION CARD INTERACTION WRAPPER
export interface MotionCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export const MotionCard: React.FC<MotionCardProps> = ({
  children,
  className = '',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`group relative rounded-2xl transition-all duration-300 transform-gpu hover:-translate-y-1.5 hover:shadow-[0_15px_35px_rgba(0,0,0,0.5)] active:scale-[0.99] ${className}`}
    >
      {children}
    </div>
  );
};
