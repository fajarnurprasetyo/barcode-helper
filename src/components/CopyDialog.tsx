import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
} from "@mui/material";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import type { DialogProps } from "@toolpad/core";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { Fragment, useState } from "react";
import { Shift, type ShiftType } from "../utils";
import NumberField from "./NumberField";

export interface SendDialogResult {
  date: Dayjs;
  shift: ShiftType;
  utyPlus: number;
  reject: number;
  rejectRsv: number;
}

export default function CopyDialog(
  props: DialogProps<unknown, SendDialogResult | null>
) {
  const [date, setDate] = useState(() => dayjs().subtract(16, "hour"));
  const [shift, setShift] = useState<ShiftType>({ group: null, number: null });
  const [utyPlus, setUtyPlus] = useState(0);
  const [reject, setReject] = useState(0);
  const [rejectRsv, setRejectRsv] = useState(0);

  return (
    <Dialog fullWidth disableRestoreFocus open={props.open}>
      <DialogTitle>Copy Report</DialogTitle>
      <DialogContent>
        <Stack spacing={1}>
          <MobileDatePicker
            closeOnSelect
            label="Date"
            value={date}
            format="DD/MM/YYYY"
            onChange={(date) => {
              if (date) setDate(date);
            }}
            slotProps={{
              textField: {
                size: "small",
                variant: "filled",
                onContextMenu: (e) => e.preventDefault(),
              },
            }}
          />
          <FormControl>
            <FormLabel>Group</FormLabel>
            <RadioGroup
              row
              value={shift.group}
              onChange={({ target }) => {
                setShift((shift) => ({
                  ...shift,
                  group: target.value as ShiftType["group"],
                }));
              }}
            >
              {Shift.group.map((group) => (
                <FormControlLabel
                  key={group}
                  control={<Radio />}
                  value={group}
                  label={group}
                />
              ))}
            </RadioGroup>
          </FormControl>
          {shift.group !== "ALL" ? (
            <FormControl>
              <FormLabel>Shift</FormLabel>
              <RadioGroup
                row
                value={shift.number}
                onChange={({ target }) => {
                  setShift((shift) => ({
                    ...shift,
                    number: target.value as ShiftType["number"],
                  }));
                }}
              >
                {Shift.number.map((number) => (
                  <FormControlLabel
                    key={number}
                    control={<Radio />}
                    value={number}
                    label={number}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          ) : (
            <Fragment>
              <Divider />
              <NumberField
                autoSelect
                disableContextMenu
                size="small"
                variant="filled"
                decimalPlaces={2}
                label="UTY+ Up"
                value={utyPlus}
                onChange={(_, value) => setUtyPlus(value)}
              />
              <NumberField
                autoSelect
                disableContextMenu
                size="small"
                variant="filled"
                decimalPlaces={2}
                label="Reject"
                value={reject}
                onChange={(_, value) => setReject(value)}
              />
              <NumberField
                autoSelect
                disableContextMenu
                size="small"
                variant="filled"
                decimalPlaces={2}
                label="Reject + Rsv"
                value={rejectRsv}
                onChange={(_, value) => setRejectRsv(value)}
              />
            </Fragment>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.onClose(null)}>Cancel</Button>
        <Button
          variant="contained"
          disabled={!shift.group || (shift.group !== "ALL" && !shift.number)}
          onClick={() =>
            props.onClose({ shift, date, utyPlus, reject, rejectRsv })
          }
        >
          Copy
        </Button>
      </DialogActions>
    </Dialog>
  );
}
