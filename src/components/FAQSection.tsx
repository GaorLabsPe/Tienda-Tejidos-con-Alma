import React, { useState } from 'react';
import { FAQS } from '../data/catalog';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-8">
      <div className="text-center space-y-2 mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black">
          <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
          <span>Preguntas Frecuentes</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-amber-950 tracking-tight">
          Todo lo que Necesitas Saber 🧶💡
        </h2>
      </div>

      <div className="space-y-2.5">
        {FAQS.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-amber-200 overflow-hidden shadow-2xs transition-all"
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full p-4 text-left flex items-center justify-between gap-3 text-amber-950 font-extrabold text-xs sm:text-sm hover:bg-amber-50/60"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`w-4 h-4 text-amber-700 transition-transform duration-200 shrink-0 ${
                    isOpen ? 'rotate-180 text-amber-900' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-1 text-xs text-amber-900/85 font-medium leading-relaxed border-t border-amber-100/80 bg-amber-50/30">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
