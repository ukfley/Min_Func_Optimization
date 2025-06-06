// src/components/Inputs/InputsGroup.tsx
'use client'
import { useState, useCallback } from "react";

type UseInputsGroupProps<T> = {
  inputs: {
    name: keyof T;
    type: 'text' | 'number';
    pattern?: string;
    placeholder?: string;
  }[];
};

export const useInputsGroup = <T,>(props: UseInputsGroupProps<T>) => {
  const [data, setData] = useState<Record<keyof T, string>>(
    props.inputs.reduce((acc, input) => ({
      ...acc,
      [input.name]: "",
    }), {} as Record<keyof T, string>)
  );

  const [exportData, setExportData] = useState<T>(
    props.inputs.reduce((acc, input) => ({
      ...acc,
      [input.name]: "" as any,
    }), {} as T)
  );

  const [errors, setErrors] = useState<Record<keyof T, string>>({} as Record<keyof T, string>);

  const validateInitialX = useCallback((value: string): { isValid: boolean; parsedValue: any } => {
    if (value === '') {
      return { isValid: true, parsedValue: '' };
    }
    try {
      const parsed = JSON.parse(value);
      if (!Array.isArray(parsed) || !parsed.every((v: any) => typeof v === 'number' && !isNaN(v))) {
        return { isValid: false, parsedValue: value };
      }
      return { isValid: true, parsedValue: parsed };
    } catch {
      return { isValid: false, parsedValue: value };
    }
  }, []);

  const handleInputChange = useCallback((input: { name: keyof T; type: 'text' | 'number'; pattern?: string }, value: string) => {
    console.log('handleInputChange called:', input.name, value); // Debug log
    setData(prev => ({
      ...prev,
      [input.name]: value,
    }));

    if (['step', 'initialStep', 'lambda', 'epsilon'].includes(input.name as string)) {
      const validInput = /^-?\d*\.?\d*$/.test(value);
      setErrors(prev => ({
        ...prev,
        [input.name]: validInput || value === '' ? '' : 'Use digits and a dot (e.g., 0.1), no commas.'
      }));
      setExportData(prev => ({
        ...prev,
        [input.name]: value === '' ? '' : parseFloat(value),
      }));
      return;
    }

    if (input.name === 'initialX') {
      const { isValid, parsedValue } = validateInitialX(value);
      setErrors(prev => ({
        ...prev,
        [input.name]: isValid || value === '' ? '' : 'Invalid format, use [1, 1]',
      }));
      setExportData(prev => ({
        ...prev,
        [input.name]: isValid ? parsedValue : value,
      }));
      return;
    }

    if (input.type === 'number' && value !== '') {
      const convertedValue = parseFloat(value);
      setExportData(prev => ({
        ...prev,
        [input.name]: isNaN(convertedValue) ? value : convertedValue,
      }));
    } else {
      setExportData(prev => ({
        ...prev,
        [input.name]: value,
      }));
    }
    setErrors(prev => ({ ...prev, [input.name]: '' }));
  }, [validateInitialX]);

  const inputsGroupProps = {
    inputs: props.inputs.map(input => ({
      name: input.name as string,
      type: input.type,
      value: data[input.name],
      onChange: (value: string) => handleInputChange(input, value),
      onBlur: (value: string) => {
        if (input.name === 'initialX') {
          const { isValid, parsedValue } = validateInitialX(value);
          setErrors(prev => ({
            ...prev,
            [input.name]: isValid || value === '' ? '' : 'Invalid format, use [1, 1]',
          }));
          setExportData(prev => ({
            ...prev,
            [input.name]: isValid ? parsedValue : value,
          }));
        }
      },
      pattern: input.pattern,
      placeholder: input.placeholder,
      error: errors[input.name],
    })),
  };

  return {
    data: exportData,
    __inputsGroupProps: inputsGroupProps,
  };
};

type InputsGroupProps = {
  inputs: {
    name: string;
    value: string;
    onChange: (value: string) => void;
    onBlur?: (value: string) => void;
    type: 'text' | 'number';
    pattern?: string;
    placeholder?: string;
    error?: string;
  }[];
};

const InputsGroup: React.FC<InputsGroupProps> = ({ inputs }) => {
  return (
    <div className="flex flex-col space-y-2">
      {inputs.map((input, index) => (
        <div className="flex flex-col" key={index}>
          <label htmlFor={input.name} className="capitalize text-sm font-medium">
            {input.name}
          </label>
          <input
            id={input.name}
            name={input.name}
            value={input.value}
            onChange={(e) => {
              if (input.type === 'text') {
                const inputElement = e.target as HTMLInputElement;
                const cursorPosition = inputElement.selectionStart;
                input.onChange(e.target.value);
                setTimeout(() => {
                  inputElement.setSelectionRange(cursorPosition, cursorPosition);
                }, 0);
              } else {
                input.onChange(e.target.value);
              }
            }}
            onBlur={input.onBlur ? (e) => input.onBlur!(e.target.value) : undefined}
            type={input.type}
            pattern={input.pattern}
            placeholder={input.placeholder || (
              input.name === 'epsilon' ? 'e.g., 0.0001' :
              input.name === 'step' ? 'e.g., 0.01' :
              input.name === 'initialStep' ? 'e.g., 0.1' :
              input.name === 'lambda' ? 'e.g., 1.0' :
              input.name === 'initialX' ? 'e.g., [1, 1]' :
              input.name === 'left' || input.name === 'right' ? 'e.g., -2' :
              input.name === 'n' || input.name === 'maxIterations' ? 'e.g., 1000' : undefined
            )}
            className={`mt-1 w-full rounded-md border ${input.error ? 'border-red-500' : 'border-gray-300'} p-2`}
            title={input.pattern ? 'Use digits and a single dot (e.g., 0.1) for decimals, or [1, 1] for initialX' : undefined}
          />
          {input.error && <span className="text-red-500 text-sm mt-1">{input.error}</span>}
        </div>
      ))}
    </div>
  );
};

export default InputsGroup;
