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
    <section
      {...rest}
      className={[
        'bg-panel-dark',
        variant === 'default' ? 'border border-border-dark divide-y divide-border-dark' : 'divide-y divide-border-dark',
        className,
      ].filter(Boolean).join(' ')}
    >
      {items.map((item) => {
        const isOpen = open.has(item.id);
        return (
          <section
            key={item.id}
            className={[
              'bg-panel-dark transition-colors',
              isOpen ? 'bg-primary/5' : '',
            ].filter(Boolean).join(' ')}
          >
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
                'w-full justify-between px-4 py-3.5 text-left normal-case tracking-normal border-0 transition-colors',
                isOpen ? 'text-primary' : 'text-slate-400',
                item.disabled ? 'opacity-40 cursor-not-allowed' : 'hover:text-slate-200 cursor-pointer',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <span
                className={[
                  'transition-colors',
                  isOpen ? 'text-primary' : 'text-slate-300',
                ].join(' ')}
              >
                {item.trigger}
              </span>
              <MaterialIcon
                name="expand_more"
                className={[
                  'text-[18px] shrink-0 transition-transform duration-200',
                  isOpen ? 'rotate-180 text-primary' : '',
                ].join(' ')}
              />
            </Button>

            {/* Panel */}
            {isOpen && (
              <section
                id={`accordion-panel-${item.id}`}
                aria-labelledby={`accordion-trigger-${item.id}`}
                className={[
                  'px-6 py-3.5 text-sm font-mono leading-relaxed border-t transition-colors',
                  isOpen ? 'border-primary/30 text-slate-300' : 'border-border-dark text-slate-400',
                ].join(' ')}
              >
                {item.content}
              </section>
            )}
          </section>
        );
      })}
    </section>
  );
};

const MemoAccordion = memo(Accordion);
MemoAccordion.displayName = 'Accordion';

export default MemoAccordion;
