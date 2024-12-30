import React from 'react';

const labelStyles = {
  base: 'text-sm font-medium leading-none',
  disabled: 'cursor-not-allowed opacity-70'
};

const Label = React.forwardRef(({ className = '', disabled, children, ...props }, ref) => {
  const combinedClassName = `${labelStyles.base} ${disabled ? labelStyles.disabled : ''} ${className}`.trim();

  return (
    <label
      ref={ref}
      className={combinedClassName}
      {...props}
    >
      {children}
    </label>
  );
});

Label.displayName = 'Label';

export { Label };