import { z } from "zod";
import {
  getTaskById,
  deleteTask as modelDeleteTask,
} from "../../models/taskModel.js";
import { TaskStatus } from "../../types/index.js";
import { getDeleteTaskPrompt } from "../../prompts/index.js";

// Delete Task Tool
export const deleteTaskSchema = z.object({
  taskId: z
    .string()
    .uuid({ message: "Invalid task ID format, please provide a valid UUID" })
    .describe("Unique identifier of the task to be deleted, must be an existing and unfinished task ID in the system"),
});

export async function deleteTask({ taskId }: z.infer<typeof deleteTaskSchema>) {
  const task = await getTaskById(taskId);

  if (!task) {
    return {
      content: [
        {
          type: "text" as const,
          text: getDeleteTaskPrompt({ taskId }),
        },
      ],
      isError: true,
    };
  }

  if (task.status === TaskStatus.COMPLETED) {
    return {
      content: [
        {
          type: "text" as const,
          text: getDeleteTaskPrompt({ taskId, task, isTaskCompleted: true }),
        },
      ],
      isError: true,
    };
  }

  const result = await modelDeleteTask(taskId);

  return {
    content: [
      {
        type: "text" as const,
        text: getDeleteTaskPrompt({
          taskId,
          task,
          success: result.success,
          message: result.message,
        }),
      },
    ],
    isError: !result.success,
  };
}
