"use client";

import {
  type TransitionStartFunction,
  createContext,
  useTransition,
  useContext,
} from "react";

type RouteTransitionContextType = {
  isRouteChanging: boolean;
  startRouteTransition: TransitionStartFunction;
};

export const RouteTransitionContext = createContext<RouteTransitionContextType>(
  {
    isRouteChanging: false,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    startRouteTransition: () => {},
  },
);

export function RouteTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <RouteTransitionContext.Provider
      value={{
        isRouteChanging: isPending,
        startRouteTransition: startTransition,
      }}
    >
      {children}
    </RouteTransitionContext.Provider>
  );
}

export function useRouteTransitionContext() {
  const context = useContext(RouteTransitionContext);
  if (context === null) {
    throw new Error(
      "useRouteTransitionContext must be used within a RouteTransitionProvider",
    );
  }
  return context;
}
