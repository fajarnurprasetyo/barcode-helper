import { Add, ContentCopy } from "@mui/icons-material";
import {
  AppBar,
  Box,
  Divider,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from "@mui/material";
import { useDialogs, useNotifications } from "@toolpad/core";
import { useCallback, useEffect, useState } from "react";
import CopyDialog from "./components/CopyDialog";
import ItemDialog from "./components/ItemDialog";
import { List } from "./components/List";
import { ItemFromStringSchema, ItemToStringSchema, type Item } from "./schemas";
// import useAppState from "./useAppState";
import {
  GradingExportGrades,
  sortItems,
  StbjExportGrades,
  sumItems,
} from "./utils";

function storeItems(items: Item[]) {
  const value = JSON.stringify(
    items.map((item) => ItemToStringSchema.parse(item)),
  );
  window.localStorage.setItem("items", value);
}

function itemsToText(title: string, items: Item[], values: Map<Item, number>) {
  let text = `*${title}*`;

  let lastItem: Item | null = null;
  for (const item of sortItems(items)) {
    const value = values.get(item);
    if (!value) continue;
    if (
      !lastItem ||
      item.thick !== lastItem.thick ||
      item.wood !== lastItem.wood
    ) {
      lastItem = item;
      text += `\n│ *${item.thick.toFixed(1)}mm ${item.wood}*`;
    }
    text += `\n│ │ ${item.grade} ${item.glue} @${item.content} = ${value} Krat`;
  }

  const sum = sumItems(items, values);
  text += `\n│ *TOTAL*\n│ │ ${sum.crate} Krat\n│ │ ${sum.pcs} Pcs\n│ │ ${sum.volume.toFixed(2)} m³`;

  return text;
}

function App() {
  const dialogs = useDialogs();
  const notifications = useNotifications();
  const [tab, setTab] = useState(0);

  const [items, setItems] = useState<Item[]>([]);
  const [lastItem, setLastItem] = useState<Item | null>(null);

  const [grading, setGrading] = useState<Map<Item, number>>(new Map());
  const [stbj, setStbj] = useState<Map<Item, number>>(new Map());

  // const {
  //   items,
  //   lastItem,
  //   addItem,
  //   // updateItem,
  //   deleteItem,
  //   grading,
  //   setGrading,
  //   stbj,
  //   setStbj,
  // } = useAppState();

  const handleAddItem = useCallback(async () => {
    const item = await dialogs.open(ItemDialog, lastItem);
    if (!item) return;

    const key = ItemToStringSchema.parse(item);
    if (!items.some((it) => ItemToStringSchema.parse(it) === key)) {
      setItems((items) => {
        const newItems = [...items, item];
        storeItems(newItems);
        return newItems;
      });

      setGrading((prev) => {
        const map = new Map(prev);
        map.set(item, 0);
        return map;
      });

      setStbj((prev) => {
        const map = new Map(prev);
        map.set(item, 0);
        return map;
      });

      setLastItem(item);
    }
  }, [dialogs, items, lastItem]);

  const handleEditItem = useCallback(
    async (item: Item) => {
      const update = await dialogs.open(ItemDialog, item);
      if (!update) return;

      const index = items.findIndex((it) => it === item);
      if (index === -1) return;

      setItems((items) => {
        const newItems = [...items];
        newItems[index] = update;
        return newItems;
      });

      setGrading((prev) => {
        const map = new Map(prev);
        map.delete(item);
        map.set(update, prev.get(item) ?? 0);
        return map;
      });

      setStbj((prev) => {
        const map = new Map(prev);
        map.delete(item);
        map.set(update, prev.get(item) ?? 0);
        return map;
      });
    },
    [dialogs, items],
  );

  const handleDeleteItem = useCallback(
    async (item: Item) => {
      const confirmed = await dialogs.confirm(
        "Are you sure want to delete this item?",
        {
          title: "Delete Item",
          okText: "Delete",
          severity: "error",
        },
      );
      if (!confirmed) return;

      const index = items.findIndex((it) => it === item);
      if (index === -1) return;

      setItems((items) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        storeItems(newItems);
        return newItems;
      });

      setGrading((prev) => {
        const map = new Map(prev);
        map.delete(item);
        return map;
      });

      setStbj((prev) => {
        const map = new Map(prev);
        map.delete(item);
        return map;
      });
    },
    [dialogs, items],
  );

  useEffect(() => {
    const storedItems = window.localStorage.getItem("items");
    if (storedItems) {
      try {
        const parsed: Item[] = JSON.parse(storedItems)
          .map((data: string) => ItemFromStringSchema.safeParse(data).data)
          .filter(Boolean);

        setItems(parsed);
        setGrading(new Map(parsed.map((item) => [item, 0] as [Item, number])));
        setStbj(new Map(parsed.map((item) => [item, 0] as [Item, number])));
      } catch (error) {
        console.error("Failed to parse stored items", error);
      }
    }

    // window.addEventListener("storage", handleStorageChange);
    return () => {
      // window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleCopy = useCallback(async () => {
    const result = await dialogs.open(CopyDialog);

    if (result) {
      let text = `@ ${result.date.format("DD-MM-YYYY")}*`;
      text += `\n\n${itemsToText("GRADING", items, grading)}`;
      text += `\n\n${itemsToText("STBJ", items, stbj)}`;

      if (result.shift.group !== "ALL") {
        text = `*SHIFT ${result.shift.group}${result.shift.number} ${text}`;
      } else {
        text = `*ALL SHIFT ${text}`;
        text += `\n\n*UTY+ Up = ${result.utyPlus.toFixed(2)}%*`;
        text += `\n*Reject = ${result.reject.toFixed(2)}%*`;
        text += `\n*Reject+Rsv = ${result.rejectRsv.toFixed(2)}%*`;
      }

      try {
        await navigator.clipboard.writeText(text);
        notifications.show("Content successfully copied to clipboard.", {
          severity: "success",
          autoHideDuration: 3000,
        });
      } catch (err) {
        console.error(err);
        notifications.show(
          "Failed to copy content to clipboard. Please try again.",
          { severity: "error" },
        );
      }
    }
  }, [dialogs, notifications, items, grading, stbj]);

  return (
    <Stack height="100dvh">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" flexGrow={1}>
            Barcode Helper
          </Typography>
          <Stack mr={-1} direction="row" spacing={1}>
            <IconButton color="inherit" onClick={handleAddItem}>
              <Add />
            </IconButton>
            <IconButton color="inherit" onClick={handleCopy}>
              <ContentCopy />
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>
      <Tabs
        value={tab}
        variant="fullWidth"
        onChange={(_, value) => setTab(value)}
      >
        <Tab label="Grading" />
        <Tab label="STBJ" />
      </Tabs>
      <Divider />
      <Box flexGrow={1} minHeight={0}>
        {tab === 0 && (
          <List
            items={items}
            values={grading}
            exportGrades={GradingExportGrades}
            onItemEditClick={handleEditItem}
            onItemDeleteClick={handleDeleteItem}
            onChange={(item, value) =>
              setGrading((prev) => {
                const map = new Map(prev);
                map.set(item, value);
                return map;
              })
            }
          />
        )}
        {tab === 1 && (
          <List
            items={items}
            values={stbj}
            exportGrades={StbjExportGrades}
            onItemEditClick={handleEditItem}
            onItemDeleteClick={handleDeleteItem}
            onChange={(item, value) =>
              setStbj((prev) => {
                const map = new Map(prev);
                map.set(item, value);
                return map;
              })
            }
          />
        )}
      </Box>
    </Stack>
  );
}

export default App;
