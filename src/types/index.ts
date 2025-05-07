// Task status enum: Define the current stage of a task in the workflow
export enum TaskStatus {
  PENDING = "Pending", // Task created but not yet started
  IN_PROGRESS = "In Progress", // Task currently being executed
  COMPLETED = "Completed", // Task successfully finished and verified
  BLOCKED = "Blocked", // Task temporarily unable to execute due to dependencies
}

// Task dependency: Define prerequisite relationships between tasks
export interface TaskDependency {
  taskId: string; // Unique identifier of the prerequisite task that must be completed before the current task
}

// Related file types: Define the relationship between files and tasks
export enum RelatedFileType {
  TO_MODIFY = "TO_MODIFY", // Files to be modified in the task
  REFERENCE = "REFERENCE", // Reference materials or related documents for the task
  CREATE = "CREATE", // Files to be created in the task
  DEPENDENCY = "DEPENDENCY", // Component or library files the task depends on
  OTHER = "OTHER", // Other types of related files
}

// Related files: Define file information related to a task
export interface RelatedFile {
  path: string; // File path, can be relative to project root or absolute path
  type: RelatedFileType; // Relationship type between file and task
  description?: string; // Supplementary description explaining the specific relationship or purpose of the file
  lineStart?: number; // Starting line of the related code block (optional)
  lineEnd?: number; // Ending line of the related code block (optional)
}

// Task interface: Define the complete data structure of a task
export interface Task {
  id: string; // Unique task identifier
  name: string; // Concise and clear task name
  description: string; // Detailed task description, including implementation points and acceptance criteria
  notes?: string; // Supplementary notes, special handling requirements, or implementation suggestions (optional)
  status: TaskStatus; // Current execution status of the task
  dependencies: TaskDependency[]; // List of task's prerequisite dependencies
  createdAt: Date; // Timestamp of task creation
  updatedAt: Date; // Timestamp of last task update
  completedAt?: Date; // Timestamp of task completion (only applicable to completed tasks)
  summary?: string; // Task completion summary, concisely describing implementation results and key decisions (only for completed tasks)
  relatedFiles?: RelatedFile[]; // List of files related to the task (optional)

  // Added field: Store complete technical analysis results
  analysisResult?: string; // Complete analysis results from analyze_task and reflect_task stages

  // Added field: Store specific implementation guidelines
  implementationGuide?: string; // Specific implementation methods, steps, and recommendations

  // Added field: Store verification standards and inspection methods
  verificationCriteria?: string; // Clear verification standards, test points, and acceptance conditions
}

// Task complexity level: Define task complexity classification
export enum TaskComplexityLevel {
  LOW = "Low Complexity", // Simple and direct tasks, usually requiring no special handling
  MEDIUM = "Medium Complexity", // Tasks with some complexity but still manageable
  HIGH = "High Complexity", // Complex and time-consuming tasks requiring special attention
  VERY_HIGH = "Very High Complexity", // Extremely complex tasks, recommended to split
}

// Task complexity thresholds: Define reference standards for task complexity assessment
export const TaskComplexityThresholds = {
  DESCRIPTION_LENGTH: {
    MEDIUM: 500, // Classified as medium complexity if exceeding this character count
    HIGH: 1000, // Classified as high complexity if exceeding this character count
    VERY_HIGH: 2000, // Classified as very high complexity if exceeding this character count
  },
  DEPENDENCIES_COUNT: {
    MEDIUM: 2, // Classified as medium complexity if exceeding this number of dependencies
    HIGH: 5, // Classified as high complexity if exceeding this number of dependencies
    VERY_HIGH: 10, // Classified as very high complexity if exceeding this number of dependencies
  },
  NOTES_LENGTH: {
    MEDIUM: 200, // Classified as medium complexity if exceeding this character count
    HIGH: 500, // Classified as high complexity if exceeding this character count
    VERY_HIGH: 1000, // Classified as very high complexity if exceeding this character count
  },
};

// Task complexity assessment result: Record detailed results of task complexity analysis
export interface TaskComplexityAssessment {
  level: TaskComplexityLevel; // Overall complexity level
  metrics: {
    // Detailed data for each assessment indicator
    descriptionLength: number; // Description length
    dependenciesCount: number; // Number of dependencies
    notesLength: number; // Notes length
    hasNotes: boolean; // Whether notes exist
  };
  recommendations: string[]; // List of processing recommendations
}
