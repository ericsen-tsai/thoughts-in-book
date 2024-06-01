import { ArrowRightIcon, ArrowDownIcon, DotIcon } from "@radix-ui/react-icons";
import { useCallback, useState } from "react";

import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import { cn } from "@/lib/utils";
import { type NodeType } from "@/types/node";

import EditDeleteContextMenu from "./edit-delete-context-menu";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

type Props = {
  type: NodeType;
  onSelect?: (path: string) => void;
  currentPath?: string;
  selectedPath?: string;
  nodeName: string;
  folded: boolean;
  onFoldChange: (folded: boolean) => void;
};

function FolderItem({
  type,
  onSelect,
  currentPath = "",
  selectedPath,
  nodeName,
  folded,
  onFoldChange,
}: Props) {
  const isFile = type === "file";

  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState(nodeName);

  console.log({ name });

  const renderIcon = useCallback(() => {
    if (!isFile && folded) {
      return <ArrowRightIcon className="size-3" />;
    }
    if (!isFile && !folded) {
      return <ArrowDownIcon className="size-3" />;
    }
    return <DotIcon className="size-3" />;
  }, [folded, isFile]);

  const renderItem = useCallback(() => {
    if (isEditing) {
      return (
        <Input
          className="h-5 p-1"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          onBlur={() => {
            setIsEditing(false);
            // TODO update
          }}
        />
      );
    }

    return (
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
        {name}
      </button>
    );
  }, [currentPath, isEditing, name, nodeName, onSelect, selectedPath]);

  return (
    <ContextMenu>
      <ContextMenuTrigger className="group flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className={cn(isFile && "cursor-default", "size-6 p-1")}
          onClick={isFile ? undefined : () => onFoldChange(!folded)}
        >
          {renderIcon()}
        </Button>
        {renderItem()}
        <EditDeleteContextMenu
          onEdit={() => setIsEditing(true)}
          onDelete={() => {
            // TODO delete
            console.log("delete");
          }}
        />
      </ContextMenuTrigger>
    </ContextMenu>
  );
}

export default FolderItem;
