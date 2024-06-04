"use client";

import { Pencil1Icon, EyeOpenIcon } from "@radix-ui/react-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

function MarkdownPanel() {
  const [mode, setMode] = useState<"edit" | "preview">("edit");

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const [value, setValue] = useState<string>("");

  const handleToggleMode = useCallback((event: KeyboardEvent) => {
    // check if the Shift key && command Key and M are pressed
    if (event.shiftKey && event.metaKey && event.key === "m") {
      setMode((prev) => (prev === "edit" ? "preview" : "edit"));
    }
  }, []);

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
        <div className="prose lg:prose-xl prose-slate dark:prose-invert">
          <Markdown remarkPlugins={[remarkGfm]}>{value}</Markdown>
        </div>
      );
    }
    return (
      <Textarea
        placeholder="Type your message here."
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
      />
    );
  }, [mode, value]);

  return (
    <div className="container h-full py-8">
      <div className="absolute right-0 top-1 flex gap-2 pr-2">
        <Button
          variant={"ghost"}
          className="size-6 px-1 py-0"
          onClick={() => {
            setMode("edit");
          }}
        >
          <Pencil1Icon className="size-3" />
        </Button>
        <Button
          variant={"ghost"}
          className="size-6 px-1 py-0"
          onClick={() => {
            setMode("preview");
          }}
        >
          <EyeOpenIcon className="size-3" />
        </Button>
      </div>
      {renderMarkdownSection()}
    </div>
  );
}

export default MarkdownPanel;
