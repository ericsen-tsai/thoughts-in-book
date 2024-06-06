"use client";

import { ArrowDownIcon, DotIcon } from "@radix-ui/react-icons";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ROOT_ID } from "@/constants/nodeId";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { type NodeType, type Node } from "@/types/node";

import FolderItem from "./folder-item";
import { Input } from "./ui/input";
import { useToast } from "./ui/use-toast";

type Props = {
  node: Node;
  selectedPath?: string;
  level?: number;
  onSelect?: (path: string) => void;
  currentPath?: string;
  type?: NodeType;
  editingType?: NodeType;
  nearestFolderPath?: string;
  onEditingTypeChange: (type: NodeType | undefined) => void;
};

function FolderTree({
  node,
  selectedPath,
  level = 0,
  onSelect,
  currentPath = "",
  type = "folder",
  editingType,
  nearestFolderPath,
  onEditingTypeChange,
}: Props) {
  const [localNode, setLocalNode] = useState<Node>(node);
  const [isFolded, setIsFolded] = useState(false);
  const [fileName, setFileName] = useState<string>("");

  const utils = api.useUtils();
  const { isSuccess: isGetNestedFolderSuccess } =
    api.node.getNestedFolder.useQuery();

  const { toast } = useToast();

  const { mutate: insertNode } = api.node.insert.useMutation({
    onSuccess: async (node) => {
      void utils.node.invalidate();
      toast({
        title: `${node.type.slice(0, 1).toUpperCase()}${node.type.slice(1)} created`,
      });
    },
  });

  const {
    mutate: deleteNode,
    isPending,
    isSuccess,
  } = api.node.delete.useMutation({
    onSuccess: () => {
      void utils.node.getNestedFolder.invalidate();
      toast({
        title: `deleted`,
      });
    },
  });

  const { mutate: updateNode } = api.node.update.useMutation({
    onSuccess: (node) => {
      void utils.node.getNestedFolder.invalidate();
      toast({
        title: `${node.type.slice(0, 1).toUpperCase()}${node.type.slice(1)} updated`,
      });
    },
  });

  useEffect(() => {
    if (isGetNestedFolderSuccess) {
      setLocalNode(node);
    }
  }, [isGetNestedFolderSuccess, node]);

  const inputRef = useRef<HTMLInputElement>(null);

  const shouldRenderInputArea = useMemo(() => {
    return currentPath === nearestFolderPath && !!editingType;
  }, [currentPath, editingType, nearestFolderPath]);

  useEffect(() => {
    if (shouldRenderInputArea) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [shouldRenderInputArea]);

  const renderInputArea = useCallback(() => {
    if (!shouldRenderInputArea) {
      return null;
    }

    if (!editingType) return null;

    const editingFolder = editingType === "folder";

    const onNodeInputConfirm = () => {
      onEditingTypeChange(undefined);
      if (fileName) {
        setLocalNode({
          ...localNode,
          children: [
            ...(localNode.children ?? []),
            {
              name: fileName,
              type: editingType,
              id: +Math.random().toString(36).substring(7),
            },
          ],
        });
        insertNode({
          name: fileName,
          type: editingType,
          parentId: node.id,
        });
      }

      setFileName("");
    };

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
          onBlur={() => onNodeInputConfirm()}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onNodeInputConfirm();
            }
          }}
          onChange={(e) => {
            setFileName(e.target.value);
          }}
          ref={inputRef}
        />
      </div>
    );
  }, [
    editingType,
    fileName,
    insertNode,
    level,
    localNode,
    node.id,
    onEditingTypeChange,
    shouldRenderInputArea,
  ]);

  const isOptimizedDeleting = isPending || isSuccess;

  if (isOptimizedDeleting) {
    return null;
  }

  return (
    <ul
      style={{
        paddingLeft: `${(level + 1) * 5}px`,
      }}
      className={cn(level === 0 && "pt-1")}
    >
      {
        <li>
          <FolderItem
            type={type}
            onSelect={onSelect}
            currentPath={currentPath}
            selectedPath={selectedPath}
            nodeName={node.name}
            folded={isFolded}
            onFoldChange={setIsFolded}
            onDelete={() => deleteNode({ id: node.id })}
            onUpdate={(name: string) => updateNode({ name, type, id: node.id })}
            isRoot={node.id === ROOT_ID}
          />

          {!isFolded && (
            <ul>
              {(localNode.children ?? []).map((child, index) => (
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
                    onEditingTypeChange={onEditingTypeChange}
                  />
                </li>
              ))}
              <li>{renderInputArea()}</li>
            </ul>
          )}
        </li>
      }
    </ul>
  );
}

export default FolderTree;
