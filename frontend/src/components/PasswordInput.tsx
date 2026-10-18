"use client";

import { InputHTMLAttributes, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label?: string;
};

const PasswordInput = ({ label = 'password', className = '', ...props }: PasswordInputProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        {...props}
        type={visible ? 'text' : 'password'}
        className={`w-full pr-12 ${className}`}
      />
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        className="absolute inset-y-0 right-0 inline-flex items-center justify-center px-3 text-[var(--kc-text-muted)] transition hover:text-[var(--kc-blue-700)] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--kc-blue-700)]"
        aria-label={visible ? `Hide ${label}` : `Show ${label}`}
        title={visible ? `Hide ${label}` : `Show ${label}`}
      >
        {visible ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
      </button>
    </div>
  );
};

export default PasswordInput;
