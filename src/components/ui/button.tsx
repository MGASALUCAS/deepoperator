import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 transition-smooth font-display tracking-tight",
  {
    variants: {
      variant: {
        default: "bg-coral text-white hover:bg-coral/90 shadow-medium hover:shadow-strong rounded-xl hover-lift",
        hero: "bg-gradient-hero text-white shadow-magical hover:shadow-strong rounded-2xl px-8 py-4 text-base font-semibold hover-scale",
        premium: "bg-gradient-premium text-white shadow-magical hover:shadow-strong rounded-xl hover-lift border border-gold/20",
        trust: "bg-gradient-trust text-white shadow-medium hover:shadow-strong rounded-xl hover-lift",
        glass: "glass text-foreground hover:bg-gradient-glass rounded-xl hover-lift",
        destructive: "bg-error text-white hover:bg-error/90 shadow-medium rounded-xl",
        outline: "border border-coral/30 bg-transparent text-coral hover:bg-coral hover:text-white rounded-xl hover-lift",
        secondary: "bg-mint text-white hover:bg-mint/90 shadow-medium hover:shadow-strong rounded-xl hover-lift",
        ghost: "hover:bg-coral/10 hover:text-coral rounded-xl transition-smooth",
        link: "text-coral underline-offset-4 hover:underline font-normal",
      },
      size: {
        default: "h-11 px-6 py-3",
        sm: "h-9 rounded-lg px-4 text-sm",
        lg: "h-14 rounded-2xl px-10 text-lg",
        xl: "h-16 rounded-2xl px-12 text-xl font-semibold",
        icon: "h-11 w-11 rounded-xl",
        "icon-sm": "h-9 w-9 rounded-lg",
        "icon-lg": "h-14 w-14 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
