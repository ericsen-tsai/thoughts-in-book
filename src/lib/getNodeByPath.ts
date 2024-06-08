import { type Node, type Path } from "@/types/node";

const getNodeByPath = (
  path: Path,
  nodeOrNodes: Node | Node[],
): Node | undefined => {
  if (!path) {
    return Array.isArray(nodeOrNodes) ? undefined : nodeOrNodes;
  }

  const pathParts = path.split(".");
  const [curr, ...rest] = pathParts;

  if (!curr) {
    return undefined;
  }

  const nextLayer = Array.isArray(nodeOrNodes)
    ? nodeOrNodes[parseInt(curr)]
    : nodeOrNodes[curr as "children"];

  if (!nextLayer) {
    return undefined;
  }

  return getNodeByPath(rest.join("."), nextLayer);
};

export default getNodeByPath;
