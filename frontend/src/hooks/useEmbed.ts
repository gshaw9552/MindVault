import { useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import * as use from "@tensorflow-models/universal-sentence-encoder";

export function useEmbed() {
  const modelRef = useRef<use.UniversalSentenceEncoder | null>(null);

  // Load or return cached model
  async function loadModel() {
    if (!modelRef.current) {
      // Optional: tf.ready() ensures backend is initialized
      await tf.ready();
      modelRef.current = await use.load();
    }
    return modelRef.current;
  }

  // Embed a single string → 512-dim vector
  async function embed(text: string): Promise<number[]> {
    const model = await loadModel();
    const embeddings = await model.embed([text]);
    const array = await embeddings.array();
    return array[0];
  }

  return { embed };
}
