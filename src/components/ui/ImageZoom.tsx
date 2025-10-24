import React, { useState, useRef, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw, Download, Eye } from 'lucide-react';

interface ImageZoomProps {
  src: string;
  alt: string;
  className?: string;
  showViewIcon?: boolean;
  children?: React.ReactNode;
}

const ImageZoom: React.FC<ImageZoomProps> = ({ 
  src, 
  alt, 
  className = '', 
  showViewIcon = true,
  children 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset zoom and position when modal opens
  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
      setRotation(0);
    }
  }, [isOpen]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          setIsOpen(false);
          break;
        case '+':
        case '=':
          e.preventDefault();
          handleZoomIn();
          break;
        case '-':
          e.preventDefault();
          handleZoomOut();
          break;
        case '0':
          e.preventDefault();
          handleReset();
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          handleRotate();
          break;
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, scale]);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev * 1.2, 5));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev / 1.2, 0.1));
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setRotation(0);
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = src;
    link.download = alt || 'image';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === imageRef.current) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale(prev => Math.max(0.1, Math.min(5, prev * delta)));
  };

  return (
    <>
      {/* Trigger Image */}
      <div 
        className={`relative inline-block group cursor-pointer ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsOpen(true)}
      >
        {children || (
          <img 
            src={src} 
            alt={alt} 
            className="w-full h-full object-cover transition-opacity duration-200 group-hover:opacity-90"
          />
        )}
        
        {/* Hover Overlay with View Icon */}
        {showViewIcon && isHovered && (
          <div className={`absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center transition-opacity duration-200 ${className.includes('rounded-full') ? 'rounded-full' : ''}`}>
            <div className="bg-white bg-opacity-90 rounded-full p-3 transform transition-transform duration-200 hover:scale-110">
              <Eye className="h-6 w-6 text-gray-700" />
            </div>
          </div>
        )}
      </div>

      {/* Zoom Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] bg-black bg-opacity-95 flex items-center justify-center">
          {/* Controls */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
            <div className="text-white text-sm">
              {alt}
            </div>
            <div className="flex items-center gap-2">
              {/* Zoom Controls */}
              <button
                onClick={handleZoomOut}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-lg transition-colors"
                title="Zoom Out (-)"
              >
                <ZoomOut className="h-5 w-5" />
              </button>
              <button
                onClick={handleZoomIn}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-lg transition-colors"
                title="Zoom In (+)"
              >
                <ZoomIn className="h-5 w-5" />
              </button>
              <button
                onClick={handleRotate}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-lg transition-colors"
                title="Rotate (R)"
              >
                <RotateCw className="h-5 w-5" />
              </button>
              <button
                onClick={handleDownload}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-lg transition-colors"
                title="Download"
              >
                <Download className="h-5 w-5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-lg transition-colors"
                title="Close (Esc)"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Image Container */}
          <div 
            ref={containerRef}
            className="relative w-full h-full flex items-center justify-center cursor-move"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
          >
            <img
              ref={imageRef}
              src={src}
              alt={alt}
              className="max-w-none max-h-none select-none"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
                cursor: isDragging ? 'grabbing' : 'grab',
                transition: isDragging ? 'none' : 'transform 0.2s ease-out'
              }}
              draggable={false}
            />
          </div>

          {/* Instructions */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black bg-opacity-50 px-4 py-2 rounded-lg">
            <div className="text-center">
              <p>Drag to move • Scroll to zoom • + - keys to zoom • R to rotate • 0 to reset • Esc to close</p>
            </div>
          </div>

          {/* Zoom Level Indicator */}
          <div className="absolute bottom-4 right-4 text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded-lg">
            {Math.round(scale * 100)}%
          </div>
        </div>
      )}
    </>
  );
};

export default ImageZoom;