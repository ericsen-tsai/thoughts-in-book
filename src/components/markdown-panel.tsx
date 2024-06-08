"use client";

import { Pencil1Icon, EyeOpenIcon } from "@radix-ui/react-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { useRouteTransitionContext } from "@/contexts/route-transition-context";
import useDebounce from "@/hooks/useDebounce";
import { api } from "@/trpc/react";

import TooltipCompound from "./tooltip-compound";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useToast } from "./ui/use-toast";

type Props = {
  fileId?: string;
  fileContent?: string;
};

function MarkdownPanel({ fileId, fileContent: initialFileContent }: Props) {
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const { data: fileContent } = api.fileContent.get.useQuery(+(fileId ?? 0), {
    enabled: !!fileId,
    initialData: initialFileContent,
  });

  const { isRouteChanging } = useRouteTransitionContext();

  const { mutate: updateFileContent } = api.fileContent.update.useMutation();
  const [value, setValue] = useState<string>(fileContent ?? "");

  const debouncedCallback = useDebounce(updateFileContent, 500);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    debouncedCallback({ nodeId: +(fileId ?? 0), content: value });
  }, [value, fileId, debouncedCallback]);

  const { toast } = useToast();

  const showModeChangeHintToast = useCallback(
    (mode: "edit" | "preview") => {
      toast({
        title: `Switched to ${mode} mode`,
        description: `Press "Shift + Command + M" to switch back to ${
          mode === "edit" ? "preview" : "edit"
        } mode`,
      });
    },
    [toast],
  );

  const handleToggleMode = useCallback(
    (event: KeyboardEvent) => {
      // check if the Shift key && command Key and M are pressed
      if (event.shiftKey && event.metaKey && event.key === "m") {
        const nextMode = mode === "edit" ? "preview" : "edit";
        setMode(nextMode);
        showModeChangeHintToast(nextMode);
      }
    },
    [mode, showModeChangeHintToast],
  );

  useEffect(() => {
    if (mode === "edit") {
      setTimeout(() => {
        textAreaRef.current?.focus();
      }, 0);
    }
  }, [mode]);

  useEffect(() => {
    window.addEventListener("keydown", handleToggleMode);
    return () => {
      window.removeEventListener("keydown", handleToggleMode);
    };
  }, [handleToggleMode]);

  const renderMarkdownSection = useCallback(() => {
    if (mode === "preview") {
      return (
        <div className="prose prose-slate max-w-full dark:prose-invert">
          <Markdown remarkPlugins={[remarkGfm]}>{value}</Markdown>
        </div>
      );
    }
    return (
      <Textarea
        placeholder="Type your thoughts here."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="h-full w-full"
        ref={textAreaRef}
        onFocus={(e) =>
          e.currentTarget.setSelectionRange(
            e.currentTarget.value.length,
            e.currentTarget.value.length,
          )
        }
        disabled={isRouteChanging}
      />
    );
  }, [mode, value, isRouteChanging]);

  return (
    <div className="container h-full py-8">
      <div className="absolute right-0 top-1 flex gap-2 pr-2">
        <TooltipCompound content="Edit mode">
          <Button
            variant={mode === "edit" ? "default" : "ghost"}
            className={"size-6 px-1 py-0"}
            onClick={() => {
              setMode("edit");
              showModeChangeHintToast("edit");
            }}
          >
            <Pencil1Icon className="size-3" />
          </Button>
        </TooltipCompound>

        <TooltipCompound content="Preview mode">
          <Button
            variant={mode === "edit" ? "ghost" : "default"}
            className="size-6 px-1 py-0"
            onClick={() => {
              setMode("preview");
              showModeChangeHintToast("preview");
            }}
          >
            <EyeOpenIcon className="size-3" />
          </Button>
        </TooltipCompound>
      </div>
      {renderMarkdownSection()}
    </div>
  );
}

export default MarkdownPanel;
