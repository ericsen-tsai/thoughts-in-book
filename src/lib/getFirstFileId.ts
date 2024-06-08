import { type Node } from "@/types/node";

const getFirstFileId = (nodes: Node[]): number | undefined => {
  if (nodes.length === 0) {
    return undefined;
  }
  for (const node of nodes) {
    if (node && node.type === "file") {
      return node.id;
    }
  }

  for (const node of nodes) {
    if (node.children) {
      const result = getFirstFileId(node.children);
      if (result !== undefined) {
        return result;
      }
    }
  }

  return undefined;
};

export default getFirstFileId;
