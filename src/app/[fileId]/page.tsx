import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import MarkdownPanel from "@/components/markdown-panel";
import { MODE_COOKIE } from "@/constants/mode";
import { PATH_QUERY_KEY } from "@/constants/node";
import { api } from "@/trpc/server";
import { type Mode } from "@/types/mode";

type Props = {
  params: {
    fileId: string;
  };
  searchParams?: Record<string, string | string[] | undefined>;
};

export const dynamic = "force-dynamic";

async function Page({ params, searchParams }: Props) {
  const { fileId } = params;
  const [fileContent, foldersOrFiles] = await Promise.all([
    api.fileContent.get(+fileId),
    api.node.getFoldersAndFiles(),
  ]);

  const path = searchParams?.[PATH_QUERY_KEY] as string | undefined;

  const decodedPath = path ? decodeURIComponent(path) : undefined;

  const mode = cookies().get(MODE_COOKIE);

  const defaultMode: Mode | undefined = mode
    ? (JSON.parse(mode.value) as Mode)
    : undefined;

  const canFileBeFound = foldersOrFiles.find(
    (node) => node.id === +fileId && node.type === "file",
  );

  if (!canFileBeFound) {
    notFound();
  }

  return (
    <MarkdownPanel
      fileId={fileId}
      defaultFileContent={fileContent}
      defaultMode={defaultMode}
      defaultSelectedPath={decodedPath}
    />
  );
}

export default Page;
