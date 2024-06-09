import { ROOT_PATH_PREFIX } from "@/constants/node";
import { type Node } from "@/types/node";

const getFolderPathByFileId = (
  node: Node,
  targetId: number,
  path = ROOT_PATH_PREFIX,
): string | null => {
  if (node.id === targetId) {
    return path;
  }

  if (!node.children) return null;

  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];
    if (!child) continue;

    const childPath = `${path}.children.${i}`;
    const result = getFolderPathByFileId(child, targetId, childPath);
    if (!result) continue;

    return result;
  }

  return null;
};

export default getFolderPathByFileId;
