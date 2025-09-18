import {
  GlueSchema,
  Grade,
  GradeSchema,
  WoodSchema,
  type Item,
} from "./schemas";

export const StbjExportGrades = [
  Grade.BBCC,
  Grade["UT-B"],
  Grade["UT-E"],
  Grade["UTY+"],
  Grade.A,
  Grade.B,
  Grade.DE,
  Grade.EF,
];

export const GradingExportGrades = [
  ...StbjExportGrades,
  Grade["UT-L-DGE"],
  Grade.C,
  Grade.FF,
];

export function sortItems(items: Item[]): Item[] {
  return items.sort((a, b) => {
    if (a.thick !== b.thick) return a.thick - b.thick;
    if (a.wood !== b.wood)
      return (
        WoodSchema.options.indexOf(a.wood) - WoodSchema.options.indexOf(b.wood)
      );
    if (a.grade !== b.grade)
      return (
        GradeSchema.options.indexOf(a.grade) -
        GradeSchema.options.indexOf(b.grade)
      );
    if (a.glue !== b.glue)
      return (
        GlueSchema.options.indexOf(a.glue) - GlueSchema.options.indexOf(b.glue)
      );
    return b.content - a.content;
  });
}

export function sumItems(items: Item[], values: Map<Item, number>) {
  return items.reduce(
    (result, item) => {
      const crate = values.get(item) ?? 0;
      result.crate += crate;
      result.pcs += item.content * crate;
      result.volume += (item.thick * 1.22 * 2.44 * item.content * crate) / 1000;
      return result;
    },
    { crate: 0, pcs: 0, volume: 0 }
  );
}

export const Shift = {
  group: ["A", "B", "C", "ALL"] as const,
  number: ["1", "2", "3"] as const,
};

export type ShiftType = {
  group: (typeof Shift.group)[number] | null;
  number: (typeof Shift.number)[number] | null;
};
