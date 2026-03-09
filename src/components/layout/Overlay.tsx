import { memo } from 'react';
import { createPortal } from 'react-dom';

export interface OverlayProps {
  visible: boolean;
  onClick?: () => void;
  blur?: boolean;
  zIndex?: number;
}

const Overlay = ({ visible, onClick, blur = false, zIndex = 40 }: OverlayProps) => {
  if (!visible) return null;
  return createPortal(
    <div
      aria-hidden="true"
      onClick={onClick}
      className={[
        'fixed inset-0 bg-bg-dark/70',
        blur ? 'backdrop-blur-sm' : '',
        onClick ? 'cursor-pointer' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ zIndex }}
    />,
    document.body,
  );
};

export default memo(Overlay);
