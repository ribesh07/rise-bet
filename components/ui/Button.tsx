'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2, LucideIcon } from 'lucide-react';

type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'danger' | 'default';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  loading?: boolean;
  children?: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'btn-gold',
  outline: 'btn-outline',
  ghost: 'hover:bg-white/5 rounded-lg px-3 py-1.5 text-gray-300 hover:text-white transition-colors',
  danger: 'bg-danger hover:bg-danger/80 text-white rounded-lg px-4 py-2 font-semibold transition-colors disabled:opacity-50',
  default: 'bg-card hover:bg-card/80 border border-border text-white rounded-lg px-4 py-2 font-medium transition-colors disabled:opacity-50',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'py-1 text-xs px-3',
  md: '',
  lg: 'px-6 py-3 text-base',
};

export function Button({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  leftIcon,
  rightIcon,
  loading,
  disabled,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={twMerge(
        clsx(
          variantClasses[variant],
          sizeClasses[size],
          'inline-flex items-center justify-center gap-2 disabled:cursor-not-allowed',
          className
        )
      )}
      {...rest}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : leftIcon ? (
        <>{leftIcon}</>
      ) : null}
      {children}
      {rightIcon && <>{rightIcon}</>}
    </button>
  );
}

export default Button;
