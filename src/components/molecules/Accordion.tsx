import { memo, useState, type ReactNode, type HTMLAttributes } from 'react';
import Button from '@/components/atoms/Button';
import MaterialIcon from '@/components/atoms/MaterialIcon';

export type AccordionVariant = 'default' | 'flush';

export interface AccordionItemData {
  id: string;
  trigger: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

export interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  items: AccordionItemData[];
  variant?: AccordionVariant;
  multiple?: boolean;       // allow multiple open at once
  defaultOpen?: string[];
}

const Accordion = ({ items, variant = 'default', multiple = false, defaultOpen = [], className = '', ...rest }: AccordionProps) => {
  const [open, setOpen] = useState<Set<string>>(new Set(defaultOpen));

  const toggle = (id: string) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (!multiple) next.clear();
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div {...rest} className={[variant === 'default' ? 'border border-border-dark divide-y divide-border-dark' : 'divide-y divide-border-dark', className].filter(Boolean).join(' ')}>
      {items.map((item) => {
        const isOpen = open.has(item.id);
        return (
          <div key={item.id} className="bg-panel-dark">
            {/* Trigger */}
            <Button
              disabled={item.disabled}
              aria-expanded={isOpen}
              aria-controls={`accordion-panel-${item.id}`}
              id={`accordion-trigger-${item.id}`}
              onClick={() => toggle(item.id)}
              variant="ghost"
              size="lg"
              className={[
                'w-full justify-between px-4 py-3.5 text-left normal-case tracking-normal border-0',
                isOpen ? 'text-primary' : 'text-slate-400',
                item.disabled ? 'opacity-40 cursor-not-allowed' : 'hover:text-slate-200 cursor-pointer',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <span>{item.trigger}</span>
              <MaterialIcon
                name="expand_more"
                className={`text-[18px] shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              />
            </Button>

            {/* Panel */}
            {isOpen && (
              <div
                id={`accordion-panel-${item.id}`}
                role="region"
                aria-labelledby={`accordion-trigger-${item.id}`}
                className="px-4 pb-4 text-sm text-slate-400 font-mono leading-relaxed border-t border-border-dark pt-3"
              >
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const MemoAccordion = memo(Accordion);
MemoAccordion.displayName = 'Accordion';

export default MemoAccordion;
