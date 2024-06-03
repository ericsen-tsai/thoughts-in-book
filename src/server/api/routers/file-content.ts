import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

import { updateFileContent } from "./utils";

export const fileContentRouter = createTRPCRouter({
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
