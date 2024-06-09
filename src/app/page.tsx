import { RedirectType, redirect } from "next/navigation";

import getFirstFileId from "@/lib/getFirstFileId";
import { api } from "@/trpc/server";

async function Home() {
  const nestedFolder = await api.node.getNestedFolder();

  const firstFileId = getFirstFileId([nestedFolder]);

  if (firstFileId) {
    return redirect(`/${firstFileId}`, RedirectType.replace);
  }

  return <div>Please create a file to edit</div>;
}

export default Home;
