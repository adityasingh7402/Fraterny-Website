
import { ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface ZoomRotateControlsProps {
  zoom: number;
  setZoom: (zoom: number) => void;
  rotation: number;
  setRotation: (rotation: number) => void;
}

const ZoomRotateControls = ({ zoom, setZoom, rotation, setRotation }: ZoomRotateControlsProps) => {
  const increaseZoom = () => {
    const newZoom = Math.min(zoom + 0.1, 3);
    setZoom(newZoom);
  };
  
  const decreaseZoom = () => {
    const newZoom = Math.max(zoom - 0.1, 0.1);
    setZoom(newZoom);
  };
  
  const rotateImage = () => {
    const newRotation = (rotation + 90) % 360;
    setRotation(newRotation);
  };

  const handleZoomSliderChange = (value: number[]) => {
    setZoom(value[0] / 100 * 3);
  };
  
  return (
    <div className="w-full max-w-full bg-white rounded-lg border border-gray-200 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-navy">Zoom: {Math.round(zoom * 100)}%</span>
            <div className="flex space-x-1">
              <button
                type="button"
                onClick={decreaseZoom}
                className="p-1.5 bg-gray-100 rounded text-navy hover:bg-gray-200 transition-colors"
                title="Zoom out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={increaseZoom}
                className="p-1.5 bg-gray-100 rounded text-navy hover:bg-gray-200 transition-colors"
                title="Zoom in"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <Slider
            value={[zoom * 100 / 3]}
            min={10}
            max={100}
            step={1}
            onValueChange={handleZoomSliderChange}
            className="w-full"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-navy">Rotation: {rotation}°</span>
            <button
              type="button"
              onClick={rotateImage}
              className="p-1.5 bg-gray-100 rounded text-navy hover:bg-gray-200 transition-colors"
              title="Rotate 90°"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex justify-between">
            {[0, 90, 180, 270].map((deg) => (
              <button
                key={deg}
                type="button"
                onClick={() => setRotation(deg)}
                className={`px-2 py-1 text-xs rounded ${
                  rotation === deg 
                  ? 'bg-navy text-white' 
                  : 'bg-gray-100 text-navy hover:bg-gray-200'
                } transition-colors`}
              >
                {deg}°
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZoomRotateControls;
