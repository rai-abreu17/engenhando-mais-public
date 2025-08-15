import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-border bg-card text-card-foreground hover:bg-engenha-bright-blue hover:text-white hover:border-engenha-bright-blue",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "text-card-foreground hover:bg-engenha-bright-blue hover:text-white",
        link: "text-primary underline-offset-4 hover:underline",
        // ENGENHA+ variants
        engenha: "bg-engenha-bright-blue text-white hover:bg-engenha-blue shadow-md hover:shadow-lg",
        "engenha-outline": "border border-engenha-sky-blue text-engenha-bright-blue bg-card hover:bg-engenha-light-blue",
        "engenha-secondary": "bg-engenha-orange text-white hover:bg-engenha-dark-orange shadow-md hover:shadow-lg",
        "engenha-ghost": "text-engenha-bright-blue hover:bg-engenha-light-blue hover:text-engenha-blue",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8 text-base",
        icon: "h-10 w-10",
        xs: "h-8 px-2 text-xs",
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
