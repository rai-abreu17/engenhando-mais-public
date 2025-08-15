import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        gradient: "bg-gradient-to-r from-primary via-primary to-secondary text-primary-foreground shadow-lg hover:shadow-xl",
        glow: "bg-primary text-primary-foreground shadow-lg hover:shadow-primary/50 shadow-primary/25",
        animated: "bg-gradient-to-r from-primary to-secondary text-primary-foreground relative overflow-hidden"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        xl: "h-12 rounded-lg px-10 text-base",
        icon: "h-9 w-9",
      },
      animation: {
        none: "",
        pulse: "animate-pulse",
        bounce: "animate-bounce",
        wiggle: "hover:animate-wiggle",
        glow: "hover:animate-glow"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "none"
    },
  }
)

export interface ButtonEnhancedProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  success?: boolean
  sparkle?: boolean
  ripple?: boolean
  children: React.ReactNode
}

const ButtonEnhanced = React.forwardRef<HTMLButtonElement, ButtonEnhancedProps>(
  ({ 
    className, 
    variant, 
    size, 
    animation,
    asChild = false, 
    loading = false,
    success = false,
    sparkle = false,
    ripple = true,
    children,
    onClick,
    ...props 
  }, ref) => {
    const [isClicked, setIsClicked] = React.useState(false)
    const [ripples, setRipples] = React.useState<Array<{ x: number; y: number; id: number }>>([])
    const Comp = asChild ? Slot : "button"

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (ripple && !loading) {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const newRipple = { x, y, id: Date.now() }
        
        setRipples(prev => [...prev, newRipple])
        setTimeout(() => {
          setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id))
        }, 600)
      }

      setIsClicked(true)
      setTimeout(() => setIsClicked(false), 150)
      
      if (onClick && !loading) {
        onClick(e)
      }
    }

    return (
      <motion.div
        whileHover={{ scale: loading ? 1 : 1.02 }}
        whileTap={{ scale: loading ? 1 : 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Comp
          className={cn(buttonVariants({ variant, size, animation, className }))}
          ref={ref}
          onClick={handleClick}
          disabled={loading}
          {...props}
        >
          {/* Background glow effect */}
          {(variant === "glow" || variant === "gradient") && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          )}

          {/* Animated background for animated variant */}
          {variant === "animated" && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/80 via-secondary/80 to-primary/80"
              animate={{ x: ["-100%", "100%"] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          )}

          {/* Ripple effects */}
          <AnimatePresence>
            {ripples.map((ripple) => (
              <motion.span
                key={ripple.id}
                className="absolute bg-white/30 rounded-full pointer-events-none"
                style={{
                  left: ripple.x - 10,
                  top: ripple.y - 10,
                }}
                initial={{ width: 20, height: 20, opacity: 1 }}
                animate={{ width: 200, height: 200, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            ))}
          </AnimatePresence>

          {/* Success state */}
          {success && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute inset-0 bg-green-500 rounded-md flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 }}
                className="text-white"
              >
                ✓
              </motion.div>
            </motion.div>
          )}

          {/* Loading state */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-background/80 rounded-md flex items-center justify-center"
            >
              <Loader2 className="h-4 w-4 animate-spin" />
            </motion.div>
          )}

          {/* Sparkle effect */}
          {sparkle && !loading && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            >
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${20 + i * 30}%`,
                    top: `${20 + i * 20}%`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    rotate: [0, 180, 360],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                >
                  <Sparkles className="h-3 w-3 text-yellow-300" />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Content */}
          <motion.div
            className="relative z-10 flex items-center gap-2"
            animate={{ 
              scale: isClicked ? 0.95 : 1,
              filter: loading ? "blur(1px)" : "blur(0px)"
            }}
            transition={{ duration: 0.1 }}
          >
            {children}
          </motion.div>
        </Comp>
      </motion.div>
    )
  }
)

ButtonEnhanced.displayName = "ButtonEnhanced"

export { ButtonEnhanced, buttonVariants }