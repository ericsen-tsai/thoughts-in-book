import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { type NodeType } from "@/types/node";

type CreateNewNodeStore = {
  selectedPath?: string;
  onSelectedPathChange: (path?: string) => void;
  editingType?: NodeType;
  onEditingTypeChange: (type?: NodeType) => void;
};

export const useCreateNewNodeStore = create(
  devtools<CreateNewNodeStore>((set) => ({
    selectedPath: "",
    onSelectedPathChange: (path?: string) => set({ selectedPath: path }),
    editingType: undefined,
    onEditingTypeChange: (type?: NodeType) => set({ editingType: type }),
  })),
);
