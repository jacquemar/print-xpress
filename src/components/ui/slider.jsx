import React, { useState, useRef, useEffect } from 'react';

const Slider = React.forwardRef(({ 
  className = '',
  min = 0,
  max = 100,
  step = 1,
  value = 0,
  defaultValue,
  onChange,
  disabled = false,
  ...props 
}, ref) => {
  const [currentValue, setCurrentValue] = useState(defaultValue ?? value);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    if (!isDragging && value !== undefined) {
      setCurrentValue(value);
    }
  }, [value, isDragging]);

  const getPercentage = (value) => {
    return ((value - min) / (max - min)) * 100;
  };

  const getValueFromPosition = (position) => {
    const trackRect = trackRef.current.getBoundingClientRect();
    const percentage = (position - trackRect.left) / trackRect.width;
    const rawValue = percentage * (max - min) + min;
    const steppedValue = Math.round(rawValue / step) * step;
    return Math.max(min, Math.min(max, steppedValue));
  };

  const handleMouseDown = (e) => {
    if (disabled) return;
    setIsDragging(true);
    updateValue(e.clientX);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      updateValue(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const updateValue = (clientX) => {
    const newValue = getValueFromPosition(clientX);
    setCurrentValue(newValue);
    onChange?.(newValue);
  };

  const handleKeyDown = (e) => {
    if (disabled) return;
    
    let newValue = currentValue;
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        newValue = Math.min(max, currentValue + step);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        newValue = Math.max(min, currentValue - step);
        break;
      case 'Home':
        newValue = min;
        break;
      case 'End':
        newValue = max;
        break;
      default:
        return;
    }
    
    setCurrentValue(newValue);
    onChange?.(newValue);
    e.preventDefault();
  };

  return (
    <div
      ref={ref}
      className={`relative flex w-full touch-none select-none items-center ${className}`}
      {...props}
    >
      <div
        ref={trackRef}
        className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20"
        onClick={disabled ? undefined : (e) => updateValue(e.clientX)}
      >
        <div
          className="absolute h-full bg-primary transition-all"
          style={{ width: `${getPercentage(currentValue)}%` }}
        />
      </div>
      <div
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={currentValue}
        onKeyDown={handleKeyDown}
        onMouseDown={handleMouseDown}
        className={`
          absolute h-4 w-4 rounded-full border border-primary/50 bg-background shadow
          transition-colors focus-visible:outline-none focus-visible:ring-1 
          focus-visible:ring-ring hover:border-primary
          ${disabled ? 'pointer-events-none opacity-50' : 'cursor-grab'}
          ${isDragging ? 'cursor-grabbing' : ''}
        `}
        style={{
          left: `calc(${getPercentage(currentValue)}% - 8px)`,
          touchAction: 'none'
        }}
      />
    </div>
  );
});

Slider.displayName = 'Slider';

// Example usage component
const SliderExample = () => {
  const [value, setValue] = useState(50);

  return (
    <div className="w-[200px]">
      <Slider
        min={0}
        max={100}
        step={1}
        value={value}
        onChange={setValue}
      />
      <div className="mt-2 text-sm">Value: {value}</div>
    </div>
  );
};

export { Slider, SliderExample };