"use client";

import {
  ArrowRightIcon,
  ArrowDownIcon,
  DotIcon,
  PilcrowIcon,
} from "@radix-ui/react-icons";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import { cn } from "@/lib/utils";
import { type NodeType } from "@/types/node";

import EditDeleteContextMenu from "./edit-delete-context-menu";
import FolderFileInput from "./folder-item-input";
import { Button } from "./ui/button";

type Props = {
  type: NodeType;
  onSelect?: (path: string, shouldNavigate?: boolean) => void;
  currentPath?: string;
  selectedPath?: string;
  nodeName: string;
  folded: boolean;
  onFoldChange: (folded: boolean) => void;
  onDelete: () => void;
  onUpdate: (name: string) => void;
  isRoot?: boolean;
  itemId: number;
};

function FolderItem({
  type,
  onSelect,
  currentPath = "",
  selectedPath,
  nodeName,
  folded,
  onFoldChange,
  onDelete,
  onUpdate,
  isRoot,
  itemId,
}: Props) {
  const isFile = type === "file";
  const isSelected = currentPath === selectedPath;
  const pathname = usePathname();
  const isInitialized = useRef(false);

  const fileId = pathname.split("/").pop();

  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState(nodeName);

  const inputRef = useRef<HTMLInputElement>(null);

  const renderIcon = useCallback(() => {
    if (isRoot) {
      return <PilcrowIcon className="size-3" />;
    }
    if (!isFile && folded) {
      return <ArrowRightIcon className="size-3" />;
    }
    if (!isFile && !folded) {
      return <ArrowDownIcon className="size-3" />;
    }
    return <DotIcon className="size-3" />;
  }, [folded, isFile, isRoot]);

  useEffect(() => {
    if (fileId && itemId === Number(fileId) && !isInitialized.current) {
      onSelect?.(currentPath, false);
      isInitialized.current = true;
    }
  }, [currentPath, fileId, itemId, onSelect]);

  const renderItem = useCallback(() => {
    const onEditConfirm = () => {
      setIsEditing(false);
      if (name === nodeName) return;
      if (!name) {
        setName(nodeName);
        return;
      }
      onUpdate(name);
    };

    return (
      <>
        {!isEditing && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.(currentPath);
              if (isFile) return;
              onFoldChange(!folded);
            }}
            className={cn(
              "w-full overflow-hidden text-ellipsis text-nowrap rounded-md px-2 text-left text-sm font-normal transition group-hover:bg-blue-100 group-hover:text-gray-900",
              {
                "bg-blue-300 font-semibold text-gray-700": isSelected,
                hidden: isEditing,
              },
            )}
          >
            {!isRoot ? name : ""}
          </button>
        )}
        {isEditing && (
          <FolderFileInput
            name={name}
            onNameChange={(val: string) => {
              setName(val);
            }}
            onEditConfirm={onEditConfirm}
            ref={inputRef}
          />
        )}
      </>
    );
  }, [
    isEditing,
    isSelected,
    isRoot,
    name,
    nodeName,
    onUpdate,
    onSelect,
    currentPath,
    isFile,
    onFoldChange,
    folded,
  ]);

  return (
    <ContextMenu>
      <ContextMenuTrigger className="group flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className={cn("size-6 p-1", {
            "pointer-events-none": isFile || isRoot,
          })}
          onClick={isFile || isRoot ? undefined : () => onFoldChange(!folded)}
        >
          {renderIcon()}
        </Button>
        {renderItem()}
        {!isRoot && (
          <EditDeleteContextMenu
            onEdit={() => {
              setIsEditing(true);
              setTimeout(() => {
                inputRef.current?.focus();
              }, 0);
            }}
            onDelete={onDelete}
          />
        )}
      </ContextMenuTrigger>
    </ContextMenu>
  );
}

export default FolderItem;
