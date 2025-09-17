import {
  TextField as MuiTextField,
  type TextFieldProps as MuiTextFieldProps,
  type TextFieldVariants,
} from "@mui/material";

export type TextFieldProps<
  Variant extends TextFieldVariants = TextFieldVariants,
> = MuiTextFieldProps<Variant> & {
  autoSelect?: boolean;
  disableContextMenu?: boolean;
};

export default function TextField<
  Variant extends TextFieldVariants = TextFieldVariants,
>({ autoSelect, disableContextMenu, ...props }: TextFieldProps<Variant>) {
  return (
    <MuiTextField
      {...props}
      onFocus={(event) => {
        if (autoSelect) event.target.select();
        props.onFocus?.(event);
      }}
      onContextMenu={(event) => {
        if (props.onContextMenu) props.onContextMenu(event);
        else if (disableContextMenu) event.preventDefault();
      }}
    />
  );
}
