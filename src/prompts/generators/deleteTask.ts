/**
 * deleteTask prompt generator
 * Responsible for combining templates and parameters into the final prompt
 */

import {
  loadPrompt,
  generatePrompt,
  loadPromptFromTemplate,
} from "../loader.js";
import { Task } from "../../types/index.js";

/**
 * deleteTask prompt parameter interface
 */
export interface DeleteTaskPromptParams {
  taskId: string;
  task?: Task;
  success?: boolean;
  message?: string;
  isTaskCompleted?: boolean;
}

/**
 * Get the full prompt for deleteTask
 * @param params prompt parameters
 * @returns generated prompt
 */
export function getDeleteTaskPrompt(params: DeleteTaskPromptParams): string {
  const { taskId, task, success, message, isTaskCompleted } = params;

  // Handle scenario where task does not exist
  if (!task) {
    const notFoundTemplate = loadPromptFromTemplate("deleteTask/notFound.md");
    return generatePrompt(notFoundTemplate, {
      taskId,
    });
  }

  // Handle scenario where task is already completed
  if (isTaskCompleted) {
    const completedTemplate = loadPromptFromTemplate("deleteTask/completed.md");
    return generatePrompt(completedTemplate, {
      taskId: task.id,
      taskName: task.name,
    });
  }

  // Handle delete success or failure scenario
  const responseTitle = success ? "Success" : "Failure";
  const indexTemplate = loadPromptFromTemplate("deleteTask/index.md");
  const prompt = generatePrompt(indexTemplate, {
    responseTitle,
    message,
  });

  // Load possible custom prompt
  return loadPrompt(prompt, "DELETE_TASK");
}
