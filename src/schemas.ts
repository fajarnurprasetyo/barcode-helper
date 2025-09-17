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
  "UT-B" = "BTR",
  "UT-E" = "EXP",
  "UTY+" = "UTY+",
  "UT-L-DGE" = "UTY-L",
  DE = "D/E",
  EF = "E/F",
  "UT-L" = "UTY",
  "UT-1" = "UT-1",
  FF = "F/F",
  "UT-2" = "UT-2",
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
        GlueSchema,
        z.coerce.number().min(1),
      ])
      .transform(([thick, wood, grade, glue, content]) =>
        ItemSchema.parse({ thick, wood, grade, glue, content })
      )
  );

export const ItemToStringSchema = ItemSchema.transform((item) =>
  [item.thick, item.wood, item.grade, item.glue, item.content].join(
    KEY_SEPARATOR
  )
);
