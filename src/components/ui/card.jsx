import React from 'react';

// Utilitaire de fusion des classes (remplaçant cn de @/lib/utils)
const combineClasses = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

const Card = React.forwardRef(({ className = '', children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={combineClasses(
        'rounded-xl border bg-card text-card-foreground shadow',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
Card.displayName = 'Card';

const CardHeader = React.forwardRef(({ className = '', children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={combineClasses('flex flex-col space-y-1.5 p-6', className)}
      {...props}
    >
      {children}
    </div>
  );
});
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef(({ className = '', children, ...props }, ref) => {
  return (
    <h3
      ref={ref}
      className={combineClasses('font-semibold leading-none tracking-tight', className)}
      {...props}
    >
      {children}
    </h3>
  );
});
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef(({ className = '', children, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={combineClasses('text-sm text-muted-foreground', className)}
      {...props}
    >
      {children}
    </p>
  );
});
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef(({ className = '', children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={combineClasses('p-6 pt-0', className)}
      {...props}
    >
      {children}
    </div>
  );
});
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef(({ className = '', children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={combineClasses('flex items-center p-6 pt-0', className)}
      {...props}
    >
      {children}
    </div>
  );
});
CardFooter.displayName = 'CardFooter';

// Example usage component
const CardExample = () => {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Titre de la carte</CardTitle>
        <CardDescription>Description de la carte qui explique son contenu.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Contenu principal de la carte.</p>
      </CardContent>
      <CardFooter>
        <p>Footer de la carte</p>
      </CardFooter>
    </Card>
  );
};

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardExample
};