export type NodeType = "folder" | "file";

export type Node = {
  name: string;
  type: NodeType;
  children?: Node[];
};

// create a type for path like "0.children.0" or "0.children.1.children.0 with literal type "string"
export type Path = string;
