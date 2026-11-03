'use client';

import { useState, useRef, MouseEvent, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X, ZoomIn } from 'lucide-react';

interface ProductImageZoomProps {
  images: Array<{ url: string; alt?: string }> | string[];
  productName: string;
  discountBadge?: string | null;
}

export default function ProductImageZoom({
  images,
  productName,
  discountBadge,
}: ProductImageZoomProps) {
  // Normalize image list
  const imageList: string[] = Array.isArray(images) && images.length > 0
    ? images.map((img) => (typeof img === 'string' ? img : img.url))
    : ['/products/notebook.jpg'];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
  const [zoomPercent, setZoomPercent] = useState({ x: 50, y: 50 });
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const activeImage = imageList[activeIndex] || imageList[0];

  // Lens size in pixels
  const LENS_WIDTH = 140;
  const LENS_HEIGHT = 140;

  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    // Calculate clamped lens position
    let lensX = clientX - LENS_WIDTH / 2;
    let lensY = clientY - LENS_HEIGHT / 2;

    const maxLensX = rect.width - LENS_WIDTH;
    const maxLensY = rect.height - LENS_HEIGHT;

    lensX = Math.max(0, Math.min(lensX, maxLensX));
    lensY = Math.max(0, Math.min(lensY, maxLensY));

    // Calculate percentages for zoomed background position
    const percentX = maxLensX > 0 ? (lensX / maxLensX) * 100 : 50;
    const percentY = maxLensY > 0 ? (lensY / maxLensY) * 100 : 50;

    setLensPos({ x: lensX, y: lensY });
    setZoomPercent({
      x: Math.max(0, Math.min(100, percentX)),
      y: Math.max(0, Math.min(100, percentY)),
    });
  }, []);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const handlePrevImage = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : imageList.length - 1));
  };

  const handleNextImage = () => {
    setActiveIndex((prev) => (prev < imageList.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="relative flex flex-col gap-3">
      {/* Main Image Outer Anchor (Allows floating zoom pane to escape without being clipped) */}
      <div className="relative">
        {/* Main Image Container (Clips image and lens) */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={() => setIsLightboxOpen(true)}
          className="relative aspect-square w-full bg-white rounded-none border border-gray-200 overflow-hidden cursor-crosshair group flex items-center justify-center shadow-sm select-none"
        >
          {/* Discount Badge */}
          {discountBadge && (
            <div className="absolute top-3 left-3 z-20 bg-[#0066FF] text-white text-[11px] font-black px-2.5 py-1 rounded-none shadow-md tracking-wider">
              {discountBadge}
            </div>
          )}

          {/* Zoom Hint / Fullscreen trigger */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsLightboxOpen(true);
            }}
            className="absolute top-3 right-3 z-20 w-8 h-8 rounded-none bg-white/90 hover:bg-white text-gray-700 hover:text-[#0066FF] shadow-md flex items-center justify-center transition-all opacity-80 hover:opacity-100 cursor-pointer"
            title="Click to view full image"
          >
            <Maximize2 size={15} />
          </button>

          {/* Main Product Image */}
          <img
            src={activeImage}
            alt={productName}
            className="w-full h-full object-contain p-2"
          />

          {/* Moving Magnifier Lens Box */}
          {isHovering && (
            <div
              className="absolute pointer-events-none border-2 border-[#0066FF] bg-[#0066FF]/20 backdrop-blur-[1px] shadow-sm z-30 transition-none"
              style={{
                width: `${LENS_WIDTH}px`,
                height: `${LENS_HEIGHT}px`,
                left: `${lensPos.x}px`,
                top: `${lensPos.y}px`,
              }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-none bg-[#0066FF]" />
            </div>
          )}
        </div>

        {/* Floating Zoom Window (Daraz style: appears to the right on desktop, overlays column with z-[9999]) */}
        {isHovering && (
          <div
            className="hidden lg:block absolute left-[102%] top-0 w-[540px] h-[540px] z-[9999] bg-white border-2 border-gray-300 rounded-none shadow-2xl overflow-hidden pointer-events-none"
            style={{
              backgroundImage: `url(${activeImage})`,
              backgroundPosition: `${zoomPercent.x}% ${zoomPercent.y}%`,
              backgroundSize: '320% 320%',
              backgroundRepeat: 'no-repeat',
            }}
          >
            {/* Visual zoom guide indicator */}
            <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1.5 rounded-none flex items-center gap-1.5 shadow-lg border border-white/20">
              <ZoomIn size={14} className="text-[#0066FF]" />
              <span>3.2x HD Macro Optical Zoom</span>
            </div>
          </div>
        )}
      </div>

      {/* Thumbnails Row (Daraz style carousel below main image) */}
      <div className="relative flex items-center gap-2 pt-1">
        {imageList.length > 4 && (
          <button
            type="button"
            onClick={handlePrevImage}
            className="w-7 h-14 rounded-none bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center shrink-0 transition-colors cursor-pointer"
            aria-label="Previous image"
          >
            <ChevronLeft size={16} />
          </button>
        )}

        <div className="flex items-center gap-2.5 overflow-x-auto py-1 scrollbar-none flex-1">
          {imageList.map((imgUrl, index) => {
            const isSelected = index === activeIndex;
            return (
              <button
                key={index}
                type="button"
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => setActiveIndex(index)}
                className={`relative w-16 h-16 sm:w-18 sm:h-18 rounded-none overflow-hidden border-2 bg-white p-1 transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'border-[#0066FF] shadow-md ring-2 ring-[#0066FF]/20 scale-102'
                    : 'border-gray-200 hover:border-gray-400 opacity-75 hover:opacity-100'
                }`}
              >
                <img
                  src={imgUrl}
                  alt={`Product view ${index + 1}`}
                  className="w-full h-full object-contain"
                />
              </button>
            );
          })}
        </div>

        {imageList.length > 4 && (
          <button
            type="button"
            onClick={handleNextImage}
            className="w-7 h-14 rounded-none bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center shrink-0 transition-colors cursor-pointer"
            aria-label="Next image"
          >
            <ChevronRight size={16} />
          </button>
        )}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-white rounded-none overflow-hidden shadow-2xl p-4 flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-none bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="w-full h-[65vh] flex items-center justify-center p-4">
              <img
                src={activeImage}
                alt={productName}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* Lightbox Thumbnails */}
            <div className="flex items-center gap-2 overflow-x-auto p-2 border-t border-gray-100">
              {imageList.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  className={`w-14 h-14 rounded-none border-2 p-1 bg-white cursor-pointer transition-all ${
                    activeIndex === i
                      ? 'border-[#0066FF] ring-2 ring-[#0066FF]/20'
                      : 'border-gray-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
