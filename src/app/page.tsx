import { RedirectType, notFound, redirect } from "next/navigation";

import { PATH_QUERY_KEY } from "@/constants/node";
import getFirstFileId from "@/lib/getFirstFileId";
import getFolderPathByFileId from "@/lib/getFolderPathByFileId";
import { api } from "@/trpc/server";

async function Home() {
  const nestedFolder = await api.node.getNestedFolder();

  const firstFileId = getFirstFileId([nestedFolder]);

  if (!firstFileId) return <div>Please create a file to edit</div>;

  const filePath = getFolderPathByFileId(nestedFolder, firstFileId) ?? "";

  if (!filePath) {
    notFound();
  }

  redirect(
    `/${firstFileId}?${PATH_QUERY_KEY}=${encodeURIComponent(filePath)}`,
    RedirectType.replace,
  );
}

export default Home;
