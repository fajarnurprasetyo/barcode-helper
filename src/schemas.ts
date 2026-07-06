import z from "zod";

export enum Wood {
  TN = "Tunas",
  PM = "Palem",
  BI = "Birch",
  SK = "Soeka",
}

export const WoodSchema = z.enum(Wood);

export enum Grade {
  BBCC = "BBCC",
  Better = "BTR",
  Export = "EXP",
  Plus = "UTY+",
  GrdA = "Grd A",
  GrdB = "Grd B",
  GrdC = "Grd C",
  D_E = "D/E",
  E_F = "E/F",
  F_F = "F/F",
  LocalDge = "UTY-L",
  Local = "UTY",
  Cover = "CVR",
  One = "UT-1",
  Reject = "UT-2",
}

export const GradeSchema = z.enum(Grade);

export enum Glue {
  A = "CARB",
  B = "E0",
  C = "E1",
  D = "E2",
  M = "MR",
}

export const GlueSchema = z.enum(Glue);

export const ItemSchema = z.object({
  thick: z.number().min(1),
  wood: WoodSchema,
  grade: GradeSchema,
  export: z.boolean(),
  glue: GlueSchema,
  content: z.number().min(1),
});

export type Item = z.infer<typeof ItemSchema>;

const KEY_SEPARATOR = "|";

export const ItemFromStringSchema = z
  .string()
  .transform((key) => key.split(KEY_SEPARATOR) as unknown[])
  .pipe(
    z
      .tuple([
        z.coerce.number().min(1),
        WoodSchema,
        GradeSchema,
        z.literal(["true", "false"]).transform((value) => value === "true"),
        GlueSchema,
        z.coerce.number().min(1),
      ])
      .transform(([thick, wood, grade, $export, glue, content]) =>
        ItemSchema.parse({
          thick,
          wood,
          grade,
          export: $export,
          glue,
          content,
        }),
      ),
  );

export const ItemToStringSchema = ItemSchema.transform((item) =>
  [
    item.thick,
    item.wood,
    item.grade,
    item.export,
    item.glue,
    item.content,
  ].join(KEY_SEPARATOR),
);
