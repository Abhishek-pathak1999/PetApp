import React, { useState, useRef, useEffect } from 'react';
import { IonIcon } from '@ionic/react';
import { home, logoAmazon } from 'ionicons/icons';

const DragButton = ({saveSelectProduct} : any) => {
  const [isClickable, setIsClickable] = useState(false); // Controls button active state
  const [position, setPosition] = useState(0); // Tracks the icon's position
  const [isDragging, setIsDragging] = useState(false); // Track dragging state
  const [autoSlide, setAutoSlide] = useState(false); // Controls auto-slide animation
  const containerRef = useRef<HTMLDivElement>(null); // Reference to the container
  const buttonWidth = 40; // Width of the button (adjust as per your styles)

  // Calculate position based on pointer (mouse/touch)
  const updatePosition = (clientX: number) => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const newPosition = clientX - containerRect.left;

    // Ensure the icon stays within the container bounds
    if (newPosition >= 0 && newPosition <= containerRect.width - buttonWidth) {
      setPosition(newPosition);
    }
  };

  // Mouse events
  const handleMouseDown = () => {
    setIsDragging(true);
    setAutoSlide(false); // Disable auto-slide during drag
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updatePosition(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);

    const threshold = (containerRef.current!.offsetWidth - buttonWidth) * 0.5;

    // Check if the icon has been dragged to the right (50% of container width)
    if (position > threshold) {
      setIsClickable(true); // Enable the button
      setAutoSlide(true); // Enable auto-slide to the right
      setPosition(containerRef.current!.offsetWidth - buttonWidth); // Slide to the right
    } else {
      setPosition(0); // Reset the icon position if drag was incomplete
    }
  };

  // Touch events (for mobile)
  const handleTouchStart = () => {
    setIsDragging(true);
    setAutoSlide(false); // Disable auto-slide during drag
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updatePosition(e.touches[0].clientX); // Get the touch position
  };

  const handleTouchEnd = () => {
    setIsDragging(false);

    const threshold = (containerRef.current!.offsetWidth - buttonWidth) * 0.5;

    // Check if the icon has been dragged to the right (50% of container width)
    if (position > threshold) {
      setIsClickable(true); // Enable the button
      setAutoSlide(true); // Enable auto-slide to the right
      setPosition(containerRef.current!.offsetWidth - buttonWidth); // Slide to the right
    } else {
      setPosition(0); // Reset the icon position if drag was incomplete
    }
  };

  // Effect to handle when the button auto-slides to the rightmost position
  useEffect(() => {
    if (autoSlide && containerRef.current?.offsetWidth && position === containerRef.current?.offsetWidth - buttonWidth) {
      handleButtonClick(); // Call the button click handler when auto-slide completes
    }
  }, [autoSlide, position]);

  // Click handling function
  const handleButtonClick = () => {
    if (isClickable) {
      console.log('Button clicked');
      saveSelectProduct()
      setTimeout(() => {
        setPosition(0);
        setIsClickable(false);
      }, 1000);
      
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-[150px] h-9 p-1 rounded-full ${
        isClickable ? 'bg-[green]' : 'bg-[#C3FE94]'
      }`}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp} // Reset drag if mouse leaves container
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className={`absolute top-0 left-0 h-full w-10 bg-[#3d2f2f] rounded-full flex justify-center items-center shadow-md cursor-pointer ${
          autoSlide ? 'transition-transform duration-300 ease-out' : ''
        }`}
        style={{ transform: `translateX(${position}px)` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <IonIcon icon={logoAmazon} className="text-white h-5 w-5" />
      </div>
    </div>
  );
};

export default DragButton;
