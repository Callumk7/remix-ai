import { ActionFunctionArgs, json } from "@remix-run/node";
import OpenAI from "openai";
import { FormEvent, useState } from "react";

export const action = async ({ request }: ActionFunctionArgs) => {
  const messages = await request.json();
  const ai = new OpenAI({
    apiKey: "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"
  });
  const completion = await ai.chat.completions.create({
    messages: messages,
    model: "gpt-3.5-turbo",
  });

  console.log(completion.choices)

  return json(completion);
};

export default function AiTestPage() {
  const [messages, setMessages] = useState([
    {
      role: "system",
      content:
        "You are going to take the input from the user, and respond with ideas for an adventure based on the words of the prompt",
    },
  ]);
  const [content, setContent] = useState("");
  const [response, setResponse] = useState({});

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessages([...messages, { role: "user", content: content }]);
    const response = await fetch("/ai", {
      method: "POST",
      body: JSON.stringify(messages)
    })

    setResponse(response);
  };

  return (
    <div>
      <div>{JSON.stringify(messages)}</div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="content"
          placeholder="Enter your prompt here"
          onChange={(e) => setContent(e.target.value)}
        />
        <button>Send</button>
      </form>
      <div>{JSON.stringify(response)}</div>
    </div>
  );
}
