import React from 'react';
import { TextField } from '@mui/material';

interface CurrencyInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

export default function CurrencyInput({ label, value, onChange }: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = React.useState<string>('');

  React.useEffect(() => {
    const formatted = value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    setDisplayValue(formatted);
  }, [value]);

  const handleFocus = () => {
    if (value === 0) {
      setDisplayValue('');
    } else {
      setDisplayValue(value.toString());
    }
  };

  const handleBlur = () => {
    const normalized = displayValue.replace(/\./g, '').replace(',', '.');
    const num = parseFloat(normalized) || 0;
    onChange(num);
    const formatted = num.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    setDisplayValue(formatted);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayValue(e.target.value);
  };

  return (
    <TextField
      fullWidth
      label={label}
      value={displayValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      InputProps={{ inputMode: 'decimal' }}
    />
  );
}
