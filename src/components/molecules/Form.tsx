import { memo, type FormHTMLAttributes, type ReactNode } from 'react';

// ─── FormSection ─────────────────────────────────────────────────────────────

export interface FormSectionProps {
  title?: string;
  description?: string;
  children: ReactNode;
}

export const FormSection = memo(({ title, description, children }: FormSectionProps) => (
  <fieldset className="border-0 m-0 p-0 flex flex-col gap-4">
    {(title || description) && (
      <div className="border-b border-border-dark pb-3">
        {title && (
          <legend className="text-[10px] font-bold uppercase tracking-widest text-primary/70 font-mono">
            {title}
          </legend>
        )}
        {description && (
          <p className="text-[11px] text-slate-500 font-mono mt-1">{description}</p>
        )}
      </div>
    )}
    {children}
  </fieldset>
));

FormSection.displayName = 'FormSection';

// ─── FormRow ─────────────────────────────────────────────────────────────────

export type FormRowCols = 1 | 2 | 3 | 4;

export interface FormRowProps {
  cols?: FormRowCols;
  children: ReactNode;
}

const COLS_CLASSES: Record<FormRowCols, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
};

export const FormRow = memo(({ cols = 2, children }: FormRowProps) => (
  <div className={`grid gap-4 ${COLS_CLASSES[cols]}`}>{children}</div>
));

FormRow.displayName = 'FormRow';

// ─── FormActions ──────────────────────────────────────────────────────────────

export interface FormActionsProps {
  align?: 'left' | 'right' | 'center';
  children: ReactNode;
}

const ACTIONS_ALIGN: Record<'left' | 'right' | 'center', string> = {
  left: 'justify-start',
  right: 'justify-end',
  center: 'justify-center',
};

export const FormActions = memo(({ align = 'right', children }: FormActionsProps) => (
  <div className={`flex flex-wrap items-center gap-3 pt-2 border-t border-border-dark ${ACTIONS_ALIGN[align]}`}>
    {children}
  </div>
));

FormActions.displayName = 'FormActions';

// ─── Form ────────────────────────────────────────────────────────────────────

export interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
}

const Form = ({ children, className = '', ...rest }: FormProps) => (
  <form
    className={`flex flex-col gap-6 ${className}`}
    {...rest}
  >
    {children}
  </form>
);

export default memo(Form);
