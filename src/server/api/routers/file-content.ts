import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

import { getFileContent, updateFileContent } from "./utils";

export const fileContentRouter = createTRPCRouter({
  get: publicProcedure.input(z.number()).query(async ({ input }) => {
    const fileContent = await getFileContent(input);

    return fileContent ?? "";
  }),
  update: publicProcedure
    .input(
      z.object({
        nodeId: z.number(),
        content: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      await updateFileContent(input);

      return input;
    }),
});
