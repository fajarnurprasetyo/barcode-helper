import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from "@mui/material";
import type { DialogProps } from "@toolpad/core";
import { useMemo, useState } from "react";
import {
  Glue,
  GlueSchema,
  Grade,
  GradeSchema,
  ItemSchema,
  Wood,
  WoodSchema,
  type Item,
} from "../schemas";
import NumberField from "./NumberField";
import TextField from "./TextField";

const defaultState: Item = {
  thick: 0,
  wood: Wood.TN,
  grade: Grade.BBCC,
  glue: Glue.M,
  content: 0,
};

export default function ItemDialog(
  props: DialogProps<Item | null, Item | null>
) {
  const [state, setState] = useState<Item>(() => ({
    ...defaultState,
    ...props.payload,
  }));

  const isValid = useMemo(() => ItemSchema.safeParse(state).success, [state]);

  return (
    <Dialog fullWidth disableRestoreFocus open={props.open}>
      <DialogTitle>Add Item</DialogTitle>
      <DialogContent>
        <Grid container spacing={1}>
          <Grid size={12}>
            <NumberField
              fullWidth
              autoFocus
              autoSelect
              size="small"
              maxDigits={2}
              decimalPlaces={1}
              variant="filled"
              disableContextMenu
              value={state.thick}
              label="Thickness (mm)"
              onChange={(_, thick) =>
                setState((state) => ({ ...state, thick }))
              }
            />
          </Grid>
          <Grid size={6}>
            <Autocomplete
              fullWidth
              size="small"
              disableClearable
              value={state.wood}
              options={WoodSchema.options}
              onChange={(_, wood) => setState((state) => ({ ...state, wood }))}
              renderInput={(params) => {
                return (
                  <TextField
                    {...params}
                    label="Wood"
                    variant="filled"
                    disableContextMenu
                  />
                );
              }}
            />
          </Grid>
          <Grid size={6}>
            <Autocomplete
              fullWidth
              size="small"
              disableClearable
              value={state.grade}
              options={GradeSchema.options}
              onChange={(_, grade) =>
                setState((state) => ({ ...state, grade }))
              }
              renderInput={(params) => {
                return (
                  <TextField
                    {...params}
                    label="Grade"
                    variant="filled"
                    disableContextMenu
                  />
                );
              }}
            />
          </Grid>
          <Grid size={6}>
            <Autocomplete
              fullWidth
              size="small"
              disableClearable
              value={state.glue}
              options={GlueSchema.options}
              onChange={(_, glue) => setState((state) => ({ ...state, glue }))}
              renderInput={(params) => {
                return (
                  <TextField
                    {...params}
                    label="Glue"
                    variant="filled"
                    disableContextMenu
                  />
                );
              }}
            />
          </Grid>
          <Grid size={6}>
            <NumberField
              fullWidth
              autoSelect
              size="small"
              maxDigits={3}
              variant="filled"
              decimalPlaces={0}
              disableContextMenu
              value={state.content}
              label="Content (pcs)"
              onChange={(_, content) =>
                setState((state) => ({ ...state, content }))
              }
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.onClose(null)}>Cancel</Button>
        <Button
          variant="contained"
          disabled={!isValid}
          onClick={() => props.onClose(ItemSchema.parse(state))}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
