"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface AccordionItemProps {
  question: string;
  answer: string;
}

export function AccordionItem({ question, answer }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-border-default">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="font-sans text-base text-text-default font-medium pr-4">
          {question}
        </span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-text-muted transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="pb-5">
          <p className="text-sm text-text-muted font-sans leading-relaxed">
            {answer}
          </p>
        </div>
      )}
    </div>
  );
}
