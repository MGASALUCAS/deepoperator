import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
}

const ResponsiveContainer = ({ 
  children, 
  className,
  maxWidth = "full",
  padding = "md"
}: ResponsiveContainerProps) => {
  const maxWidthClasses = {
    sm: "max-w-2xl",
    md: "max-w-4xl", 
    lg: "max-w-6xl",
    xl: "max-w-7xl",
    "2xl": "max-w-8xl",
    full: "max-w-none"
  };

  const paddingClasses = {
    none: "",
    sm: "px-4 sm:px-6",
    md: "px-4 sm:px-6 lg:px-8",
    lg: "px-6 sm:px-8 lg:px-12",
    xl: "px-8 sm:px-12 lg:px-16"
  };

  return (
    <div className={cn(
      "mx-auto w-full",
      maxWidthClasses[maxWidth],
      paddingClasses[padding],
      className
    )}>
      {children}
    </div>
  );
};

export default ResponsiveContainer;