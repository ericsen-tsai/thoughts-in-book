import { ArrowRightIcon, ArrowDownIcon, DotIcon } from "@radix-ui/react-icons";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { type NodeType, type Node } from "@/types/node";

import { Button } from "./ui/button";

function FolderTree({
  node,
  selectedPath,
  level = 0,
  onSelect,
  currentPath = "",
  type = "folder",
}: {
  node: Node;
  selectedPath?: string;
  level?: number;
  onSelect?: (path: string) => void;
  currentPath?: string;
  type?: NodeType;
}) {
  const [isFolded, setIsFolded] = useState(false);

  const isFile = type === "file";

  return (
    <ul
      style={{
        paddingLeft: `${(level + 1) * 5}px`,
      }}
      className={cn(level === 0 && "pt-1")}
    >
      <li>
        <div className="group flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className={cn(isFile && "cursor-default", "size-6 p-1")}
            onClick={isFile ? undefined : () => setIsFolded((prev) => !prev)}
          >
            {!isFile && isFolded && <ArrowRightIcon className="size-3" />}
            {!isFile && !isFolded && <ArrowDownIcon className="size-3" />}
            {isFile && <DotIcon className="size-3" />}
          </Button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.(currentPath);
            }}
            className={cn(
              "w-full overflow-hidden text-ellipsis text-nowrap rounded-md px-2 text-left text-sm font-semibold transition group-hover:bg-blue-100 group-hover:text-gray-900",
              {
                "bg-blue-300 text-gray-700": currentPath === selectedPath,
              },
            )}
          >
            {node.name}
          </button>
        </div>

        {node.children && !isFolded && (
          <ul>
            {node.children.map((child, index) => (
              <li key={child.name}>
                <FolderTree
                  node={child}
                  level={level + 1}
                  currentPath={`${currentPath}${level === 0 ? "" : ".children."}${index}`}
                  onSelect={onSelect}
                  type={child.type}
                  selectedPath={selectedPath}
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
