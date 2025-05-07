import { z } from "zod";
import { searchTasksWithCommand } from "../../models/taskModel.js";
import { getQueryTaskPrompt } from "../../prompts/index.js";

// Query Task Tool
export const queryTaskSchema = z.object({
  query: z
    .string()
    .min(1, {
      message: "Query content cannot be empty, please provide a task ID or search keywords",
    })
    .describe("Search query text, can be a task ID or multiple keywords (space-separated)"),
  isId: z
    .boolean()
    .optional()
    .default(false)
    .describe("Specify whether it is an ID query mode, default is false (keyword mode)"),
  page: z
    .number()
    .int()
    .positive()
    .optional()
    .default(1)
    .describe("Page number, default is the first page"),
  pageSize: z
    .number()
    .int()
    .positive()
    .min(1)
    .max(20)
    .optional()
    .default(5)
    .describe("Number of tasks displayed per page, default is 5, maximum is 20"),
});

export async function queryTask({
  query,
  isId = false,
  page = 1,
  pageSize = 3,
}: z.infer<typeof queryTaskSchema>) {
  try {
    // Use system command search function
    const results = await searchTasksWithCommand(query, isId, page, pageSize);

    // Use prompt generator to get final prompt
    const prompt = getQueryTaskPrompt({
      query,
      isId,
      tasks: results.tasks,
      totalTasks: results.pagination.totalResults,
      page: results.pagination.currentPage,
      pageSize,
      totalPages: results.pagination.totalPages,
    });

    return {
      content: [
        {
          type: "text" as const,
          text: prompt,
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text" as const,
          text: `## System Error\n\nAn error occurred while querying tasks: ${
            error instanceof Error ? error.message : String(error)
          }`,
        },
      ],
      isError: true,
    };
  }
}
