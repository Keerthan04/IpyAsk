import { getEmbeddings } from "./embedding";
import { getPineconeClient } from "./pinecone";

export async function getContext(message: string, namespace: string) {
  try {
    console.log("inside the get context function \n");
    const embeddings = await getEmbeddings(message);
    console.log(
      "got embeddings in the context function Initializing the pinecone client\n"
    );
    const client = getPineconeClient();
    const index = client.Index(process.env.PINECONE_INDEX!);
    const pinecone_namespace = index.namespace(namespace);

    console.log(
      "got pinecone namespace in the context function calling query\n"
    );
    const queryResult = await pinecone_namespace.query({
      topK: 5,
      vector: embeddings,
      includeMetadata: true,
      includeValues: false,
    });
    console.log("got query result in the context function \n", queryResult);
    const matches = queryResult.matches || [];
    const docs = matches.map((match) => match?.metadata?.text);
    console.log("got docs in the context function \n", docs);
    return docs.join("\n").substring(0, 3000); //for context length
  } catch (error) {
    console.log("error while getting context", error);
    throw error;
  }
}
