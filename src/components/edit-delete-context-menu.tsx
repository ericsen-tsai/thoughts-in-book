"use client";

import {
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/ui/context-menu";

type Props = {
  onEdit: () => void;
  onDelete: () => void;
};

function EditDeleteContextMenu({ onEdit, onDelete }: Props) {
  return (
    <ContextMenuContent className="w-12">
      <ContextMenuItem onClick={onEdit}>Edit</ContextMenuItem>
      <ContextMenuItem onClick={onDelete}>Delete</ContextMenuItem>
    </ContextMenuContent>
  );
}

export default EditDeleteContextMenu;
