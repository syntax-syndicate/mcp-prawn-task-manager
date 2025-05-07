import { z } from "zod";
import {
  getTaskById,
  updateTaskContent as modelUpdateTaskContent,
} from "../../models/taskModel.js";
import { RelatedFileType } from "../../types/index.js";
import { getUpdateTaskContentPrompt } from "../../prompts/index.js";

// Task Content Update Tool
export const updateTaskContentSchema = z.object({
  taskId: z
    .string()
    .uuid({ message: "Invalid task ID format, please provide a valid UUID" })
    .describe("Unique identifier of the task to be updated, must be an existing and unfinished task ID in the system"),
  name: z.string().optional().describe("New task name (optional)"),
  description: z.string().optional().describe("New task description content (optional)"),
  notes: z.string().optional().describe("New task supplementary notes (optional)"),
  dependencies: z
    .array(z.string())
    .optional()
    .describe("New task dependencies (optional)"),
  relatedFiles: z
    .array(
      z.object({
        path: z
          .string()
          .min(1, { message: "File path cannot be empty, please provide a valid file path" })
          .describe("File path, which can be relative to the project root directory or an absolute path"),
        type: z
          .nativeEnum(RelatedFileType)
          .describe(
            "Relationship type between file and task (TO_MODIFY, REFERENCE, CREATE, DEPENDENCY, OTHER)"
          ),
        description: z.string().optional().describe("File supplementary description (optional)"),
        lineStart: z
          .number()
          .int()
          .positive()
          .optional()
          .describe("Starting line of the related code block (optional)"),
        lineEnd: z
          .number()
          .int()
          .positive()
          .optional()
          .describe("Ending line of the related code block (optional)"),
      })
    )
    .optional()
    .describe(
      "List of files related to the task, used to record code files, reference materials, files to be created, etc. (optional)"
    ),
  implementationGuide: z
    .string()
    .optional()
    .describe("New task implementation guide (optional)"),
  verificationCriteria: z
    .string()
    .optional()
    .describe("New task verification standards (optional)"),
});

export async function updateTaskContent({
  taskId,
  name,
  description,
  notes,
  relatedFiles,
  dependencies,
  implementationGuide,
  verificationCriteria,
}: z.infer<typeof updateTaskContentSchema>) {
  if (relatedFiles) {
    for (const file of relatedFiles) {
      if (
        (file.lineStart && !file.lineEnd) ||
        (!file.lineStart && file.lineEnd) ||
        (file.lineStart && file.lineEnd && file.lineStart > file.lineEnd)
      ) {
        return {
          content: [
            {
              type: "text" as const,
              text: getUpdateTaskContentPrompt({
                taskId,
                validationError:
                  "Invalid line number setting: both start and end lines must be set, and the start line must be less than the end line",
              }),
            },
          ],
        };
      }
    }
  }

  if (
    !(
      name ||
      description ||
      notes ||
      dependencies ||
      implementationGuide ||
      verificationCriteria ||
      relatedFiles
    )
  ) {
    return {
      content: [
        {
          type: "text" as const,
          text: getUpdateTaskContentPrompt({
            taskId,
            emptyUpdate: true,
          }),
        },
      ],
    };
  }

  // Get task to check if it exists
  const task = await getTaskById(taskId);

  if (!task) {
    return {
      content: [
        {
          type: "text" as const,
          text: getUpdateTaskContentPrompt({
            taskId,
          }),
        },
      ],
      isError: true,
    };
  }

  // Record task and content to be updated
  let updateSummary = `Preparing to update task: ${task.name} (ID: ${task.id})`;
  if (name) updateSummary += `, New name: ${name}`;
  if (description) updateSummary += `, Update description`;
  if (notes) updateSummary += `, Update notes`;
  if (relatedFiles)
    updateSummary += `, Update related files (${relatedFiles.length})`;
  if (dependencies)
    updateSummary += `, Update dependencies (${dependencies.length})`;
  if (implementationGuide) updateSummary += `, Update implementation guide`;
  if (verificationCriteria) updateSummary += `, Update verification standards`;

  // Execute update operation
  const result = await modelUpdateTaskContent(taskId, {
    name,
    description,
    notes,
    relatedFiles,
    dependencies,
    implementationGuide,
    verificationCriteria,
  });

  return {
    content: [
      {
        type: "text" as const,
        text: getUpdateTaskContentPrompt({
          taskId,
          task,
          success: result.success,
          message: result.message,
          updatedTask: result.task,
        }),
      },
    ],
    isError: !result.success,
  };
}
