import { eq } from "drizzle-orm";

import { ROOT_ID } from "@/constants/nodeId";
import { db } from "@/db";
import { children, fileContents, nodes } from "@/db/schema";
import { type Node, type NodeType } from "@/types/node";

const getNode = async (id: number) => {
  const node = await db
    .select({ id: nodes.id, name: nodes.name, type: nodes.type })
    .from(nodes)
    .where(eq(nodes.id, id))
    .execute();
  return node[0];
};

export const getNodes = async (): Promise<Omit<Node, "children">[]> => {
  const selectedNodes = await db
    .select({ id: nodes.id, name: nodes.name, type: nodes.type })
    .from(nodes)
    .execute();
  return selectedNodes.map((node) => ({
    id: node.id,
    name: node.name,
    type: node.type as NodeType,
  }));
};

const getChildNodes = async (parentId: number) => {
  const childNodeIds = await db
    .select({ childId: children.childId })
    .from(children)
    .where(eq(children.parentId, parentId))
    .execute();
  return childNodeIds.map((row: { childId: number }) => row.childId);
};

const buildTree = async (id: number): Promise<Node> => {
  const node = await getNode(id);
  const childIds = await getChildNodes(id);

  if (!node) {
    throw new Error(`Node with id ${id} not found`);
  }

  if (childIds.length === 0) {
    return {
      ...node,
      type: node.type as NodeType,
    };
  }

  const children = (await Promise.all(childIds.map(buildTree))).filter(
    (child): child is Node => !!child,
  );

  return {
    ...node,
    children,
    type: node.type as NodeType,
  };
};

export const getNestedFolder = async (): Promise<Node> => {
  return await buildTree(ROOT_ID);
};

export const insertNode = async ({
  name,
  type,
  parentId,
}: {
  name: string;
  type: NodeType;
  parentId: number;
}) => {
  const result = await db
    .insert(nodes)
    .values({
      name,
      type,
    })
    .returning();

  const nodeId = result[0]?.id;

  if (!nodeId) {
    throw new Error("Failed to insert node");
  }

  await db.insert(children).values({
    parentId,
    childId: nodeId,
  });

  if (type === "file") {
    await db.insert(fileContents).values({
      nodeId,
      content: "",
    });
  }

  return { id: nodeId, name, type, parentId };
};

export const updateNode = async ({
  id,
  name,
  type,
}: {
  id: number;
  name: string;
  type: NodeType;
}) => {
  await db.update(nodes).set({ name, type }).where(eq(nodes.id, id)).execute();

  return { id, name, type };
};

export const deleteNode = async ({ id }: { id: number }) => {
  const childIds = await getChildNodes(id);
  for (const childId of childIds) {
    await deleteNode({ id: childId });
  }

  await db.delete(children).where(eq(children.childId, id)).execute();
  await db.delete(children).where(eq(children.parentId, id)).execute();
  await db.delete(fileContents).where(eq(fileContents.nodeId, id)).execute();
  await db.delete(nodes).where(eq(nodes.id, id)).execute();
};

export const getFileContent = async (nodeId: number) => {
  const content = await db
    .select({ content: fileContents.content })
    .from(fileContents)
    .where(eq(fileContents.nodeId, nodeId))
    .execute();

  return content[0]?.content;
};

export const updateFileContent = async ({
  nodeId,
  content,
}: {
  nodeId: number;
  content: string;
}) => {
  await db
    .update(fileContents)
    .set({ content })
    .where(eq(fileContents.nodeId, nodeId))
    .execute();

  return { nodeId, content };
};
