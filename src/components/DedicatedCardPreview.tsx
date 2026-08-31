import React from 'react';
import { Heart, Sparkles } from 'lucide-react';

interface DedicatedCardPreviewProps {
  message: string;
  recipientName?: string;
  senderName?: string;
}

export const DedicatedCardPreview: React.FC<DedicatedCardPreviewProps> = ({
  message,
  recipientName,
  senderName,
}) => {
  return (
    <div className="relative mx-auto max-w-sm bg-white p-3.5 pb-6 rounded-2xl shadow-md border border-amber-200/80 rotate-[-1deg] hover:rotate-0 transition-transform duration-300">
      {/* Decorative tape at top */}
      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-20 h-5 bg-amber-200/60 backdrop-blur-xs rounded-xs border border-amber-300/60 shadow-2xs rotate-[2deg]"></div>

      {/* Polaroid photo placeholder */}
      <div className="relative aspect-4/3 w-full bg-amber-50 rounded-xl overflow-hidden border border-amber-100 flex flex-col items-center justify-center p-3 text-center">
        <div className="text-3xl mb-1">🌻🐝✨</div>
        <span className="text-[11px] font-black text-amber-950 uppercase tracking-wider">
          Un rayito de sol tejido con amor
        </span>
        <span className="text-[10px] text-amber-700/80 mt-0.5">
          Flores que duran para siempre
        </span>
      </div>

      {/* Handwritten text area */}
      <div className="mt-3.5 px-2 text-center space-y-1.5">
        {recipientName && recipientName.trim() !== '' && (
          <p className="text-xs font-bold text-amber-900 tracking-wide">
            Para: <span className="font-extrabold underline decoration-amber-300">{recipientName}</span>
          </p>
        )}

        <p className="font-handwriting text-lg sm:text-xl text-amber-950 font-bold leading-snug break-words px-1">
          {message && message.trim() !== ''
            ? `"${message}"`
            : '"Las flores naturales se marchitan, pero estas flores tejidas con amor durarán para siempre..."'}
        </p>

        {senderName && senderName.trim() !== '' && (
          <p className="text-xs font-bold text-amber-800 pt-1 flex items-center justify-center gap-1">
            <span>Con amor: {senderName}</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" />
          </p>
        )}
      </div>

      {/* Little flower stamp bottom corner */}
      <div className="absolute bottom-2 right-2 text-xs opacity-70">
        🧶💛
      </div>
    </div>
  );
};
