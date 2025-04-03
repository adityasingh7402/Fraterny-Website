
import { useEffect, useState, useRef, RefObject } from 'react';

type IntersectionOptions = {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  triggerOnce?: boolean;
};

/**
 * Custom hook that uses Intersection Observer API to detect when an element enters the viewport
 */
export function useIntersectionObserver<T extends Element>(
  options: IntersectionOptions = {}
): [RefObject<T>, boolean, IntersectionObserverEntry | null] {
  const { 
    root = null, 
    rootMargin = '200px', // Preload when within 200px of viewport
    threshold = 0,
    triggerOnce = false 
  } = options;
  
  const elementRef = useRef<T>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  
  // Store observer instance in ref to avoid recreation on each render
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Check if browser supports Intersection Observer
    if (!('IntersectionObserver' in window)) {
      // Fallback for older browsers - always load images
      setIsIntersecting(true);
      return;
    }
    
    const element = elementRef.current;
    if (!element) return;
    
    // Cleanup previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      
      // Update state based on visibility
      setIsIntersecting(entry.isIntersecting);
      setEntry(entry);
      
      // If element is visible and triggerOnce is true, unobserve it
      if (entry.isIntersecting && triggerOnce && observerRef.current) {
        observerRef.current.unobserve(element);
      }
    };
    
    // Create new observer
    observerRef.current = new IntersectionObserver(handleIntersect, {
      root,
      rootMargin,
      threshold
    });
    
    // Start observing
    observerRef.current.observe(element);
    
    // Cleanup on unmount
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [root, rootMargin, threshold, triggerOnce]);
  
  return [elementRef, isIntersecting, entry];
}
