import { type Node } from "@/types/node";

import { children, nodes } from "./schema";

import { db } from ".";

let idCounter = 0;
const generateId = () => {
  idCounter += 1;
  return idCounter;
};

const rootFolder: Node = {
  id: generateId(),
  name: "root",
  type: "folder",
};

const insertNode = async (node: Node, parentId: number | null = null) => {
  // Insert node
  const result = await db
    .insert(nodes)
    .values({
      id: Number(node.id), // Convert the id to a number
      name: node.name,
      type: node.type,
    })
    .returning();

  const nodeId = result[0]?.id;

  // Insert relationship if there is a parent
  if (parentId !== null && nodeId) {
    await db.insert(children).values({
      parentId,
      childId: nodeId,
    });
  }

  // Recursively insert children
  if (node.children) {
    for (const child of node.children) {
      await insertNode(child, nodeId);
    }
  }
};

const seed = async () => {
  console.log("Seeding...");
  await insertNode(rootFolder);
};

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    console.log("Seeding done!");
    process.exit(0);
  });
