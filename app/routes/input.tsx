// Here, we are going to create a form that can add nodes to the database. In addition, we will
// will also have a form that can connect two nodes together.

import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { db } from "db";
import { nodes } from "db/schema";
import invariant from "tiny-invariant";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const body = formData.get("body");
  const type = formData.get("type");

  invariant(body, "No body provided");
  invariant(type, "No type provided");

  const newNode = await db.insert(nodes).values({
    body: body.toString(),
    type: type.toString(),
  });

  return json({ newNode });
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const nodes = await db.query.nodes.findMany();
  const links = await db.query.nodeLinks.findMany();

  return json({ nodes, links });
};

export default function InputPage() {
  const { nodes, links } = useLoaderData<typeof loader>();

  const fetcher = useFetcher();
  return (
    <div>
      <h1>Input page</h1>
      <div className="grid grid-cols-3 gap-5">
        {nodes.map((node) => (
          <div key={node.id}>{node.body}</div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-5">
        {links.map((link, i) => (
          <div key={i}>
            <p>from {link.fromId}</p>
            <p>to {link.toId}</p>
          </div>
        ))}
      </div>
      <div>
        <h2>Add a new node</h2>
        <form method="POST">
          <textarea name="body" placeholder="write a node" />
          <input type="hidden" name="type" value="misc" />
          <button type="submit">Create</button>
        </form>
      </div>
      <div>
        <h2>Connect two nodes</h2>
        <fetcher.Form method="POST" action="/input/connect">
          <select name="from">
            {nodes.map((node) => (
              <option key={node.id} value={node.id}>
                {node.id}
              </option>
            ))}
          </select>
          <select name="to">
            {nodes.map((node) => (
              <option key={node.id} value={node.id}>
                {node.id}
              </option>
            ))}
          </select>
          <button type="submit">Create Link</button>
        </fetcher.Form>
      </div>
    </div>
  );
}
