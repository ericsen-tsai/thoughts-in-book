import { forwardRef, useState, type ForwardedRef } from "react";

import { cn } from "@/lib/utils";

import { Input } from "./ui/input";

type Props = {
  name: string;
  onNameChange: (name: string) => void;
  onEditConfirm: () => void;
  className?: string;
};

const FolderFileInput = forwardRef(
  (
    { name, onNameChange, onEditConfirm, className }: Props,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    const [isComposing, setIsComposing] = useState(false);
    return (
      <Input
        className={cn("h-5 p-1", className)}
        value={name}
        onChange={(e) => {
          onNameChange(e.target.value);
        }}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
        onBlur={() => onEditConfirm()}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !isComposing) {
            onEditConfirm();
          }
        }}
        ref={ref}
        type="text"
      />
    );
  },
);

FolderFileInput.displayName = "FolderFileInput";

export default FolderFileInput;
