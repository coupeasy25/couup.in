import { useRef, useState, MouseEvent } from 'react';

export function useDraggableScroll() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setHasDragged(false);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    
    // Only count as a drag if moved more than 5 pixels
    if (Math.abs(x - startX) > 5) {
      setHasDragged(true);
    }
    
    const walk = (x - startX) * 2; // scroll speed
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  // Function to prevent accidental clicks when dragging
  const handleDragClick = (e: MouseEvent<HTMLDivElement>) => {
    if (hasDragged) {
      e.stopPropagation();
      e.preventDefault();
      setHasDragged(false);
    }
  };

  // Prevent native browser image drag
  const handleDragStart = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return {
    scrollRef,
    events: {
      onMouseDown: handleMouseDown,
      onMouseLeave: handleMouseLeave,
      onMouseUp: handleMouseUp,
      onMouseMove: handleMouseMove,
      onClickCapture: handleDragClick,
      onDragStart: handleDragStart,
    },
    isDragging,
  };
}
