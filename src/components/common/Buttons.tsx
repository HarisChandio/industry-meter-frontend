import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "destructive"
  | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonsProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  disabled?: boolean;
}

export const Buttons = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
}: ButtonsProps) => {
  // Variant styles
  const variantStyles = {
    primary: "bg-(--color-bg-accent) text-(--color-text-secondary) hover:bg-(--color-bg-accent-hover) border border-(--color-border-secondary)",
    secondary:
      "bg-color-bg-secondary text-color-text-secondary hover:opacity-90",
    outline:
      "bg-transparent border border-color-bg-green text-color-bg-green hover:bg-color-bg-green hover:text-color-text-primary",
    destructive: "bg-destructive text-white hover:opacity-90",
    ghost: "bg-transparent text-color-text-primary hover:bg-color-bg-secondary",
  };

  // Size styles
  const sizeStyles = {
    sm: "px-2 py-1 text-sm",
    md: "px-3 py-2",
    lg: "px-4 py-3 text-lg",
  };

  return (
    <button
      className={cn(
        "rounded-md transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
