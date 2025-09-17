import { produce } from "immer";
import { useCallback, useEffect, useState } from "react";
import { ItemFromStringSchema, ItemToStringSchema, type Item } from "./schemas";

function storeItems(items: Item[]) {
  const value = JSON.stringify(
    items.map((item) => ItemToStringSchema.parse(item))
  );
  window.localStorage.setItem("items", value);
}

export default function useAppState() {
  const [items, setItems] = useState<Item[]>([]);
  const [lastItem, setLastItem] = useState<Item | null>(null);
  const [grading, setGrading] = useState<Map<Item, number>>(new Map());
  const [stbj, setStbj] = useState<Map<Item, number>>(new Map());

  const addItem = useCallback(
    (item: Item) => {
      const key = ItemToStringSchema.parse(item);
      if (!items.some((it) => ItemToStringSchema.parse(it) === key)) {
        setItems((items) =>
          produce(items, (items) => {
            items.push(item);
            storeItems(items);
          })
        );

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
      }
      setLastItem(item);
    },
    [items]
  );

  const updateItem = useCallback(
    (item: Item, update: Item) => {
      const index = items.findIndex((it) => it === item);
      if (index === -1) return;

      setItems((items) =>
        produce(items, (items) => {
          items[index] = update;
          storeItems(items);
        })
      );

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
    [items]
  );

  const deleteItem = useCallback(
    (item: Item) => {
      const index = items.findIndex((it) => it === item);
      if (index === -1) return;

      setItems((items) =>
        produce(items, (items) => {
          items.splice(index, 1);
          storeItems(items);
        })
      );

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
    [items]
  );

  const handleStorageChange = useCallback((event: StorageEvent) => {
    console.log("Storage changed", event);
  }, []);

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

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [handleStorageChange]);

  return {
    items,
    lastItem,
    addItem,
    updateItem,
    deleteItem,
    grading,
    setGrading,
    stbj,
    setStbj,
  };
}
