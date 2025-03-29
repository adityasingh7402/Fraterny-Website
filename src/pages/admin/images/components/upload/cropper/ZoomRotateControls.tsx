
import { Minus, Plus, RotateCw } from 'lucide-react';

interface ZoomRotateControlsProps {
  zoom: number;
  setZoom: (zoom: number) => void;
  rotation: number;
  setRotation: (rotation: number) => void;
}

const ZoomRotateControls = ({ zoom, setZoom, rotation, setRotation }: ZoomRotateControlsProps) => {
  const increaseZoom = () => {
    setZoom(Math.min(zoom + 0.1, 3));
  };

  const decreaseZoom = () => {
    setZoom(Math.max(zoom - 0.1, 0.1));
  };

  const rotateImage = () => {
    setRotation((rotation + 90) % 360);
  };

  return (
    <div className="flex items-center justify-center gap-8 mt-6">
      <div className="flex flex-col items-center">
        <p className="text-xs font-medium text-gray-500 mb-2">Zoom</p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={decreaseZoom}
            className="p-2 bg-gray-100 rounded-full text-navy hover:bg-gray-200 transition-colors"
            disabled={zoom <= 0.1}
          >
            <Minus className="w-4 h-4" />
          </button>
          
          <div className="w-16 text-center">
            <span className="text-sm font-medium">{Math.round(zoom * 100)}%</span>
          </div>
          
          <button
            type="button"
            onClick={increaseZoom}
            className="p-2 bg-gray-100 rounded-full text-navy hover:bg-gray-200 transition-colors"
            disabled={zoom >= 3}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="flex flex-col items-center">
        <p className="text-xs font-medium text-gray-500 mb-2">Rotation</p>
        <button
          type="button"
          onClick={rotateImage}
          className="p-2 bg-gray-100 rounded-full text-navy hover:bg-gray-200 transition-colors"
        >
          <RotateCw className="w-4 h-4" />
          <span className="sr-only">Rotate 90°</span>
        </button>
      </div>
    </div>
  );
};

export default ZoomRotateControls;
