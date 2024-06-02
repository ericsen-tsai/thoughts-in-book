"use client";

import { FilePlusIcon, ArchiveIcon } from "@radix-ui/react-icons";
import { setCookie } from "cookies-next";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import { RESIZABLE_LAYOUT_COOKIE } from "@/constants/layout";
import getNearestFolderPathByPath from "@/lib/getNearestFolderByPath";
import { cn } from "@/lib/utils";
import { useCreateNewNodeStore } from "@/stores/createNewNodeStore";
import { api } from "@/trpc/react";
import { type Node } from "@/types/node";

import FolderTree from "./folder-tree";
import { Button } from "./ui/button";

export const dynamic = "force-dynamic";

function ResizablePanelLayout({
  defaultLayout = [30, 70],
  children,
  folder,
}: {
  defaultLayout?: [number, number];
  children: React.ReactNode;
  folder: Node;
}) {
  const {
    selectedPath,
    onSelectedPathChange,
    onEditingTypeChange,
    editingType,
  } = useCreateNewNodeStore((state) => ({
    selectedPath: state.selectedPath,
    onSelectedPathChange: state.onSelectedPathChange,
    editingType: state.editingType,
    onEditingTypeChange: state.onEditingTypeChange,
  }));

  const { data: nestedFolder } = api.node.getNestedFolder.useQuery(undefined, {
    initialData: folder,
  });

  const handleLayout = (sizes: number[]) => {
    setCookie(RESIZABLE_LAYOUT_COOKIE, JSON.stringify(sizes));
  };

  const handleSelect = (path: string) => {
    // since focusing on input will trigger onSelect, we need to prevent it
    if (editingType) return;
    onSelectedPathChange(path);
  };

  const handleSelectRoot = () => {
    // since focusing on input will trigger onSelect, we need to prevent it
    if (editingType) return;
    onSelectedPathChange(undefined);
  };

  const handleEditing = (type?: "folder" | "file") => {
    onEditingTypeChange(type);
  };

  return (
    <PanelGroup direction="horizontal" onLayout={handleLayout}>
      <Panel defaultSize={defaultLayout[0]} minSize={20} className="relative">
        <div className="absolute right-0 top-1 flex gap-2 pr-2">
          <Button
            variant={"ghost"}
            className="size-6 px-1 py-0"
            onClick={() => {
              handleEditing("folder");
            }}
          >
            <ArchiveIcon className="size-3" />
          </Button>
          <Button
            variant={"ghost"}
            className="size-6 px-1 py-0"
            onClick={() => {
              handleEditing("file");
            }}
          >
            <FilePlusIcon className="size-3" />
          </Button>
        </div>
        <div
          onClick={handleSelectRoot}
          className={cn("h-full border-2", {
            "border-gray-100": selectedPath === undefined,
          })}
        >
          <FolderTree
            node={nestedFolder}
            selectedPath={selectedPath}
            nearestFolderPath={
              selectedPath
                ? getNearestFolderPathByPath(
                    selectedPath,
                    nestedFolder.children ?? [],
                    "",
                  )
                : ""
            }
            onSelect={handleSelect}
            editingType={editingType}
          />
        </div>
      </Panel>
      <PanelResizeHandle className="w-1 bg-gray-300 hover:bg-gray-400" />
      <Panel defaultSize={defaultLayout[1]} minSize={20}>
        {children}
      </Panel>
    </PanelGroup>
  );
}

export default ResizablePanelLayout;
