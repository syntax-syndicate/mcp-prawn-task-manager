import { z } from "zod";
import {
  getTaskById,
  updateTaskStatus,
  updateTaskSummary,
} from "../../models/taskModel.js";
import { TaskStatus } from "../../types/index.js";
import { getVerifyTaskPrompt } from "../../prompts/index.js";

// Task Verification Tool
export const verifyTaskSchema = z.object({
  taskId: z
    .string()
    .uuid({ message: "Invalid task ID format, please provide a valid UUID" })
    .describe("Unique identifier of the task to be verified, must be an existing valid task ID in the system"),
  summary: z
    .string()
    .min(30, {
      message: "At least 30 characters",
    })
    .describe(
      "Task completion summary when score is 80 or above, concisely describing implementation results and key decisions. When score is below 80, describes missing or needs-correction parts, minimum 30 characters"
    ),
  score: z
    .number()
    .min(0, { message: "Score cannot be less than 0" })
    .max(100, { message: "Score cannot be greater than 100" })
    .describe("Score for the task, automatically completes the task when score is equal to or above 80"),
});

export async function verifyTask({
  taskId,
  summary,
  score,
}: z.infer<typeof verifyTaskSchema>) {
  const task = await getTaskById(taskId);

  if (!task) {
    return {
      content: [
        {
          type: "text" as const,
          text: `## System Error\n\nCannot find task with ID \`${taskId}\`. Please use the "list_tasks" tool to confirm a valid task ID and try again.`,
        },
      ],
      isError: true,
    };
  }

  if (task.status !== TaskStatus.IN_PROGRESS) {
    return {
      content: [
        {
          type: "text" as const,
          text: `## Status Error\n\nTask "${task.name}" (ID: \`${task.id}\`) is currently in "${task.status}" status and cannot be verified.\n\nOnly tasks in "In Progress" status can be verified. Please first use the "execute_task" tool to start task execution.`,
        },
      ],
      isError: true,
    };
  }

  if (score >= 80) {
    // Update task status to completed and add summary
    await updateTaskSummary(taskId, summary);
    await updateTaskStatus(taskId, TaskStatus.COMPLETED);
  }

  // Use prompt generator to get final prompt
  const prompt = getVerifyTaskPrompt({ task, score, summary });

  return {
    content: [
      {
        type: "text" as const,
        text: prompt,
      },
    ],
  };
}
