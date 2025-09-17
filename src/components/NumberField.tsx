import { useForkRef } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import type { TextFieldProps } from "./TextField";
import TextField from "./TextField";

function valueFormatter(value: number | undefined, decimalPlaces: number) {
  if (value === undefined || Number.isNaN(value)) {
    return "";
  }
  return value.toFixed(decimalPlaces);
}

export interface NumberFieldProps
  extends Omit<TextFieldProps, "type" | "value" | "defaultValue" | "onChange"> {
  maxDigits?: number;
  decimalPlaces?: number;
  value?: number;
  defaultValue?: number;
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    value: number
  ) => void;
}

export default function NumberField({
  maxDigits = 12,
  decimalPlaces = 5,
  ...props
}: NumberFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleInputRef = useForkRef(props.inputRef, inputRef);

  const regex = useMemo(
    () => new RegExp(`^\\d{0,${maxDigits}}\\.?\\d{0,${decimalPlaces}}$`),
    [maxDigits, decimalPlaces]
  );

  const [state, setState] = useState(() =>
    valueFormatter(props.value ?? props.defaultValue, decimalPlaces)
  );

  useEffect(() => {
    if (document.activeElement === inputRef.current) return;
    setState(valueFormatter(props.value ?? props.defaultValue, decimalPlaces));
  }, [decimalPlaces, props.value, props.defaultValue]);

  return (
    <TextField
      {...props}
      type="number"
      value={state}
      inputRef={handleInputRef}
      onBlur={(event) => {
        setState(valueFormatter(props.value, decimalPlaces));
        props.onBlur?.(event);
      }}
      onChange={(event) => {
        if (props.value === undefined || props.onChange !== undefined) {
          const match = event.target.value.match(regex);
          if (match) {
            setState(match[0]);
            props.onChange?.(event, parseFloat(match[0]) || 0);
          }
        }
      }}
    />
  );
}
