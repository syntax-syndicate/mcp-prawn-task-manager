/**
 * planTask prompt generator
 * Responsible for combining templates and parameters into the final prompt
 */

import {
  loadPrompt,
  generatePrompt,
  loadPromptFromTemplate,
} from "../loader.js";
import { getRulesFilePath } from "../../utils/pathUtils.js";
import { Task, TaskDependency } from "../../types/index.js";

/**
 * planTask prompt parameter interface
 */
export interface PlanTaskPromptParams {
  description: string;
  requirements?: string;
  existingTasksReference?: boolean;
  completedTasks?: Task[];
  pendingTasks?: Task[];
  memoryDir: string;
}

/**
 * Get the full prompt for planTask
 * @param params prompt parameters
 * @returns generated prompt
 */
export function getPlanTaskPrompt(params: PlanTaskPromptParams): string {
  let tasksContent = "";
  if (
    params.existingTasksReference &&
    params.completedTasks &&
    params.pendingTasks
  ) {
    const allTasks = [...params.completedTasks, ...params.pendingTasks];
    // If tasks exist, add related information
    if (allTasks.length > 0) {
      let completeTasksContent = "No completed tasks";

      // 處理已完成任務
      if (params.completedTasks.length > 0) {
        completeTasksContent = "";
        // Show at most 10 completed tasks to avoid overly long prompts
        const tasksToShow =
          params.completedTasks.length > 10
            ? params.completedTasks.slice(0, 10)
            : params.completedTasks;

        tasksToShow.forEach((task, index) => {
          // 產生完成時間資訊 (如果有)
          const completedTimeText = task.completedAt
            ? `   - Completed At: ${task.completedAt.toLocaleString()}\n`
            : "";

          completeTasksContent += `{index}. **${task.name}** (ID: \`${
            task.id
          }\`)\n   - Description: ${
            task.description.length > 100
              ? task.description.substring(0, 100) + "..."
              : task.description
          }\n${completedTimeText}`;
          // 如果不是最後一個任務，添加換行
          if (index < tasksToShow.length - 1) {
            completeTasksContent += "\n\n";
          }
        });

        // 如果有更多任務，顯示提示
        if (params.completedTasks.length > 10) {
          completeTasksContent += `\n\n*（Showing first 10 out of ${params.completedTasks.length} total）*\n`;
        }
      }

      let unfinishedTasksContent = "No pending tasks";
      // 處理未完成任務
      if (params.pendingTasks && params.pendingTasks.length > 0) {
        unfinishedTasksContent = "";

        params.pendingTasks.forEach((task, index) => {
          const dependenciesText =
            task.dependencies && task.dependencies.length > 0
              ? `   - Dependencies: ${task.dependencies
                  .map((dep: TaskDependency) => `\`${dep.taskId}\``)
                  .join(", ")}\n`
              : "";

          unfinishedTasksContent += `${index + 1}. **${task.name}** (ID: \`${
            task.id
          }\`)\n   - Description: ${
            task.description.length > 150
              ? task.description.substring(0, 150) + "..."
              : task.description
          }\n   - Status: ${task.status}\n${dependenciesText}`;

          // 如果不是最後一個任務，添加換行
          if (index < (params.pendingTasks?.length ?? 0) - 1) {
            unfinishedTasksContent += "\n\n";
          }
        });
      }

      const tasksTemplate = loadPromptFromTemplate("planTask/tasks.md");
      tasksContent = generatePrompt(tasksTemplate, {
        completedTasks: completeTasksContent,
        unfinishedTasks: unfinishedTasksContent,
      });
    }
  }

  let thoughtTemplate = "";
  if (process.env.ENABLE_THOUGHT_CHAIN !== "false") {
    thoughtTemplate = loadPromptFromTemplate("planTask/hasThought.md");
  } else {
    thoughtTemplate = loadPromptFromTemplate("planTask/noThought.md");
  }
  const rulesPath = getRulesFilePath();
  const indexTemplate = loadPromptFromTemplate("planTask/index.md");
  let prompt = generatePrompt(indexTemplate, {
    description: params.description,
    requirements: params.requirements || "No requirements",
    tasksTemplate: tasksContent,
    rulesPath: rulesPath,
    memoryDir: params.memoryDir,
    thoughtTemplate: thoughtTemplate,
  });

  // Load possible custom prompt
  return loadPrompt(prompt, "PLAN_TASK");
}
