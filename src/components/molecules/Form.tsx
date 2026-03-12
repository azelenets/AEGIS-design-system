import { memo, type FormHTMLAttributes, type FieldsetHTMLAttributes, type HTMLAttributes, type ReactNode } from 'react';

// ─── FormSection ─────────────────────────────────────────────────────────────

export interface FormSectionProps extends FieldsetHTMLAttributes<HTMLFieldSetElement> {
  title?: string;
  description?: string;
  children: ReactNode;
}

export const FormSection = memo(({ title, description, children, className = '', ...rest }: FormSectionProps) => (
  <fieldset {...rest} className={['border-0 m-0 p-0 flex flex-col gap-4', className].filter(Boolean).join(' ')}>
    {(title || description) && (
      <div className="border-b border-border-dark pb-3">
        {title && (
          <legend className="text-[10px] font-bold uppercase tracking-widest text-primary font-mono">
            {title}
          </legend>
        )}
        {description && (
          <p className="text-[11px] text-slate-400 font-mono mt-1">{description}</p>
        )}
      </div>
    )}
    {children}
  </fieldset>
));

FormSection.displayName = 'FormSection';

// ─── FormRow ─────────────────────────────────────────────────────────────────

export type FormRowCols = 1 | 2 | 3 | 4;

export interface FormRowProps extends HTMLAttributes<HTMLDivElement> {
  cols?: FormRowCols;
  children: ReactNode;
}

const COLS_CLASSES: Record<FormRowCols, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
};

export const FormRow = memo(({ cols = 2, children, className = '', ...rest }: FormRowProps) => (
  <div {...rest} className={['grid gap-4', COLS_CLASSES[cols], className].filter(Boolean).join(' ')}>{children}</div>
));

FormRow.displayName = 'FormRow';

// ─── FormActions ──────────────────────────────────────────────────────────────

export interface FormActionsProps extends HTMLAttributes<HTMLDivElement> {
  align?: 'left' | 'right' | 'center';
  children: ReactNode;
}

const ACTIONS_ALIGN: Record<'left' | 'right' | 'center', string> = {
  left: 'justify-start',
  right: 'justify-end',
  center: 'justify-center',
};

export const FormActions = memo(({ align = 'right', children, className = '', ...rest }: FormActionsProps) => (
  <div {...rest} className={['flex flex-wrap items-center gap-3 pt-2 border-t border-border-dark', ACTIONS_ALIGN[align], className].filter(Boolean).join(' ')}>
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

const MemoForm = memo(Form);
MemoForm.displayName = 'Form';

export default MemoForm;
