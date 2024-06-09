"use client";

import { FilePlusIcon, ArchiveIcon } from "@radix-ui/react-icons";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import { RESIZABLE_LAYOUT_COOKIE } from "@/constants/layout";
import { useRouteTransitionContext } from "@/contexts/route-transition-context";
import getNearestFolderPathByPath from "@/lib/getNearestFolderByPath";
import getNodeByPath from "@/lib/getNodeByPath";
import { cn } from "@/lib/utils";
import { useNodeStore } from "@/providers/node-store-provider";
import { api } from "@/trpc/react";
import { type NodeType, type Node } from "@/types/node";

import FolderTree from "./folder-tree";
import TooltipCompound from "./tooltip-compound";
import { Button } from "./ui/button";

export const dynamic = "force-dynamic";

type Props = {
  defaultLayout?: [number, number];
  children: React.ReactNode;
  folder: Node;
};

function ResizablePanelLayout({
  defaultLayout = [30, 70],
  children,
  folder,
}: Props) {
  const {
    selectedPath,
    onSelectedPathChange,
    onEditingTypeChange,
    editingType,
  } = useNodeStore((state) => ({
    selectedPath: state.selectedPath,
    onSelectedPathChange: state.onSelectedPathChange,
    editingType: state.editingType,
    onEditingTypeChange: state.onEditingTypeChange,
  }));

  const { startRouteTransition } = useRouteTransitionContext();
  const router = useRouter();

  const { data: nestedFolder } = api.node.getNestedFolder.useQuery(undefined, {
    initialData: folder,
  });

  const handleLayout = (sizes: number[]) => {
    setCookie(RESIZABLE_LAYOUT_COOKIE, JSON.stringify(sizes));
  };

  const handleSelect = (path: string, shouldNavigate = true) => {
    // since focusing on input will trigger onSelect, we need to prevent it
    if (editingType) return;
    onSelectedPathChange(path);
    const selectedNode = getNodeByPath(path, nestedFolder.children ?? []);
    if (selectedNode && selectedNode.type === "file" && shouldNavigate) {
      startRouteTransition(() => {
        router.push(`/${selectedNode.id}`);
      });
    }
  };

  const handleSelectRoot = () => {
    // since focusing on input will trigger onSelect, we need to prevent it
    if (editingType) return;

    onSelectedPathChange(undefined);
  };

  const handleEditing = (type?: NodeType) => {
    onEditingTypeChange(type);
  };

  const nearestFolderPath = useMemo(
    () =>
      selectedPath
        ? getNearestFolderPathByPath(
            selectedPath,
            nestedFolder.children ?? [],
            "",
          )
        : "",
    [nestedFolder.children, selectedPath],
  );

  return (
    <PanelGroup direction="horizontal" onLayout={handleLayout}>
      <Panel defaultSize={defaultLayout[0]} minSize={20} className="relative">
        <div className="absolute right-0 top-1 flex gap-2 pr-2">
          <TooltipCompound content="Create folder">
            <Button
              variant={"ghost"}
              className="size-6 px-1 py-0"
              onClick={() => {
                handleEditing("folder");
              }}
            >
              <ArchiveIcon className="size-3" />
            </Button>
          </TooltipCompound>
          <TooltipCompound content="Create file">
            <Button
              variant={"ghost"}
              className="size-6 px-1 py-0"
              onClick={() => {
                handleEditing("file");
              }}
            >
              <FilePlusIcon className="size-3" />
            </Button>
          </TooltipCompound>
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
            nearestFolderPath={nearestFolderPath}
            onSelect={handleSelect}
            editingType={editingType}
            onEditingTypeChange={onEditingTypeChange}
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
