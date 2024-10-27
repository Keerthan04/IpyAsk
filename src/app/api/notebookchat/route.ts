import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { Message, StreamData, streamText } from "ai";
import { getContext } from "@/lib/context";

// Allow streaming responses up to 60 seconds
export const maxDuration = 60;

const google = createGoogleGenerativeAI({
  baseURL: "https://generativelanguage.googleapis.com/v1beta",
  apiKey: process.env.GEMINI_API_KEY,
});

const model = google("models/gemini-1.5-pro-latest", {
  safetySettings: [
    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
  ],
});

export async function POST(req: Request) {
  const reqBody = await req.json();
  console.log(reqBody);
  const namespace = reqBody.data.namespace;
  const messages: Message[] = reqBody.messages;
  const userQuestion = `${messages[messages.length - 1].content}`;

  // Modified query to focus on Python/Jupyter notebook content
  const query = `Find relevant code cells and markdown explanations for: ${userQuestion}`;

  const context = await getContext(query, namespace);
  console.log("Context from notebook:", context);

  const finalPrompt = `You are an expert Python programming assistant analyzing a Jupyter notebook.
  Your task is to help users understand and work with the code in their notebook.

  Context from the notebook (including code cells and markdown):
  ${context}

  User Question:
  ${userQuestion}

  Please provide a detailed response that:
  1. References specific code cells and explanations from the notebook when relevant
  2. Explains the code's functionality and purpose
  3. Suggests improvements or best practices if applicable
  4. Answers any specific questions about implementation details
  5. Provides explanations that match the user's apparent level of understanding
  6. If the context doesn't contain enough information to fully answer the question,
     mention what additional information would be helpful and also if some helpful codes for improvement can be given

  Technical Response:`;

  const data = new StreamData();
  data.append({
    retrievals: context,
  });

  const result = await streamText({
    model: model,
    prompt: finalPrompt,
    async onFinish() {
      data.close();
    },
  });

  return result.toDataStreamResponse({ data });
}
