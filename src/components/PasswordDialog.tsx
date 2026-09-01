import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Input,
  Typography,
} from "@mui/material";
import type { DialogProps } from "@toolpad/core";
import { useState } from "react";

export default function CopyDialog(props: DialogProps<unknown, string>) {
  const [password, setPassword] = useState("");

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      disableRestoreFocus
      component="form"
      open={props.open}
      onSubmit={(event) => {
        event.preventDefault();
        props.onClose(password);
      }}
    >
      <DialogTitle>Authentication Required</DialogTitle>
      <DialogContent>
        <Typography mb={1}>Please enter the password or send me 1M first 😀</Typography>
        <Input
          required
          autoFocus
          fullWidth
          type="password"
          value={password}
          onFocus={({ target }) => target.select()}
          onChange={({ target }) => setPassword(target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button type="submit" disabled={!password} sx={{ marginInlineEnd: 1 }}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
