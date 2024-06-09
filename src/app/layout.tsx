import "@/styles/globals.css";

import { Inter } from "next/font/google";
import { cookies, headers } from "next/headers";

import ResizablePanelLayout from "@/components/resizable-panel-layout";
import { Toaster } from "@/components/ui/toaster";
import { CURRENT_PATH_HEADER } from "@/constants/header";
import { RESIZABLE_LAYOUT_COOKIE } from "@/constants/layout";
import { RouteTransitionProvider } from "@/contexts/route-transition-context";
import getFileIdByPathname from "@/lib/getFileIdByPathname";
import getSelectedPathByFileId from "@/lib/getSelectedPathByFileId";
import { cn } from "@/lib/utils";
import { NodeStoreProvider } from "@/providers/node-store-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { TRPCReactProvider } from "@/trpc/react";
import { api } from "@/trpc/server";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Thoughts in Books",
  description: "A place to store your thoughts on books",
  icons: [{ rel: "icon", url: "/favicon.svg" }],
};

export default async function RootLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  const headerList = headers();
  const pathname = headerList.get(CURRENT_PATH_HEADER);

  const fileId = getFileIdByPathname(pathname ?? "");

  const layout = cookies().get(RESIZABLE_LAYOUT_COOKIE);

  const defaultLayout: [number, number] | undefined = layout
    ? (JSON.parse(layout.value) as [number, number])
    : undefined;

  const nestedFolder = await api.node.getNestedFolder();

  const defaultSelectedPath = fileId
    ? getSelectedPathByFileId(nestedFolder, +fileId)
    : undefined;

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable,
        )}
      >
        <TRPCReactProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NodeStoreProvider
              initialState={{
                selectedPath: defaultSelectedPath,
              }}
            >
              <RouteTransitionProvider>
                <ResizablePanelLayout
                  defaultLayout={defaultLayout}
                  folder={nestedFolder}
                >
                  <main className="flex h-screen flex-col items-center justify-center">
                    {children}
                  </main>
                </ResizablePanelLayout>
                <Toaster />
              </RouteTransitionProvider>
            </NodeStoreProvider>
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
