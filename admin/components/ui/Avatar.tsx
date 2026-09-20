'use client';

import clsx from 'clsx';
import { User } from 'lucide-react';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type RingColor = 'gold' | 'success' | 'danger' | 'info' | 'none';

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  fallback?: string;
  size?: AvatarSize;
  ringColor?: RingColor;
  className?: string;
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-base',
  xl: 'w-16 h-16 text-lg',
  '2xl': 'w-20 h-20 text-xl',
};

const ringClasses: Record<RingColor, string> = {
  gold: 'ring-2 ring-gold/40',
  success: 'ring-2 ring-success/40',
  danger: 'ring-2 ring-danger/40',
  info: 'ring-2 ring-info/40',
  none: '',
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Avatar({
  src,
  alt = '',
  name = '',
  fallback,
  size = 'md',
  ringColor = 'gold',
  className,
}: AvatarProps) {
  const displayName = name || fallback || '';
  const iconSizeClass =
    size === 'sm' ? 'w-4 h-4' :
    size === 'md' ? 'w-5 h-5' :
    size === 'lg' ? 'w-7 h-7' :
    size === 'xl' ? 'w-8 h-8' :
    'w-10 h-10';
  return (
    <div
      className={clsx(
        'rounded-full overflow-hidden bg-card flex items-center justify-center text-gray-300 font-semibold shrink-0',
        sizeClasses[size],
        ringClasses[ringColor],
        className
      )}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : displayName ? (
        <span>{getInitials(displayName)}</span>
      ) : (
        <User className={iconSizeClass} />
      )}
    </div>
  );
}

export default Avatar;
