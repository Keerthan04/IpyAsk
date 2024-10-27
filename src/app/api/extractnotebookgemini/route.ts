import { getEmbeddings } from "@/lib/embedding";
// import { GoogleGenerativeAI } from "@google/generative-ai";
import { Pinecone } from "@pinecone-database/pinecone";

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
// const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

export async function POST(req: Request) {
  try {
    const { base64 } = await req.json();
    console.log("base 64 is \n",base64)
    const notebookContent = base64ToNotebookContent(base64);
    const namespace = generateUniqueId();
    const index = pc.index("notebookhelper");

    const chunks = chunkNotebookContent(notebookContent);
    console.log(`Created ${chunks.length} chunks`);
    const embeddings = await embedChunks(chunks);
    console.log("embedding done")
    const vectors = chunks.map((chunk, idx) => ({
      "id": generateUniqueId(),
      "values": embeddings[idx],
      "metadata": {
        text: chunk,
      },
    }));
    console.log("vectors are \n",vectors)
    console.log("index sending")
    await index.namespace(namespace).upsert(vectors);

    return new Response(
      JSON.stringify({
        message: "Notebook content stored successfully.",
        namespace,
        chunksInserted: chunks.length,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Failed to process notebook content",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

function base64ToNotebookContent(base64: string): string {
  try {
    console.log("entered base64 to notebook content \n");
    const jsonData = Buffer.from(base64, "base64").toString("utf-8");
    const notebook = JSON.parse(jsonData);
    console.log(
      "Notebook structure:",
      JSON.stringify(notebook.cells[0], null, 2)
    ); // Log first cell structure

    return notebook.cells
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((cell: any) => {
        const source = Array.isArray(cell.source)
          ? cell.source.join(" ")
          : cell.source;

        if (cell.cell_type === "code") {
          return `Code: ${source}`;
        } else if (cell.cell_type === "markdown") {
          return `Markdown: ${source}`;
        }
        return "";
      })
      .join("\n");
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to parse notebook content: ${error}`);
  }
}

function chunkNotebookContent(
  content: string,
  chunkSize: number = 300
): string[] {
  const chunks: string[] = [];
  let currentChunk = "";
  // let currentSentence = "";

  // Split content into sentences (roughly)
  const sentences = content.replace(/([.!?])\s+/g, "$1|").split("|");

  for (const sentence of sentences) {
    // If adding this sentence would exceed chunk size
    if ((currentChunk + sentence).length > chunkSize) {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
      }
      // If the sentence itself is longer than chunk size, split it
      if (sentence.length > chunkSize) {
        let remainingSentence = sentence;
        while (remainingSentence.length > 0) {
          const chunk = remainingSentence.slice(0, chunkSize);
          chunks.push(chunk.trim());
          remainingSentence = remainingSentence.slice(chunkSize);
        }
        currentChunk = "";
      } else {
        currentChunk = sentence;
      }
    } else {
      currentChunk += (currentChunk ? " " : "") + sentence;
    }
  }

  // Add the last chunk if it exists
  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  // Validate chunks
  return chunks
    .filter((chunk) => chunk.length > 0)
    .map((chunk) => {
      if (chunk.length > chunkSize) {
        return chunk.slice(0, chunkSize);
      }
      return chunk;
    });
}

async function embedChunks(chunks: string[]) {
  try {
    const embeddings = await Promise.all(
      chunks.map(async (chunk) => {
        const indiEmbedding = getEmbeddings(chunk);
        return indiEmbedding;
      })
    )
    return embeddings;
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to generate embeddings \n${error}`);
  }
}

function generateUniqueId(): string {
  return `notebook-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
