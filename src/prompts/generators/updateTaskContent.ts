/**
 * updateTaskContent prompt generator
 * Responsible for combining templates and parameters into the final prompt
 */

import {
  loadPrompt,
  generatePrompt,
  loadPromptFromTemplate,
} from "../loader.js";
import { Task, RelatedFile } from "../../types/index.js";

/**
 * updateTaskContent prompt parameter interface
 */
export interface UpdateTaskContentPromptParams {
  taskId: string;
  task?: Task;
  success?: boolean;
  message?: string;
  validationError?: string;
  emptyUpdate?: boolean;
  updatedTask?: Task;
}

/**
 * Get the full prompt for updateTaskContent
 * @param params prompt parameters
 * @returns generated prompt
 */
export function getUpdateTaskContentPrompt(
  params: UpdateTaskContentPromptParams
): string {
  const {
    taskId,
    task,
    success,
    message,
    validationError,
    emptyUpdate,
    updatedTask,
  } = params;

  // Handle scenario where task does not exist
  if (!task) {
    const notFoundTemplate = loadPromptFromTemplate(
      "updateTaskContent/notFound.md"
    );
    return generatePrompt(notFoundTemplate, {
      taskId,
    });
  }

  // Handle validation error scenario
  if (validationError) {
    const validationTemplate = loadPromptFromTemplate(
      "updateTaskContent/validation.md"
    );
    return generatePrompt(validationTemplate, {
      error: validationError,
    });
  }

  // Handle empty update scenario
  if (emptyUpdate) {
    const emptyUpdateTemplate = loadPromptFromTemplate(
      "updateTaskContent/emptyUpdate.md"
    );
    return generatePrompt(emptyUpdateTemplate, {});
  }

  // Handle update success or failure scenario
  const responseTitle = success ? "Success" : "Failure";
  let content = message || "";

  // Update successful and task details available
  if (success && updatedTask) {
    const successTemplate = loadPromptFromTemplate(
      "updateTaskContent/success.md"
    );

    // Combine related file information
    let filesContent = "";
    if (updatedTask.relatedFiles && updatedTask.relatedFiles.length > 0) {
      const fileDetailsTemplate = loadPromptFromTemplate(
        "updateTaskContent/fileDetails.md"
      );

      // Group by file type
      const filesByType = updatedTask.relatedFiles.reduce((acc, file) => {
        if (!acc[file.type]) {
          acc[file.type] = [];
        }
        acc[file.type].push(file);
        return acc;
      }, {} as Record<string, RelatedFile[]>);

      // Generate content for each file type
      for (const [type, files] of Object.entries(filesByType)) {
        const filesList = files.map((file) => `\`${file.path}\``).join(", ");
        filesContent += generatePrompt(fileDetailsTemplate, {
          fileType: type,
          fileCount: files.length,
          filesList,
        });
      }
    }

    // Handle task notes
    const taskNotesPrefix = "- **Notes:** ";
    const taskNotes = updatedTask.notes
      ? `${taskNotesPrefix}${
          updatedTask.notes.length > 100
            ? `${updatedTask.notes.substring(0, 100)}...`
            : updatedTask.notes
        }\n`
      : "";

    // Generate detailed information for successful update
    content += generatePrompt(successTemplate, {
      taskName: updatedTask.name,
      taskDescription:
        updatedTask.description.length > 100
          ? `${updatedTask.description.substring(0, 100)}...`
          : updatedTask.description,
      taskNotes: taskNotes,
      taskStatus: updatedTask.status,
      taskUpdatedAt: new Date(updatedTask.updatedAt).toISOString(),
      filesContent,
    });
  }

  const indexTemplate = loadPromptFromTemplate("updateTaskContent/index.md");
  const prompt = generatePrompt(indexTemplate, {
    responseTitle,
    message: content,
  });

  // Load possible custom prompt
  return loadPrompt(prompt, "UPDATE_TASK_CONTENT");
}
