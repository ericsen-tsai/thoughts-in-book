"use client";

import { Pencil1Icon, EyeOpenIcon } from "@radix-ui/react-icons";
import { setCookie } from "cookies-next";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
} from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { MODE_COOKIE } from "@/constants/mode";
import { useRouteTransitionContext } from "@/contexts/route-transition-context";
import useDebounce from "@/hooks/useDebounce";
import { uploadFiles } from "@/lib/uploadthing";
import { useNodeStore } from "@/providers/node-store-provider";
import { api } from "@/trpc/react";
import { type Mode } from "@/types/mode";

import TooltipCompound from "./tooltip-compound";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useToast } from "./ui/use-toast";

type Props = {
  fileId?: string;
  defaultFileContent?: string;
  defaultMode?: Mode;
  defaultSelectedPath?: string;
};

function MarkdownPanel({
  fileId,
  defaultFileContent,
  defaultMode,
  defaultSelectedPath,
}: Props) {
  const [mode, setMode] = useState<Mode>(defaultMode ?? "edit");
  const { onSelectedPathChange, selectedPath } = useNodeStore((state) => ({
    onSelectedPathChange: state.onSelectedPathChange,
    selectedPath: state.selectedPath,
  }));

  useEffect(() => {
    if (defaultSelectedPath && selectedPath !== defaultSelectedPath) {
      onSelectedPathChange(defaultSelectedPath);
      window.history.replaceState(null, "", `/${fileId}`);
    }
  }, [defaultSelectedPath, onSelectedPathChange, selectedPath, fileId]);

  const [pasteCursorPosition, setPasteCursorPosition] = useState<number | null>(
    null,
  );

  const { data: fileContent } = api.fileContent.get.useQuery(+(fileId ?? 0), {
    enabled: !!fileId,
    initialData: defaultFileContent,
  });

  const { isRouteChanging } = useRouteTransitionContext();

  const { mutate: updateFileContent } = api.fileContent.update.useMutation();
  const [value, setValue] = useState<string>(fileContent ?? "");

  const debouncedCallback = useDebounce(updateFileContent, 500);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    debouncedCallback({ nodeId: +(fileId ?? 0), content: value.trim() });
  }, [value, fileId, debouncedCallback]);

  const { toast } = useToast();

  const handleModeChange = useCallback(
    (mode: Mode) => {
      setMode(mode);
      toast({
        title: `Switched to ${mode} mode`,
        description: `Press "Shift + Command + M" to switch back to ${
          mode === "edit" ? "preview" : "edit"
        } mode`,
      });
      setCookie(MODE_COOKIE, JSON.stringify(mode));
    },
    [toast],
  );

  const handleToggleMode = useCallback(
    (event: KeyboardEvent) => {
      // check if the Shift key && command Key and M are pressed
      if (event.shiftKey && event.metaKey && event.key === "m") {
        const nextMode = mode === "edit" ? "preview" : "edit";
        handleModeChange(nextMode);
      }
    },
    [mode, handleModeChange],
  );

  useEffect(() => {
    // Focus on the textarea when in edit mode
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

  const insertImageMarkdown = (url: string) => {
    if (!textAreaRef.current) return;
    const textAreaCursorPosition = textAreaRef.current.selectionStart;
    const imageMarkdown = `![Image](${url})`;
    setValue((prevValue) => {
      const newValue = `${prevValue.slice(0, textAreaCursorPosition)}${imageMarkdown}${prevValue.slice(textAreaCursorPosition)}`;
      return newValue;
    });
    // Set the cursor position to the end of the pasted image markdown
    setPasteCursorPosition(textAreaCursorPosition + imageMarkdown.length);
  };

  useEffect(() => {
    if (pasteCursorPosition !== null && textAreaRef.current) {
      // Set the cursor position to the end of the pasted image markdown
      textAreaRef.current.setSelectionRange(
        pasteCursorPosition,
        pasteCursorPosition,
      );
      setPasteCursorPosition(null);
    }
  }, [pasteCursorPosition]);

  const uploadImage = async (file: File) => {
    const res = await uploadFiles("imageUploader", {
      files: [file],
    });
    return res[0]?.serverData.fileUrl;
  };

  const handlePaste = useCallback(
    async (event: ClipboardEvent<HTMLTextAreaElement>) => {
      const clipboardData = event.clipboardData;
      const items = clipboardData.items;

      for (const item of items) {
        if (item.type.indexOf("image") === -1) continue;
        const file = item.getAsFile();
        if (!file) continue;

        const imageUrl = await uploadImage(file);
        if (!imageUrl) continue;
        insertImageMarkdown(imageUrl);
        toast({
          title: "Image uploaded",
          description: "The image has been uploaded successfully.",
        });
        event.preventDefault();
      }
    },
    [toast],
  );

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
        onChange={(e) => {
          setValue(e.target.value);
          setPasteCursorPosition(null);
        }}
        className="h-full w-full"
        ref={textAreaRef}
        onFocus={(e) => {
          e.currentTarget.setSelectionRange(
            e.currentTarget.value.length,
            e.currentTarget.value.length,
          );
        }}
        disabled={isRouteChanging}
        onPaste={handlePaste}
      />
    );
  }, [mode, value, isRouteChanging, handlePaste]);

  return (
    <div className="container h-full overflow-y-auto py-8">
      <div className="absolute right-5 top-1 flex gap-2 pr-2">
        <TooltipCompound content="Edit mode">
          <Button
            variant={mode === "edit" ? "default" : "ghost"}
            className={"size-6 px-1 py-0"}
            onClick={() => {
              handleModeChange("edit");
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
              handleModeChange("preview");
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
