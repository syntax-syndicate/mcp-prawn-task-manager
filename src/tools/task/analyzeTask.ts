import { z } from "zod";
import { getAnalyzeTaskPrompt } from "../../prompts/index.js";

// Problem Analysis Tool
export const analyzeTaskSchema = z.object({
  summary: z
    .string()
    .min(10, {
      message: "Task summary must be at least 10 characters long, please provide a more detailed description to ensure the task objective is clear",
    })
    .describe(
      "Structured task summary containing task objectives, scope, and key technical challenges, minimum 10 characters"
    ),
  initialConcept: z
    .string()
    .min(50, {
      message:
        "Initial solution concept must be at least 50 characters long, please provide more detailed content to ensure the technical solution is clear",
    })
    .describe(
      "Initial solution concept of at least 50 characters, including technical solution, architectural design, and implementation strategy. If code is needed, use pseudocode format and only provide high-level logic flow and key steps to avoid complete code"
    ),
  previousAnalysis: z
    .string()
    .optional()
    .describe("Analysis results from the previous iteration, used for continuous solution improvement (only required when re-analyzing)"),
});

export async function analyzeTask({
  summary,
  initialConcept,
  previousAnalysis,
}: z.infer<typeof analyzeTaskSchema>) {
  // Use prompt generator to get final prompt
  const prompt = getAnalyzeTaskPrompt({
    summary,
    initialConcept,
    previousAnalysis,
  });

  return {
    content: [
      {
        type: "text" as const,
        text: prompt,
      },
    ],
  };
}
