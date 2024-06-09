"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { type StoreApi, useStore } from "zustand";

import {
  type NodeStates,
  createNodeStore,
  type NodeStore,
} from "@/stores/node-store";

export const NodeStoreContext = createContext<StoreApi<NodeStore> | null>(null);

export interface NodeStoreProviderProps {
  children: ReactNode;
  initialState?: NodeStates;
}

export const NodeStoreProvider = ({
  children,
  initialState,
}: NodeStoreProviderProps) => {
  const storeRef = useRef<StoreApi<NodeStore>>();
  if (!storeRef.current) {
    storeRef.current = createNodeStore(initialState);
  }

  return (
    <NodeStoreContext.Provider value={storeRef.current}>
      {children}
    </NodeStoreContext.Provider>
  );
};

export const useNodeStore = <T,>(selector: (store: NodeStore) => T): T => {
  const nodeStoreContext = useContext(NodeStoreContext);

  if (!nodeStoreContext) {
    throw new Error(`useNodeStore must be use within NodeStoreProvider`);
  }

  return useStore(nodeStoreContext, selector);
};
