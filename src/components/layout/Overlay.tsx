import { memo, type HTMLAttributes } from 'react';
import { createPortal } from 'react-dom';
import { aegisLayers } from '@/foundations/layers';

export interface OverlayProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onClick'> {
  visible: boolean;
  onClick?: () => void;
  blur?: boolean;
  zIndex?: number;
}

const Overlay = ({ visible, onClick, blur = false, zIndex = aegisLayers.overlay, className = '', style, ...rest }: OverlayProps) => {
  if (!visible) return null;
  return createPortal(
    <div
      {...rest}
      aria-hidden="true"
      onClick={onClick}
      className={[
        'fixed inset-0 bg-bg-dark/70',
        blur ? 'backdrop-blur-sm' : '',
        onClick ? 'cursor-pointer' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ zIndex, ...style }}
    />,
    document.body,
  );
};

const MemoOverlay = memo(Overlay);
MemoOverlay.displayName = 'Overlay';

export default MemoOverlay;
