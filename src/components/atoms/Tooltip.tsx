import { memo, type ReactNode, useState, type HTMLAttributes } from 'react';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps extends HTMLAttributes<HTMLSpanElement> {
  content: string;
  placement?: TooltipPlacement;
  children: ReactNode;
}

const PLACEMENT_CLASSES: Record<TooltipPlacement, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

const ARROW_CLASSES: Record<TooltipPlacement, string> = {
  top: 'top-full left-1/2 -translate-x-1/2 border-t-panel-dark border-x-transparent border-b-transparent border-4 border-solid',
  bottom:
    'bottom-full left-1/2 -translate-x-1/2 border-b-panel-dark border-x-transparent border-t-transparent border-4 border-solid',
  left: 'left-full top-1/2 -translate-y-1/2 border-l-panel-dark border-y-transparent border-r-transparent border-4 border-solid',
  right:
    'right-full top-1/2 -translate-y-1/2 border-r-panel-dark border-y-transparent border-l-transparent border-4 border-solid',
};

const Tooltip = ({ content, placement = 'top', children, className = '', ...rest }: TooltipProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <span
      {...rest}
      className={['relative inline-flex', className].filter(Boolean).join(' ')}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && (
        <span
          role="tooltip"
          className={`absolute z-50 whitespace-nowrap ${PLACEMENT_CLASSES[placement]}`}
        >
          <span className="block bg-panel-dark border border-border-dark px-2 py-1 text-[10px] font-mono text-slate-300 tracking-wide">
            {content}
          </span>
          <span className={`absolute ${ARROW_CLASSES[placement]}`} />
        </span>
      )}
    </span>
  );
};

export default memo(Tooltip);
