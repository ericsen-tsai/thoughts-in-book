import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

import {
  deleteNode,
  getNestedFolder,
  getNodes,
  insertNode,
  updateNode,
} from "./utils";

const nodeTypeSchema = z.enum(["folder", "file"]);

export const nodeRouter = createTRPCRouter({
  getNestedFolder: publicProcedure.query(async () => {
    const nestedFolder = await getNestedFolder();
    return nestedFolder;
  }),
  getFoldersAndFiles: publicProcedure.query(async () => {
    const nodes = await getNodes();
    return nodes;
  }),
  insert: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        type: nodeTypeSchema,
        parentId: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      // insert node
      const result = await insertNode(input);

      return result;
    }),
  update: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        type: nodeTypeSchema,
        id: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      const result = await updateNode(input);

      return result;
    }),
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      // delete node
      await deleteNode(input);

      return true;
    }),
});
