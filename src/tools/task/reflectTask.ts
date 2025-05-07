import { z } from "zod";
import { getReflectTaskPrompt } from "../../prompts/index.js";

// Reflection Concept Tool
export const reflectTaskSchema = z.object({
  summary: z
    .string()
    .min(10, {
      message: "Task summary must be at least 10 characters long, please provide a more detailed description to ensure the task objective is clear",
    })
    .describe("Structured task summary, maintaining consistency with the analysis phase to ensure continuity"),
  analysis: z
    .string()
    .min(100, {
      message: "Technical analysis content is not comprehensive enough, please provide a complete technical analysis and implementation plan",
    })
    .describe(
      "Comprehensive and detailed technical analysis results, including all technical details, dependency components, and implementation plan. If code is needed, use pseudocode format and only provide high-level logic flow and key steps to avoid complete code"
    ),
});

export async function reflectTask({
  summary,
  analysis,
}: z.infer<typeof reflectTaskSchema>) {
  // Use prompt generator to get final prompt
  const prompt = getReflectTaskPrompt({
    summary,
    analysis,
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
