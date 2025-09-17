import { Divider, List as MuiList, Stack } from "@mui/material";
import { Fragment, useMemo } from "react";
import {
  type Grade,
  type Item
} from "../../schemas";
import { sortItems } from "../../utils";
import ListItem from "./ListItem";
import ListItemTotal from "./ListItemTotal";

export interface ListProps {
  items: Item[];
  values: Map<Item, number>;
  exportGrades: Grade[];
  onChange: (item: Item, value: number) => void;
  // onItemClick: (item: Item) => void;
  onItemDeleteClick: (item: Item) => void;
}

export function List({
  items,
  values,
  exportGrades,
  onChange,
  // onItemClick,
  onItemDeleteClick,
}: ListProps) {
  const [localItems, exportItems] = useMemo(
    () =>
      items
        .reduce(
          (result, item) => {
            result[exportGrades.includes(item.grade) ? 1 : 0].push(item);
            return result;
          },
          [[], []] as [Item[], Item[]]
        )
        .map(sortItems),
    [items, exportGrades]
  );

  return (
    <Stack height={1}>
      <MuiList disablePadding sx={{ flex: 1, overflow: "auto" }}>
        {localItems.map((item, index) => (
          <Fragment key={index}>
            <ListItem
              item={item}
              value={values.get(item)}
              onChange={onChange}
              onItemDeleteClick={onItemDeleteClick}
            />
            <Divider />
          </Fragment>
        ))}
        <ListItemTotal items={localItems} values={values} />
        <Divider />
        {exportItems.map((item, index) => (
          <Fragment key={index}>
            <ListItem
              item={item}
              value={values.get(item)}
              onChange={onChange}
              onItemDeleteClick={onItemDeleteClick}
            />
            <Divider />
          </Fragment>
        ))}
        <ListItemTotal items={exportItems} values={values} />
        <Divider />
      </MuiList>
      <Divider />
      <ListItemTotal items={items} values={values} />
    </Stack>
  );
}
