export function cosineSimilarity(vec1, vec2) {
  const dotProduct = vec1.reduce((sum, v, i) => sum + v * vec2[i], 0);
  const magnitudeA = Math.sqrt(vec1.reduce((sum, v) => sum + v * v, 0));
  const magnitudeB = Math.sqrt(vec2.reduce((sum, v) => sum + v * v, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

export default function findSimilarPrompt(prompts, newEmbedding) {
  let bestMatch = null;
  let bestSimilarity = 0;

  for (const prompt of prompts) {
    const similarity = cosineSimilarity(newEmbedding, prompt.embedding);
    if (similarity > bestSimilarity) {
      bestSimilarity = similarity;
      bestMatch = prompt;
    }
  }

  return bestSimilarity > 0.95
    ? { bestMatch, bestSimilarity }
    : { bestMatch: null, bestSimilarity };
}
