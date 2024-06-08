import { notFound } from "next/navigation";

import MarkdownPanel from "@/components/markdown-panel";
import { api } from "@/trpc/server";

type Props = {
  params: {
    fileId: string;
  };
};

async function Page({ params }: Props) {
  const { fileId } = params;
  const [fileContent, foldersOrFiles] = await Promise.all([
    api.fileContent.get(+fileId),
    api.node.getFoldersAndFiles(),
  ]);

  if (
    foldersOrFiles.find(
      (node) => node.id === +fileId && node.type === "file",
    ) === undefined
  ) {
    notFound();
  }

  return <MarkdownPanel fileId={fileId} fileContent={fileContent} />;
}

export default Page;
