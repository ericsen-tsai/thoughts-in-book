import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const imageFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } }).onUploadComplete(
    async ({ file }) => {
      console.log("Upload complete");

      console.log("file url", file.url);

      return { fileUrl: file.url };
    },
  ),
} satisfies FileRouter;

export type ImageFileRouter = typeof imageFileRouter;
