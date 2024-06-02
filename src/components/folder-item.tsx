"use client";

import { ArrowRightIcon, ArrowDownIcon, DotIcon } from "@radix-ui/react-icons";
import { useCallback, useRef, useState } from "react";

import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import { cn } from "@/lib/utils";
import { type NodeType } from "@/types/node";

import EditDeleteContextMenu from "./edit-delete-context-menu";
import FolderFileInput from "./folder-item-input";
import { Button } from "./ui/button";

type Props = {
  type: NodeType;
  onSelect?: (path: string) => void;
  currentPath?: string;
  selectedPath?: string;
  nodeName: string;
  folded: boolean;
  onFoldChange: (folded: boolean) => void;
  onDelete: () => void;
  onUpdate: (name: string) => void;
  isRoot?: boolean;
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
}: Props) {
  const isFile = type === "file";

  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState(nodeName);
  const inputRef = useRef<HTMLInputElement>(null);

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
        <FolderFileInput
          name={name}
          onNameChange={(val: string) => {
            setName(val);
          }}
          onEditConfirm={onEditConfirm}
          className={cn(!isEditing && "hidden")}
          ref={inputRef}
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect?.(currentPath);
          }}
          className={cn(
            "w-full overflow-hidden text-ellipsis text-nowrap rounded-md px-2 text-left text-sm font-semibold transition group-hover:bg-blue-100 group-hover:text-gray-900",
            {
              "bg-blue-300 text-gray-700": currentPath === selectedPath,
              hidden: isEditing,
            },
          )}
        >
          {!isRoot ? name : ""}
        </button>
      </>
    );
  }, [
    currentPath,
    isEditing,
    isRoot,
    name,
    nodeName,
    onSelect,
    onUpdate,
    selectedPath,
  ]);

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
        {!isRoot && (
          <EditDeleteContextMenu
            onEdit={() => {
              setIsEditing(true);
              setTimeout(() => {
                inputRef.current?.focus();
                console.log(inputRef.current);
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
