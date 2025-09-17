import { Divider, ListItem, Typography } from "@mui/material";
import { useMemo } from "react";
import type { Item } from "../../schemas";
import { sumItems } from "../../utils";

export interface ListItemTotalProps {
  items: Item[];
  values: Map<Item, number>;
}

export default function ListItemTotal({ items, values }: ListItemTotalProps) {
  const { crate, pcs, volume } = useMemo(
    () => sumItems(items, values),
    [items, values]
  );

  return (
    <ListItem sx={{ px: 2, py: 1 }}>
      <Typography flex={1} textAlign="center" variant="body2" fontWeight={500}>
        {crate} Crate
      </Typography>
      <Divider flexItem orientation="vertical" />
      <Typography flex={1} textAlign="center" variant="body2" fontWeight={500}>
        {pcs} Pcs
      </Typography>
      <Divider flexItem orientation="vertical" />
      <Typography flex={1} textAlign="center" variant="body2" fontWeight={500}>
        {volume.toFixed(2)} m³
      </Typography>
    </ListItem>
  );
}
