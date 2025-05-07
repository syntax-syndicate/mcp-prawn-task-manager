/**
 * prompt loader
 * Provides functionality to load custom prompts from environment variables
 */
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function processEnvString(input: string | undefined): string {
  if (!input) return "";

  return input
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "\t")
    .replace(/\\r/g, "\r");
}

/**
 * Load prompt, supports customization via environment variables
 * @param basePrompt Base prompt content
 * @param promptKey Prompt key, used to generate environment variable names
 * @returns Final prompt content
 */
export function loadPrompt(basePrompt: string, promptKey: string): string {
  // Convert to uppercase for use in environment variable names
  const envKey = promptKey.toUpperCase();

  // Check for override mode environment variable
  const overrideEnvVar = `MCP_PROMPT_${envKey}`;
  if (process.env[overrideEnvVar]) {
    // Use environment variable to completely replace the original prompt
    return processEnvString(process.env[overrideEnvVar]);
  }

  // Check for append mode environment variable
  const appendEnvVar = `MCP_PROMPT_${envKey}_APPEND`;
  if (process.env[appendEnvVar]) {
    // Append environment variable content to the original prompt
    return `${basePrompt}\n\n${processEnvString(process.env[appendEnvVar])}`;
  }

  // If no customization, use the original prompt
  return basePrompt;
}

/**
 * Generate a prompt with dynamic parameters
 * @param promptTemplate Prompt template
 * @param params Dynamic parameters
 * @returns Prompt with parameters filled in
 */
export function generatePrompt(
  promptTemplate: string,
  params: Record<string, any> = {}
): string {
  // Use a simple template replacement method to replace {paramName} with the corresponding parameter value
  let result = promptTemplate;

  Object.entries(params).forEach(([key, value]) => {
    // If the value is undefined or null, replace with an empty string
    const replacementValue =
      value !== undefined && value !== null ? String(value) : "";

    // Use a regular expression to replace all matching placeholders
    const placeholder = new RegExp(`\\{${key}\\}`, "g");
    result = result.replace(placeholder, replacementValue);
  });

  return result;
}

/**
 * Load prompt from a template
 * @param templatePath Relative path to the template within the template set root directory (e.g., 'chat/basic.md')
 * @returns Template content
 * @throws Error if the template file is not found
 */
export function loadPromptFromTemplate(templatePath: string): string {
  const templateSetName = process.env.TEMPLATES_USE || "en";
  const dataDir = process.env.DATA_DIR;
  const builtInTemplatesBaseDir = __dirname;

  let finalPath = "";
  const checkedPaths: string[] = []; // Used for more detailed error reporting

  // 1. Check for custom paths in DATA_DIR
  if (dataDir) {
    // path.resolve handles the case where templateSetName is an absolute path
    const customFilePath = path.resolve(dataDir, templateSetName, templatePath);
    checkedPaths.push(`Custom: ${customFilePath}`);
    if (fs.existsSync(customFilePath)) {
      finalPath = customFilePath;
    }
  }

  // 2. If no custom path is found, check specific built-in template directories
  if (!finalPath) {
    // Assume templateSetName is 'en', 'zh', etc. for built-in templates
    const specificBuiltInFilePath = path.join(
      builtInTemplatesBaseDir,
      `templates_${templateSetName}`,
      templatePath
    );
    checkedPaths.push(`Specific Built-in: ${specificBuiltInFilePath}`);
    if (fs.existsSync(specificBuiltInFilePath)) {
      finalPath = specificBuiltInFilePath;
    }
  }

  // 3. If the specific built-in template is not found and it's not 'en' (to avoid duplicate checks)
  if (!finalPath && templateSetName !== "en") {
    const defaultBuiltInFilePath = path.join(
      builtInTemplatesBaseDir,
      "templates_en",
      templatePath
    );
    checkedPaths.push(`Default Built-in ('en'): ${defaultBuiltInFilePath}`);
    if (fs.existsSync(defaultBuiltInFilePath)) {
      finalPath = defaultBuiltInFilePath;
    }
  }

  // 4. If no paths are found, throw an error
  if (!finalPath) {
    throw new Error(
      `Template file not found: '${templatePath}' in template set '${templateSetName}'. Checked paths:\n - ${checkedPaths.join(
        "\n - "
      )}`
    );
  }

  // 5. Read the found file
  return fs.readFileSync(finalPath, "utf-8");
}
