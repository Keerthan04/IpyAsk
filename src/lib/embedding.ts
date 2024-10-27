import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
export async function getEmbeddings(query: string) {
  console.log("inside the getEmbeddings function \n");
  const result = await model.embedContent(query);
  const embedding = result.embedding;
  const embedding_values = embedding.values;
  console.log("embedding done \n");
  return embedding_values;
}
