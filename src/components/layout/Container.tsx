import { memo, type ElementType, type ReactNode, type HTMLAttributes } from 'react';

export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ContainerProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  size?: ContainerSize;
  children: ReactNode;
}

const SIZE: Record<ContainerSize, string> = {
  sm:   'max-w-sm',
  md:   'max-w-2xl',
  lg:   'max-w-4xl',
  xl:   'max-w-6xl',
  full: 'max-w-full',
};

const Container = ({ as: Tag = 'div', size = 'xl', children, className = '', ...rest }: ContainerProps) => (
  <Tag className={`w-full mx-auto px-4 ${SIZE[size]} ${className}`} {...rest}>
    {children}
  </Tag>
);

export default memo(Container);
