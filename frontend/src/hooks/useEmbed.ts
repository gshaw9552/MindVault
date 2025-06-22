import { useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import * as use from "@tensorflow-models/universal-sentence-encoder";

export function useEmbed() {
  const modelRef = useRef<use.UniversalSentenceEncoder | null>(null);

  // Load or return cached model
  async function loadModel() {
    if (!modelRef.current) {
      await tf.ready();
      modelRef.current = await use.load();
    }
    return modelRef.current;
  }

  async function embed(text: string): Promise<number[]> {
    const model = await loadModel();
    const embeddings = await model.embed([text]);
    const array = await embeddings.array();
    return array[0];
  }

  return { embed };
}
