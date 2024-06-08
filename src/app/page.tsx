import { redirect } from "next/navigation";

import getFirstFileId from "@/lib/getFirstFileId";
import { api } from "@/trpc/server";

async function Home() {
  const nestedFolder = await api.node.getNestedFolder();

  const rootChildren = nestedFolder.children;

  const firstFileId = getFirstFileId(rootChildren ?? []);

  if (firstFileId) {
    return redirect(`/${firstFileId}`);
  }

  return <div>Please create a file to edit</div>;
}

export default Home;
