import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import MarkdownPanel from "@/components/markdown-panel";
import { MODE_COOKIE } from "@/constants/mode";
import { api } from "@/trpc/server";
import { type Mode } from "@/types/mode";

type Props = {
  params: {
    fileId: string;
  };
};

export const dynamic = "force-dynamic";

async function Page({ params }: Props) {
  const { fileId } = params;
  const [fileContent, foldersOrFiles] = await Promise.all([
    api.fileContent.get(+fileId),
    api.node.getFoldersAndFiles(),
  ]);

  const mode = cookies().get(MODE_COOKIE);

  const defaultMode: Mode | undefined = mode
    ? (JSON.parse(mode.value) as Mode)
    : undefined;

  if (
    foldersOrFiles.find(
      (node) => node.id === +fileId && node.type === "file",
    ) === undefined
  ) {
    notFound();
  }

  return (
    <MarkdownPanel
      fileId={fileId}
      defaultFileContent={fileContent}
      defaultMode={defaultMode}
    />
  );
}

export default Page;
