import { ActionFunctionArgs, json } from "@remix-run/node";
import { db } from "db";
import { nodeLinks } from "db/schema";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const from = formData.get("from");
  const to = formData.get("to");

  const newConnection = await db.insert(nodeLinks).values({
    fromId: Number(from?.toString()),
    toId: Number(to?.toString()),
  });

  return json({ newConnection });
};
