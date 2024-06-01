import { ArrowDownIcon, DotIcon } from "@radix-ui/react-icons";
import { useCallback, useState } from "react";

import { cn } from "@/lib/utils";
import { useCreateNewNodeStore } from "@/stores/createNewNodeStore";
import { type NodeType, type Node } from "@/types/node";

import FolderItem from "./folder-item";
import { Input } from "./ui/input";

function FolderTree({
  node,
  selectedPath,
  level = 0,
  onSelect,
  currentPath = "",
  type = "folder",
  editingType,
  nearestFolderPath,
}: {
  node: Node;
  selectedPath?: string;
  level?: number;
  onSelect?: (path: string) => void;
  currentPath?: string;
  type?: NodeType;
  editingType?: NodeType;
  nearestFolderPath?: string;
}) {
  const onEditingTypeChange = useCreateNewNodeStore(
    (state) => state.onEditingTypeChange,
  );

  const [isFolded, setIsFolded] = useState(false);

  const [fileName, setFileName] = useState<string>("");

  const renderInputArea = useCallback(() => {
    const shouldRender = currentPath === nearestFolderPath && !!editingType;

    if (!shouldRender) {
      return null;
    }

    const editingFolder = editingType === "folder";

    return (
      <div
        className="flex items-center gap-1"
        style={{
          paddingLeft: `${(level + 2) * 5}px`,
        }}
      >
        <div className="size-6 p-1">
          {editingFolder && <ArrowDownIcon className="size-3" />}
          {!editingFolder && <DotIcon className="size-3" />}
        </div>
        <Input
          className="h-5 p-1"
          value={fileName}
          onBlur={() => {
            onEditingTypeChange(undefined);
            setFileName("");
            // TODO: save the new folder/file
          }}
          onChange={(e) => {
            setFileName(e.target.value);
          }}
        ></Input>
      </div>
    );
  }, [
    currentPath,
    editingType,
    fileName,
    level,
    nearestFolderPath,
    onEditingTypeChange,
  ]);

  return (
    <ul
      style={{
        paddingLeft: `${(level + 1) * 5}px`,
      }}
      className={cn(level === 0 && "pt-1")}
    >
      <li>
        <FolderItem
          type={type}
          onSelect={onSelect}
          currentPath={currentPath}
          selectedPath={selectedPath}
          nodeName={node.name}
          folded={isFolded}
          onFoldChange={setIsFolded}
        />

        {node.children && !isFolded && (
          <ul>
            <li>{renderInputArea()}</li>
            {node.children.map((child, index) => (
              <li key={child.name}>
                <FolderTree
                  node={child}
                  level={level + 1}
                  currentPath={`${currentPath}${level === 0 ? "" : ".children."}${index}`}
                  onSelect={onSelect}
                  type={child.type}
                  selectedPath={selectedPath}
                  editingType={editingType}
                  nearestFolderPath={nearestFolderPath}
                />
              </li>
            ))}
          </ul>
        )}
      </li>
    </ul>
  );
}

export default FolderTree;
