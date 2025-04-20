'use client';

import { cubicBezier, motion, useAnimation } from 'motion/react'
import type { HTMLAttributes } from 'react'
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { cn } from '~/lib/utils'

export interface UndoIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface UndoIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const customEasing = cubicBezier(0.25, 0.1, 0.25, 1);

const UndoIcon = forwardRef<UndoIconHandle, UndoIconProps>(
  ({ onMouseEnter, onMouseLeave, className, size = 28, ...props }, ref) => {
    const controls = useAnimation();
    const isControlledRef = useRef(false);

    useImperativeHandle(ref, () => {
      isControlledRef.current = true;

      return {
        startAnimation: () => controls.start('animate'),
        stopAnimation: () => controls.start('normal'),
      };
    });

    const handleMouseEnter = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isControlledRef.current) {
          controls.start('animate');
        } else {
          onMouseEnter?.(e);
        }
      },
      [controls, onMouseEnter]
    );

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isControlledRef.current) {
          controls.start('normal');
        } else {
          onMouseLeave?.(e);
        }
      },
      [controls, onMouseLeave]
    );
    return (
      <div
        className={cn(
          `cursor-pointer select-none p-2 hover:bg-accent rounded-md transition-colors duration-200 flex items-center justify-center`,
          className
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <motion.path
            transition={{
              duration: 0.6,
              ease: customEasing,
            }}
            variants={{
              normal: { translateX: 0, translateY: 0, rotate: 0 },
              animate: {
                translateX: [0, 2.1, 0],
                translateY: [0, -1.4, 0],
                rotate: [0, 12, 0],
              },
            }}
            animate={controls}
            d="M3 7v6h6"
          />
          <motion.path
            transition={{
              duration: 0.6,
              ease: customEasing,
            }}
            variants={{
              normal: { pathLength: 1 },
              animate: { pathLength: [1, 0.8, 1] },
            }}
            animate={controls}
            d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"
          />
        </svg>
      </div>
    );
  }
);

UndoIcon.displayName = 'UndoIcon';

export { UndoIcon };
