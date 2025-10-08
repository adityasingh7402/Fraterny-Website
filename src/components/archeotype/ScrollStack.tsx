// import React, { ReactNode, useEffect, useRef, useCallback } from 'react';

// export interface ScrollStackItemProps {
//   itemClassName?: string;
//   children: ReactNode;
// }

// export const ScrollStackItem: React.FC<ScrollStackItemProps> = ({ children, itemClassName = '' }) => (
//   <div
//     className={`scroll-stack-card relative w-full h-80 my-8 p-12 rounded-[40px] shadow-[0_0_30px_rgba(0,0,0,0.1)] box-border origin-top ${itemClassName}`.trim()}
//     style={{
//       backfaceVisibility: 'hidden',
//       transformStyle: 'preserve-3d',
//       willChange: 'transform'
//     }}
//   >
//     {children}
//   </div>
// );

// interface ScrollStackProps {
//   className?: string;
//   children?: ReactNode;
//   itemDistance?: number;
//   itemScale?: number;
//   itemStackDistance?: number;
//   stackPosition?: string;
//   scaleEndPosition?: string;
//   baseScale?: number;
// }

// const ScrollStack: React.FC<ScrollStackProps> = ({
//   children,
//   className = '',
//   itemDistance = 100,
//   itemScale = 0.03,
//   itemStackDistance = 30,
//   stackPosition = '20%',
//   scaleEndPosition = '10%',
//   baseScale = 0.85,
// }) => {
//   const scrollerRef = useRef<HTMLDivElement>(null);
//   const cardsRef = useRef<HTMLElement[]>([]);
//   const lastTransformsRef = useRef(new Map<number, any>());

//   const calculateProgress = useCallback((scrollTop: number, start: number, end: number) => {
//     if (scrollTop < start) return 0;
//     if (scrollTop > end) return 1;
//     return (scrollTop - start) / (end - start);
//   }, []);

//   const parsePercentage = useCallback((value: string | number, containerHeight: number) => {
//     if (typeof value === 'string' && value.includes('%')) {
//       return (parseFloat(value) / 100) * containerHeight;
//     }
//     return parseFloat(value as string);
//   }, []);

//   const updateCardTransforms = useCallback(() => {
//     if (!cardsRef.current.length) return;

//     const scroller = scrollerRef.current;
//     if (!scroller) return;

//     const scrollTop = scroller.scrollTop;
//     const containerHeight = scroller.clientHeight;
//     const stackPositionPx = parsePercentage(stackPosition, containerHeight);
//     const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight);

//     const endElement = scroller.querySelector('.scroll-stack-end') as HTMLElement | null;
//     const endElementTop = endElement ? endElement.offsetTop : 0;

//     cardsRef.current.forEach((card, i) => {
//       if (!card) return;

//       const cardTop = card.offsetTop;
//       const triggerStart = cardTop - stackPositionPx - itemStackDistance * i;
//       const triggerEnd = cardTop - scaleEndPositionPx;
//       const pinStart = cardTop - stackPositionPx - itemStackDistance * i;
//       const pinEnd = endElementTop - containerHeight / 2;

//       const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);
//       const targetScale = baseScale + i * itemScale;
//       const scale = 1 - scaleProgress * (1 - targetScale);

//       let translateY = 0;
//       const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd;

//       if (isPinned) {
//         translateY = scrollTop - cardTop + stackPositionPx + itemStackDistance * i;
//       } else if (scrollTop > pinEnd) {
//         translateY = pinEnd - cardTop + stackPositionPx + itemStackDistance * i;
//       }

//       const newTransform = {
//         translateY: Math.round(translateY * 100) / 100,
//         scale: Math.round(scale * 1000) / 1000,
//       };

//       const lastTransform = lastTransformsRef.current.get(i);
//       const hasChanged =
//         !lastTransform ||
//         Math.abs(lastTransform.translateY - newTransform.translateY) > 0.1 ||
//         Math.abs(lastTransform.scale - newTransform.scale) > 0.001;

//       if (hasChanged) {
//         const transform = `translate3d(0, ${newTransform.translateY}px, 0) scale(${newTransform.scale})`;
//         card.style.transform = transform;
//         lastTransformsRef.current.set(i, newTransform);
//       }
//     });
//   }, [itemScale, itemStackDistance, stackPosition, scaleEndPosition, baseScale, calculateProgress, parsePercentage]);

//   const handleScroll = useCallback(() => {
//     requestAnimationFrame(updateCardTransforms);
//   }, [updateCardTransforms]);

//   useEffect(() => {
//     const scroller = scrollerRef.current;
//     if (!scroller) return;

//     const cards = Array.from(scroller.querySelectorAll('.scroll-stack-card')) as HTMLElement[];
//     cardsRef.current = cards;

//     cards.forEach((card, i) => {
//       if (i < cards.length - 1) {
//         card.style.marginBottom = `${itemDistance}px`;
//       }
//       card.style.willChange = 'transform';
//       card.style.transformOrigin = 'top center';
//       card.style.backfaceVisibility = 'hidden';
//     });

//     scroller.addEventListener('scroll', handleScroll, { passive: true });
//     updateCardTransforms();

//     return () => {
//       scroller.removeEventListener('scroll', handleScroll);
//       cardsRef.current = [];
//       lastTransformsRef.current.clear();
//     };
//   }, [itemDistance, handleScroll, updateCardTransforms]);

//   return (
//     <div
//       className={`relative w-full h-screen overflow-y-auto overflow-x-hidden ${className}`.trim()}
//       ref={scrollerRef}
//       style={{
//         scrollBehavior: 'smooth',
//       }}
//     >
//       <div className="scroll-stack-inner pt-[20vh] px-4 sm:px-6 md:px-20 pb-[50rem] min-h-screen">
//         {children}
//         <div className="scroll-stack-end w-full h-px" />
//       </div>
//     </div>
//   );
// };

// export default ScrollStack;




import React, { ReactNode, useEffect, useRef, useCallback } from 'react';

export interface ScrollStackItemProps {
  itemClassName?: string;
  children: ReactNode;
}

export const ScrollStackItem: React.FC<ScrollStackItemProps> = ({ children, itemClassName = '' }) => (
  <div
    className={`scroll-stack-card relative w-80 h-full mx-8 p-12 rounded-[40px] shadow-[0_0_30px_rgba(0,0,0,0.1)] box-border origin-left flex-shrink-0 ${itemClassName}`.trim()}
    style={{
      backfaceVisibility: 'hidden',
      transformStyle: 'preserve-3d',
      willChange: 'transform'
    }}
  >
    {children}
  </div>
);

interface ScrollStackProps {
  className?: string;
  children?: ReactNode;
  itemDistance?: number;
  itemScale?: number;
  itemStackDistance?: number;
  stackPosition?: string;
  scaleEndPosition?: string;
  baseScale?: number;
}

const ScrollStack: React.FC<ScrollStackProps> = ({
  children,
  className = '',
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = '20%',
  scaleEndPosition = '10%',
  baseScale = 0.85,
}) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLElement[]>([]);
  const lastTransformsRef = useRef(new Map<number, any>());

  const calculateProgress = useCallback((scrollTop: number, start: number, end: number) => {
    if (scrollTop < start) return 0;
    if (scrollTop > end) return 1;
    return (scrollTop - start) / (end - start);
  }, []);

  const parsePercentage = useCallback((value: string | number, containerHeight: number) => {
    if (typeof value === 'string' && value.includes('%')) {
      return (parseFloat(value) / 100) * containerHeight;
    }
    return parseFloat(value as string);
  }, []);

  const updateCardTransforms = useCallback(() => {
    if (!cardsRef.current.length) return;

    const scroller = scrollerRef.current;
    if (!scroller) return;

    const scrollLeft = scroller.scrollLeft;
    const containerWidth = scroller.clientWidth;
    const stackPositionPx = parsePercentage(stackPosition, containerWidth);
    const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerWidth);

    const endElement = scroller.querySelector('.scroll-stack-end') as HTMLElement | null;
    const endElementLeft = endElement ? endElement.offsetLeft : 0;

    cardsRef.current.forEach((card, i) => {
      if (!card) return;

      const cardLeft = card.offsetLeft;
      const triggerStart = cardLeft - stackPositionPx - itemStackDistance * i;
      const triggerEnd = cardLeft - scaleEndPositionPx;
      const pinStart = cardLeft - stackPositionPx - itemStackDistance * i;
      const pinEnd = endElementLeft - containerWidth / 2;

      const scaleProgress = calculateProgress(scrollLeft, triggerStart, triggerEnd);
      const targetScale = baseScale + i * itemScale;
      const scale = 1 - scaleProgress * (1 - targetScale);

      let translateX = 0;
      const isPinned = scrollLeft >= pinStart && scrollLeft <= pinEnd;

      if (isPinned) {
        translateX = scrollLeft - cardLeft + stackPositionPx + itemStackDistance * i;
      } else if (scrollLeft > pinEnd) {
        translateX = pinEnd - cardLeft + stackPositionPx + itemStackDistance * i;
      }

      const newTransform = {
        translateX: Math.round(translateX * 100) / 100,
        scale: Math.round(scale * 1000) / 1000,
      };

      const lastTransform = lastTransformsRef.current.get(i);
      const hasChanged =
        !lastTransform ||
        Math.abs(lastTransform.translateX - newTransform.translateX) > 0.1 ||
        Math.abs(lastTransform.scale - newTransform.scale) > 0.001;

      if (hasChanged) {
        const transform = `translate3d(${newTransform.translateX}px, 0, 0) scale(${newTransform.scale})`;
        card.style.transform = transform;
        lastTransformsRef.current.set(i, newTransform);
      }
    });
  }, [itemScale, itemStackDistance, stackPosition, scaleEndPosition, baseScale, calculateProgress, parsePercentage]);

  const handleScroll = useCallback(() => {
    requestAnimationFrame(updateCardTransforms);
  }, [updateCardTransforms]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const cards = Array.from(scroller.querySelectorAll('.scroll-stack-card')) as HTMLElement[];
    cardsRef.current = cards;

    cards.forEach((card, i) => {
      if (i < cards.length - 1) {
        card.style.marginRight = `${itemDistance}px`;
      }
      card.style.willChange = 'transform';
      card.style.transformOrigin = 'left center';
      card.style.backfaceVisibility = 'hidden';
    });

    scroller.addEventListener('scroll', handleScroll, { passive: true });
    updateCardTransforms();

    return () => {
      scroller.removeEventListener('scroll', handleScroll);
      cardsRef.current = [];
      lastTransformsRef.current.clear();
    };
  }, [itemDistance, handleScroll, updateCardTransforms]);

  return (
    <div
      className={`relative w-full h-screen overflow-x-auto overflow-y-hidden ${className}`.trim()}
      ref={scrollerRef}
      style={{
        scrollBehavior: 'smooth',
      }}
    >
      <div className="scroll-stack-inner pl-[20vw] py-4 sm:py-6 md:py-20 pr-[50rem] min-w-max flex">
        {children}
        <div className="scroll-stack-end h-full w-px" />
      </div>
    </div>
  );
};

export default ScrollStack;