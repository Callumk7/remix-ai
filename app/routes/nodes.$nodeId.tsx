import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "db";
import { nodeLinks, nodes } from "db/schema";
import { eq } from "drizzle-orm";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const nodeId = params.nodeId;
  const nodeWithNodes = await db.query.nodes.findFirst({
    where: eq(nodes.id, Number(nodeId)),
    with: {
      from: {
        with: {
          to: true,
        },
      },
      to: {
        with: {
          from: true,
        },
      },
    },
  });

  return json({ nodeWithNodes });
};

export default function NodePage() {
  const { nodeWithNodes } = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>This is the node page</h1>
      <div className="whitespace-pre">{JSON.stringify(nodeWithNodes, null, 2)}</div>
    </div>
  );
}
