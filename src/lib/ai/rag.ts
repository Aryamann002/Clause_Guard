import { GoogleGenerativeAI } from "@google/generative-ai";
import kb from "./knowledgeBase.json";


let kbEmbeddingsCache: { id: string; embedding: number[] }[] | null = null;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

function cosineSimilarity(vecA: number[], vecB: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}


export async function retrieveContext(query: string, category?: string) {
  try {
    
    
    
    const queryLower = query.toLowerCase();
    
    let filteredKb = kb;
    if (queryLower.includes("rent") || queryLower.includes("lease")) {
       filteredKb = kb.filter(k => k.act_name.includes("Transfer of Property"));
    } else if (queryLower.includes("consumer") || queryLower.includes("unfair")) {
       filteredKb = kb.filter(k => k.act_name.includes("Consumer"));
    } else {
       
       filteredKb = kb.filter(k => k.act_name.includes("Contract"));
    }

    
    if (filteredKb.length === 0) filteredKb = kb;

    
    
    
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    
    
    if (!kbEmbeddingsCache) {
      kbEmbeddingsCache = await Promise.all(
        kb.map(async (entry) => {
          const content = `${entry.keywords.join(", ")}: ${entry.text}`;
          const result = await model.embedContent(content);
          const embedding = result.embedding.values;
          return { id: entry.id, embedding };
        })
      );
    }

    const queryResult = await model.embedContent(query);
    const queryEmbedding = queryResult.embedding.values;

    
    const scoredChunks = filteredKb.map((entry) => {
      const cached = kbEmbeddingsCache!.find(c => c.id === entry.id);
      let score = 0;
      if (cached) {
         score = cosineSimilarity(queryEmbedding, cached.embedding);
      }
      return { ...entry, score };
    });

    
    scoredChunks.sort((a, b) => b.score - a.score);

    
    return scoredChunks.filter(c => c.score > 0.6).slice(0, 2);
  } catch (error) {
    console.error("RAG Retrieval Error:", error);
    return []; 
  }
}
