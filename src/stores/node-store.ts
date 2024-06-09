import { createStore } from "zustand/vanilla";

import { type NodeType } from "@/types/node";

export type NodeStates = {
  selectedPath?: string;
  editingType?: NodeType;
};

export type NodeActions = {
  onSelectedPathChange: (path?: string) => void;
  onEditingTypeChange: (type?: NodeType) => void;
};

export type NodeStore = NodeStates & NodeActions;

export const defaultState: NodeStates = {
  selectedPath: undefined,
  editingType: undefined,
};

export const createNodeStore = (initialState: NodeStates = defaultState) => {
  return createStore<NodeStore>()((set) => ({
    ...initialState,
    onSelectedPathChange: (path?: string) => set({ selectedPath: path }),
    onEditingTypeChange: (type?: NodeType) => set({ editingType: type }),
  }));
};
