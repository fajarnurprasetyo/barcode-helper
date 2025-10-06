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
import { useCallback, useState } from "react";
import CopyDialog from "./components/CopyDialog";
import ItemDialog from "./components/ItemDialog";
import { List } from "./components/List";
import type { Item } from "./schemas";
import useAppState from "./useAppState";
import {
  GradingExportGrades,
  sortItems,
  StbjExportGrades,
  sumItems,
} from "./utils";

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

  const {
    items,
    lastItem,
    addItem,
    // updateItem,
    deleteItem,
    grading,
    setGrading,
    stbj,
    setStbj,
  } = useAppState();

  const handleAddItem = useCallback(async () => {
    const item = await dialogs.open(ItemDialog, lastItem);
    if (item) addItem(item);
  }, [dialogs, lastItem, addItem]);

  const handleDeleteItem = useCallback(
    async (item: Item) => {
      const confirmed = await dialogs.confirm(
        "Are you sure want to delete this item?",
        {
          title: "Delete Item",
          okText: "Delete",
          severity: "error",
        }
      );
      if (confirmed) deleteItem(item);
    },
    [dialogs, deleteItem]
  );

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
        notifications.show(
          "Content successfully copied to clipboard.",
          {severity: "success", autoHideDuration: 3000},
        )
      } catch (err) {
        console.error(err);
        notifications.show(
          "Failed to copy content to clipboard. Please try again.",
          {severity: "error"},
        )
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
