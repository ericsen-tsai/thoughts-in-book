import { generateReactHelpers } from "@uploadthing/react";

import type { ImageFileRouter } from "@/app/api/uploadthing/core";

export const { useUploadThing, uploadFiles } =
  generateReactHelpers<ImageFileRouter>();
