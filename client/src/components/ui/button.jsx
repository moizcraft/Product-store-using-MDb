import React from "react";
import { motion } from 'framer-motion';
import { cn } from "../../lib/utils";

const Button = React.forwardRef(({ className, variant = "primary", size = "default", ...props }, ref) => {
  const variants = {
    primary: "bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-opacity-90 shadow-md",
    secondary: "bg-[var(--color-neutral-200)] text-[var(--color-neutral-900)] hover:bg-opacity-80",
    outline: "border border-[var(--color-neutral-200)] bg-transparent hover:bg-[var(--color-neutral-100)] text-[var(--color-neutral-900)]",
    ghost: "hover:bg-[var(--color-neutral-100)] text-[var(--color-neutral-900)]",
    link: "text-[var(--color-primary)] underline-offset-4 hover:underline",
    accent: "bg-[var(--color-accent)] text-[var(--color-accent-foreground)] hover:bg-opacity-90 shadow-md",
  };

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { Button };
