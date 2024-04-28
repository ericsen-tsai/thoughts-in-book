import { type Path, type Node } from "@/types/node";

const getNearestFolderPathByPath = (
  path: Path,
  folder: Node | Node[],
  root = "",
): Path => {
  if (!path) {
    if (!Array.isArray(folder) && folder.type === "file") {
      return root.split(".").slice(0, -2).join(".");
    }

    return root;
  }
  const pathParts = path.split(".");
  const [curr, ...rest] = pathParts;

  if (!curr) {
    return root;
  }

  const nextLayer = Array.isArray(folder)
    ? folder[parseInt(curr)]
    : folder[curr as "children"];

  if (!nextLayer) {
    return root;
  }

  return getNearestFolderPathByPath(
    rest.join("."),
    nextLayer,
    root ? `${root}.${curr}` : curr,
  );
};

export default getNearestFolderPathByPath;
