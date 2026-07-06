import {
  Autocomplete,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
} from "@mui/material";
import type { DialogProps } from "@toolpad/core";
import { useState } from "react";
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
import { StbjExportGrades } from "../utils";
import NumberField from "./NumberField";
import TextField from "./TextField";

const defaultState: Item = {
  thick: 0,
  wood: Wood.TN,
  grade: Grade.BBCC,
  export: false,
  glue: Glue.M,
  content: 0,
};

export default function ItemDialog(
  props: DialogProps<Item | null, Item | null>,
) {
  const [state, setState] = useState<Item>(() => ({
    ...defaultState,
    ...props.payload,
  }));

  return (
    <Dialog
      fullWidth
      component="form"
      open={props.open}
      disableRestoreFocus
      onSubmit={(event) => {
        event.preventDefault();
        props.onClose(ItemSchema.parse(state));
      }}
    >
      <DialogTitle sx={{ userSelect: "none" }}>Add Item</DialogTitle>
      <DialogContent>
        <Grid container pt={1} spacing={2}>
          <Grid size={12}>
            <NumberField
              fullWidth
              autoFocus
              autoSelect
              maxDigits={2}
              decimalPlaces={1}
              // variant="filled"
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
              disableClearable
              value={state.wood}
              options={WoodSchema.options}
              onChange={(_, wood) => setState((state) => ({ ...state, wood }))}
              renderInput={(params) => (
                <TextField {...params} label="Wood" disableContextMenu />
              )}
            />
          </Grid>
          <Grid size={6}>
            <Autocomplete
              fullWidth
              disableClearable
              value={state.grade}
              options={GradeSchema.options}
              onChange={(_, grade) =>
                setState((state) => ({
                  ...state,
                  grade,
                  export: StbjExportGrades.includes(grade),
                }))
              }
              renderInput={(params) => (
                <TextField {...params} label="Grade" disableContextMenu />
              )}
            />
          </Grid>
          <Grid size={6} />
          <Grid size={6}>
            <FormControlLabel
              label="Export"
              control={<Checkbox />}
              sx={{ userSelect: "none" }}
              disabled={StbjExportGrades.includes(state.grade)}
              checked={state.export}
              onChange={(_, checked) =>
                setState((state) => ({ ...state, export: checked }))
              }
            />
          </Grid>
          <Grid size={6}>
            <Autocomplete
              fullWidth
              disableClearable
              value={state.glue}
              options={GlueSchema.options}
              onChange={(_, glue) => setState((state) => ({ ...state, glue }))}
              renderInput={(params) => (
                <TextField {...params} label="Glue" disableContextMenu />
              )}
            />
          </Grid>
          <Grid size={6}>
            <NumberField
              fullWidth
              autoSelect
              maxDigits={3}
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
        <Button color="inherit" onClick={() => props.onClose(null)}>
          Cancel
        </Button>
        <Button type="submit" disabled={!ItemSchema.safeParse(state).success}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
