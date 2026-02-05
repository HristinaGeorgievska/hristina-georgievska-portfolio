import { useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useSwipe } from "@/hooks/use-swipe";

interface ImageDetails {
  client?: string;
  name?: string;
  photographer?: string;
}

interface LightboxProps {
  isOpen: boolean;
  imageUrl: string;
  imageDetails?: ImageDetails;
  currentIndex: number;
  totalImages: number;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

const Lightbox = ({
  isOpen,
  imageUrl,
  imageDetails,
  currentIndex,
  totalImages,
  onClose,
  onPrevious,
  onNext,
}: LightboxProps) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrevious();
      if (e.key === "ArrowRight") onNext();
    },
    [onClose, onPrevious, onNext]
  );

  const swipeHandlers = useSwipe({
    onSwipeLeft: onNext,
    onSwipeRight: onPrevious,
    onSwipeDown: onClose,
  });

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const hasDetails = imageDetails?.client || imageDetails?.name || imageDetails?.photographer;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/90 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      {...swipeHandlers}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-2 text-background/80 hover:text-background transition-colors z-10"
        aria-label="Close lightbox"
      >
        <X size={28} />
      </button>

      {/* Previous button - hidden on mobile */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPrevious();
        }}
        className="hidden md:block absolute left-8 p-2 text-background/80 hover:text-background transition-colors z-10"
        aria-label="Previous image"
      >
        <ChevronLeft size={40} />
      </button>

      {/* Image container with details */}
      <div
        className="flex flex-col items-center max-w-[90vw] max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt={imageDetails?.name || "Gallery image"}
          className="max-w-full max-h-[75vh] md:max-h-[80vh] object-contain rounded-lg shadow-2xl"
        />

        {/* Project details overlay */}
        {hasDetails && (
          <div className="mt-4 text-center text-background animate-in fade-in slide-in-from-bottom-4 duration-300">
            {imageDetails?.client && (
              <p className="text-xs font-semibold uppercase tracking-widest opacity-70 mb-1">
                {imageDetails.client}
              </p>
            )}
            {imageDetails?.name && (
              <h3 className="text-xl md:text-2xl font-bold mb-1">
                {imageDetails.name}
              </h3>
            )}
            {imageDetails?.photographer && (
              <p className="text-sm opacity-60">
                Foto: {imageDetails.photographer}
              </p>
            )}
          </div>
        )}

      </div>

      {/* Next button - hidden on mobile */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        className="hidden md:block absolute right-8 p-2 text-background/80 hover:text-background transition-colors z-10"
        aria-label="Next image"
      >
        <ChevronRight size={40} />
      </button>
    </div>
  );
};

export default Lightbox;
