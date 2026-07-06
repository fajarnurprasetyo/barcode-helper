import { Delete, Edit } from "@mui/icons-material";
import {
  IconButton,
  ListItemText,
  ListItem as MuiListItem,
  Stack
} from "@mui/material";
import type { Item } from "../../schemas";
import NumberField from "../NumberField";

export interface ListItemProps {
  item: Item;
  value: number | undefined;
  onChange: (item: Item, value: number) => void;
  onItemEditClick: (item: Item) => void;
  onItemDeleteClick: (item: Item) => void;
}

export default function ListItem(props: ListItemProps) {
  const { item, value, onChange, onItemEditClick, onItemDeleteClick } = props;

  return (
    <MuiListItem
      disablePadding
      sx={{ pl: 2, pr: 1, ":hover": { backgroundColor: "#00000011" } }}
    >
      <ListItemText
        primary={`${item.thick.toFixed(1)}mm ${item.grade}`}
        secondary={`${item.wood} ${item.glue} @${item.content}`}
      />
      <Stack spacing={1} direction="row">
        <NumberField
          autoSelect
          value={value}
          decimalPlaces={0}
          sx={{ width: 58 }}
          disableContextMenu
          onChange={(_, value) => onChange(item, value)}
          slotProps={{
            htmlInput: {
              sx: {
                padding: 0.5,
                textAlign: "center",
              },
            },
          }}
        />
        <IconButton
          size="small"
          tabIndex={-1}
          onClick={() => onItemEditClick(item)}
        >
          <Edit />
        </IconButton>
        <IconButton
          size="small"
          tabIndex={-1}
          onClick={() => onItemDeleteClick(item)}
        >
          <Delete />
        </IconButton>
      </Stack>
    </MuiListItem>
  );
}
