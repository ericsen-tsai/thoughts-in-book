"use client";

import {
  ArrowRightIcon,
  ArrowDownIcon,
  DotIcon,
  PilcrowIcon,
} from "@radix-ui/react-icons";
import { useParams } from "next/navigation";
import {
  type MouseEvent,
  useCallback,
  useRef,
  useState,
  useEffect,
} from "react";

import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import { ROOT_PATH_PREFIX } from "@/constants/node";
import { cn } from "@/lib/utils";
import { type Node } from "@/types/node";

import EditDeleteContextMenu from "./edit-delete-context-menu";
import FolderFileInput from "./folder-item-input";
import { Button } from "./ui/button";

type Props = {
  onSelect?: (path: string, shouldNavigate?: boolean) => void;
  currentPath?: string;
  selectedPath?: string;
  folded: boolean;
  onFoldChange: (folded: boolean) => void;
  onDelete: () => void;
  onUpdate: (name: string) => void;
  isRoot?: boolean;
  node: Node;
};

function FolderItem({
  onSelect,
  currentPath = ROOT_PATH_PREFIX,
  selectedPath,
  folded,
  onFoldChange,
  onDelete,
  onUpdate,
  isRoot,
  node: { id: nodeId, name: nodeName, type: nodeType },
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(nodeName);
  const isInitialized = useRef(false);
  const { fileId } = useParams<{ fileId: string }>();
  const isFile = nodeType === "file";

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
    if (fileId && nodeId === Number(fileId) && !isInitialized.current) {
      onSelect?.(currentPath, false);
      isInitialized.current = true;
    }
  }, [currentPath, fileId, nodeId, onSelect]);

  const renderItem = useCallback(() => {
    const isSelected = currentPath === selectedPath;

    const onItemButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onSelect?.(currentPath);
    };

    const onItemEditConfirm = () => {
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
            onClick={onItemButtonClick}
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
            onEditConfirm={onItemEditConfirm}
            ref={inputRef}
          />
        )}
      </>
    );
  }, [
    currentPath,
    selectedPath,
    isEditing,
    isRoot,
    name,
    onSelect,
    nodeName,
    onUpdate,
  ]);

  const shouldIgnoreClick = isFile || isRoot;

  return (
    <ContextMenu>
      <ContextMenuTrigger className="group flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className={cn("size-6 p-1", {
            "pointer-events-none": shouldIgnoreClick,
          })}
          onClick={shouldIgnoreClick ? undefined : () => onFoldChange(!folded)}
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
