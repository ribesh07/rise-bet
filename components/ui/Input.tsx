'use client';

import { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

interface InputBaseProps {
  label?: string;
  error?: string;
  className?: string;
  wrapperClassName?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & InputBaseProps;
type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & InputBaseProps & { textarea?: boolean };

export function Input({ label, error, className, wrapperClassName, leftIcon, rightIcon, ...rest }: InputProps) {
  return (
    <div className={clsx('w-full', wrapperClassName)}>
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none z-10">
            {leftIcon}
          </div>
        )}
        <input
          className={clsx(
            'w-full bg-background/50 border rounded-lg py-2.5 text-white placeholder-muted focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all',
            leftIcon ? 'pl-11' : 'px-4',
            rightIcon ? 'pr-11' : 'px-4',
            error ? 'border-danger' : 'border-border',
            className
          )}
          {...rest}
        />
        {rightIcon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none z-10">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}

export function Textarea({ label, error, className, wrapperClassName, ...rest }: TextareaProps) {
  return (
    <div className={clsx('w-full', wrapperClassName)}>
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>
      )}
      <textarea
        className={clsx(
          'w-full bg-background/50 border rounded-lg px-4 py-2.5 text-white placeholder-muted focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all resize-y min-h-[100px]',
          error ? 'border-danger' : 'border-border',
          className
        )}
        {...rest}
      />
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}

export default Input;
