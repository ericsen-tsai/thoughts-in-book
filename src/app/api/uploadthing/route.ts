import { createRouteHandler } from "uploadthing/next";

import { imageFileRouter } from "./core";

export const { GET, POST } = createRouteHandler({
  router: imageFileRouter,
});
