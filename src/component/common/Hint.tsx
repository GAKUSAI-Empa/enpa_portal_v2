'use client';
import { cn } from '@/lib/utils';
import { IconQuestionMark } from '@tabler/icons-react';
import React, { useState, useRef, useEffect } from 'react';

interface HintProps {
  message: string;
  className?: string;
}
export default function Hint({ message, className = '' }: HintProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Đóng khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={ref}>
      {/* Nút bấm */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          'p-1.5 rounded-full bg-primary hover:bg-primary-hover text-white disabled:bg-primary-disabled disabled:cursor-not-allowed',
          className,
        )}
      >
        <IconQuestionMark color="#FFFFFF" strokeWidth={2.5} size={18} />
      </button>

      {open && (
        <div className="absolute transition-opacity duration-200 top-full mt-2 left-1/2 -translate-x-1/2 bg-amber-50 text-amber-800 text-sm rounded-lg shadow-lg z-10 border border-amber-200 px-3 py-2 w-72">
          {message.split(/\\n|\n/).map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      )}
    </div>
  );
}
