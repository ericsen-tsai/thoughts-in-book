"use client";

import { FilePlusIcon, ArchiveIcon } from "@radix-ui/react-icons";
import { setCookie } from "cookies-next";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import { RESIZABLE_LAYOUT_COOKIE } from "@/constants/layout";
import getNearestFolderPathByPath from "@/lib/getNearestFolderByPath";
import { cn } from "@/lib/utils";
import { useCreateNewNodeStore } from "@/stores/createNewNodeStore";
import { type Node } from "@/types/node";

import FolderTree from "./folder-tree";
import { Button } from "./ui/button";

const exampleFolder: Node = {
  name: "",
  type: "folder",
  children: [
    {
      name: "src",
      type: "folder",
      children: [
        { name: "index.js", type: "file" },
        { name: "styles.css", type: "file" },
      ],
    },
    {
      name: "node_modules",
      type: "folder",
      children: [
        {
          name: "react-accessible-treeview",
          type: "folder",
          children: [{ name: "bundle.js", type: "file" }],
        },
        {
          name: "react",
          children: [{ name: "bundle.js", type: "file" }],
          type: "folder",
        },
      ],
    },
    {
      name: ".npmignore",
      type: "file",
    },
    {
      name: "package.json",
      type: "file",
    },
    {
      name: "webpack.config.js",
      type: "file",
    },
  ],
};
function ResizablePanelLayout({
  defaultLayout = [30, 70],
  children,
}: {
  defaultLayout?: [number, number];
  children: React.ReactNode;
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
            node={exampleFolder}
            selectedPath={selectedPath}
            nearestFolderPath={
              selectedPath
                ? getNearestFolderPathByPath(
                    selectedPath,
                    exampleFolder.children ?? [],
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
