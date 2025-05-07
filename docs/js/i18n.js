// i18n.js - 多語系支援功能
// 翻譯資料結構
const i18n = {
 
  en: {
    // 導航欄
    "nav.pain-points": "Pain Points",
    "nav.features": "Features",
    "nav.workflow": "Workflow",
    "nav.installation": "Installation",
    "nav.github": "GitHub",
    "nav.menu-button": "Menu",
    "nav.logo.alt": "Prawn Task Manager Logo",
    "nav.prompt-custom": "Prompt Config",
    // 英雄區
    "hero.title": "Prawn Task Manager",
    "hero.subtitle":
      "Intelligent System for Structured Task Management in AI Programming Assistants",
    "hero.description":
      "Empower your AI assistant with long-term memory capabilities, efficient complex task management, and structured task decomposition and execution tracking, making your programming experience smoother and more efficient.",
    "hero.start": "Get Started",
    "hero.learn-more": "Learn More",
    "hero.workflow-image.alt": "Intelligent Task Management Workflow",
    // 痛點解決方案區
    "pain-points.title": "Pain Points & Solutions",
    "pain-points.subtitle":
      "Prawn Task Manager is designed to solve three core pain points faced by AI programming assistants in task management.",
    "pain-points.memory-loss.title": "Memory Loss",
    "pain-points.memory-loss.description":
      "AI assistants lack cross-conversation task memory capability, resulting in inability to track long-term task progress, repeated explanation of the same requirements, and wasted time and resources.",
    "pain-points.memory-loss.solution.title": "Task Memory Function",
    "pain-points.memory-loss.solution.description":
      "Automatically save execution history, provide long-term memory capability, allowing AI assistants to remember previous task progress and seamlessly continue unfinished tasks.",
    "pain-points.memory-loss.icon.alt": "Memory Loss",
    "pain-points.structure-chaos.title": "Structural Chaos",
    "pain-points.structure-chaos.description":
      "Complex tasks lack systematic management leading to inefficiency, missing dependency management, chaotic subtask execution, and difficulty tracking overall progress.",
    "pain-points.structure-chaos.solution.title":
      "Structured Task Decomposition",
    "pain-points.structure-chaos.solution.description":
      "Automatically decompose complex tasks into manageable subtasks, establish clear dependencies, provide ordered execution paths, and ensure efficient completion.",
    "pain-points.structure-chaos.icon.alt": "Structural Chaos",
    "pain-points.structure-chaos.solution.icon.alt":
      "Structured Task Decomposition",
    "pain-points.repeat-work.title": "Repetitive Work",
    "pain-points.repeat-work.description":
      "Unable to effectively utilize past experience and solutions, each conversation starts from scratch, lacking knowledge accumulation and experience reference systems.",
    "pain-points.repeat-work.solution.title":
      "Knowledge Accumulation & Experience Reference",
    "pain-points.repeat-work.solution.description":
      "Automatically records successful solutions, builds a task knowledge base, supports quick reference for similar tasks, achieving experience accumulation and knowledge reuse.",
    "pain-points.repeat-work.icon.alt": "Repetitive Work",
    "pain-points.repeat-work.solution.icon.alt":
      "Knowledge Accumulation and Experience Reference",
    "pain-points.explore": "Explore Core Features",
    // 功能區塊
    "features.title": "Core Features",
    "features.subtitle":
      "Prawn Task Manager provides six core features to help you efficiently manage, execute, and track complex tasks.",
    "features.planning.title": "Intelligent Task Planning & Analysis",
    "features.planning.description":
      "Through in-depth analysis of requirements and constraints, generate structured task plans. Automatically assess scope, risks, and priorities to provide rational and comprehensive implementation strategies.",
    "features.planning.icon.alt": "Intelligent Task Planning and Analysis",
    "features.decomposition.title":
      "Automatic Task Decomposition & Dependency Management",
    "features.decomposition.description":
      "Intelligently break down complex tasks into manageable smaller tasks, identify dependencies between tasks, establish optimized execution paths, and avoid resource conflicts and execution bottlenecks.",
    "features.decomposition.icon.alt":
      "Automatic Task Decomposition and Dependency Management",
    "features.tracking.title": "Execution Status Tracking",
    "features.tracking.description":
      "Monitor the execution status of each task in real-time, provide progress visualization, automatically update dependency status, and provide detailed execution reports upon task completion.",
    "features.tracking.icon.alt": "Execution Status Tracking",
    "features.verification.title": "Task Integrity Verification",
    "features.verification.description":
      "Thoroughly check task completion, ensure all requirements and standards have been met, provide verification reports and quality assessments, and ensure output meets expected requirements.",
    "features.verification.icon.alt": "Task Integrity Verification",
    "features.complexity.title": "Task Complexity Assessment",
    "features.complexity.description":
      "Evaluate task complexity based on multi-dimensional standards, provide resource requirement estimates, identify high-risk components, and help reasonably allocate resources and time.",
    "features.complexity.icon.alt": "Task Complexity Assessment",
    "features.memory.title": "Task Memory Function",
    "features.memory.description":
      "Provide cross-session task memory capabilities, automatically save execution history and context, allow task resumption and continuation at any time, without the need to re-explain requirements.",
    "features.memory.icon.alt": "Task Memory Function",
    "features.learn-workflow": "Learn about the Workflow",
    // 工作流程區塊
    "workflow.title": "Workflow",
    "workflow.subtitle":
      "Prawn Task Manager provides a complete workflow, with each step from task planning to task completion carefully designed.",
    "workflow.step1.title": "Task Planning",
    "workflow.step1.description": "Initialize and plan task flow in detail",
    "workflow.step2.title": "In-depth Analysis",
    "workflow.step2.description":
      "Analyze requirements and assess technical feasibility",
    "workflow.step3.title": "Solution Reflection",
    "workflow.step3.description":
      "Critically review analysis results and optimize solutions",
    "workflow.step4.title": "Task Decomposition",
    "workflow.step4.description":
      "Break down complex tasks into manageable subtasks",
    "workflow.step5.title": "Task Execution",
    "workflow.step5.description":
      "Execute specific tasks according to predetermined plans",
    "workflow.step6.title": "Result Verification",
    "workflow.step6.description":
      "Thoroughly verify task completion and quality",
    "workflow.step7.title": "Task Completion",
    "workflow.step7.description":
      "Mark tasks as completed and generate reports",
    "workflow.learn-more-link": "Learn More →",
    "workflow.mobile.step1.full-description":
      "Initialize and plan task flow in detail, establish clear goals and success criteria, with the option to reference existing tasks for continued planning.",
    "workflow.mobile.step2.full-description":
      "Analyze task requirements in depth and systematically review codebase, assess technical feasibility and potential risks, and provide initial solution recommendations.",
    "workflow.mobile.step3.full-description":
      "Critically review analysis results, evaluate solution completeness and identify optimization opportunities, ensuring solutions follow best practices.",
    "workflow.mobile.step4.full-description":
      "Break complex tasks into independent and trackable subtasks, establish clear dependencies and priorities, support multiple update modes.",
    "workflow.mobile.step5.full-description":
      "Execute specific tasks according to the predefined plan, ensure each step's output meets quality standards, and handle exceptions during execution.",
    "workflow.mobile.step6.full-description":
      "Comprehensively verify task completion, ensure all requirements and technical standards are met with no missing details, provide quality assessment reports.",
    "workflow.mobile.step7.full-description":
      "Formally mark tasks as completed, generate detailed completion reports, and update dependency status of related tasks to ensure workflow continuity.",
    // 安裝配置區塊
    "installation.title": "Installation & Configuration",
    "installation.subtitle":
      "Prawn Task Manager offers multiple installation methods, whether you want to get started quickly or need advanced configuration, it's easy to set up.",
    "installation.manual.title": "Manual Installation",
    "installation.step1": "Clone Repository",
    "installation.step2": "Install Dependencies",
    "installation.step3": "Build Project",
    "installation.cursor.title": "Cursor IDE Configuration",
    "installation.cursor.description":
      "If you use Cursor IDE, you can integrate Prawn Task Manager into your development environment.",
    "installation.quickstart.title": "Quick Start",
    "installation.quickstart.description":
      "After installation, check our quick start guide to learn how to use MCP Prawn Task Manager.",
    "installation.faq.title": "FAQ",
    "installation.faq.description":
      "Having issues? Check our frequently asked questions or submit an issue on GitHub.",
    "installation.copy-button": "Copy",
    "installation.important-note.title": "Important Note",
    "installation.important-note.description":
      "Must use absolute path: Please ensure the DATA_DIR configuration uses absolute paths rather than relative paths, otherwise data may not load correctly",
    "installation.prompt-config.title": "Prompt Configuration Guide",
    "installation.prompt-config.intro":
      "Prawn Task Manager supports two modes:",
    "installation.prompt-config.mode1.title": "TaskPlanner:",
    "installation.prompt-config.mode1.description":
      "Suitable for initial task planning and complex task decomposition, where the AI assistant plays the role of a task planner.",
    "installation.prompt-config.mode2.title": "TaskExecutor:",
    "installation.prompt-config.mode2.description":
      "Suitable for executing predefined tasks, where the AI assistant plays the role of an execution expert.",
    "installation.prompt-config.tip":
      "You can use Custom modes in Cursor settings to customize modes to suit different work scenarios.",
    // CTA區塊
    "cta.title": "Experience Intelligent Task Management Now",
    "cta.description":
      "Enhance your AI programming experience, say goodbye to disorganized task management, and embrace a more efficient workflow.",
    "cta.github": "Go to GitHub Repository",
    "cta.start": "Start Installation",
    // 頁腳區塊
    "footer.copyright": "© 2023 MCP Task Manager. All Rights Reserved.",
    "footer.developer": "Made with ❤️ by Siage",

    // 通用UI元素
    "common.close": "Close",
    "common.back": "Back",
    "common.next": "Next",
    "common.submit": "Submit",
    "common.cancel": "Cancel",
    "common.confirm": "Confirm",
    "common.copy": "Copy",
    "common.copied": "Copied!",
    "common.yes": "Yes",
    "common.no": "No",
    "common.more": "More",
    "common.less": "Less",
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success",
    "common.warning": "Warning",
    "common.info": "Info",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.sort": "Sort",
    "common.ascending": "Ascending",
    "common.descending": "Descending",
    "common.lang.en": "EN",
    "modal.close-button": "Close",
    "modal.close-button-aria": "Close",

    // 工作流程詳細內容
    "workflow.step1.content.title": "Task Planning Stage",
    "workflow.step1.content.description":
      "The task planning stage is the initial phase where AI assistants define project scope, set goals, and establish success criteria.",
    "workflow.step1.content.activities": "Key Activities:",
    "workflow.step1.content.activity1":
      "Clarify project requirements and constraints",
    "workflow.step1.content.activity2":
      "Set clear objectives and define measurable success criteria",
    "workflow.step1.content.activity3":
      "Establish project boundaries and identify stakeholders",
    "workflow.step1.content.activity4":
      "Create a high-level plan with timeline estimates",
    "workflow.step1.content.activity5":
      "Optionally reference existing tasks for continuous planning",
    "workflow.step1.content.outputs": "Outputs:",
    "workflow.step1.content.output1": "Comprehensive task description",
    "workflow.step1.content.output2": "Clear success criteria",
    "workflow.step1.content.output3": "Technical requirements and constraints",
    "workflow.step1.content.summary":
      "This stage lays the foundation for all subsequent work, ensuring that both the AI assistant and the user have a shared understanding of what needs to be accomplished.",

    "workflow.step2.content.title": "In-depth Analysis Stage",
    "workflow.step2.content.description":
      "The in-depth analysis stage involves a thorough examination of the requirements and technical landscape to develop a viable implementation strategy.",
    "workflow.step2.content.activities": "Key Activities:",
    "workflow.step2.content.activity1":
      "Analyze requirements and identify technical challenges",
    "workflow.step2.content.activity2":
      "Evaluate technical feasibility and potential risks",
    "workflow.step2.content.activity3":
      "Research best practices and available solutions",
    "workflow.step2.content.activity4":
      "Systematically review existing codebase if applicable",
    "workflow.step2.content.activity5":
      "Develop initial implementation concepts",
    "workflow.step2.content.outputs": "Outputs:",
    "workflow.step2.content.output1": "Technical feasibility assessment",
    "workflow.step2.content.output2":
      "Risk identification and mitigation strategies",
    "workflow.step2.content.output3": "Initial implementation approach",
    "workflow.step2.content.output4":
      "Pseudocode or architectural diagrams where appropriate",
    "workflow.step2.content.summary":
      "This stage ensures that the proposed solution is technically sound and addresses all requirements before proceeding to implementation.",

    // 錯誤和警告訊息
    "error.storage":
      "Unable to access local storage, language preferences will not be saved.",
    "error.translation": "Translation error: Unable to load translation data.",
    "error.network": "Network error: Unable to connect to the server.",
    "warning.browser":
      "Your browser may not support all features, we recommend using the latest version of Chrome, Firefox, or Safari.",
    "warning.mobile": "Some features may be limited on mobile devices.",

    // 代碼示例區塊
    "examples.planning.title": "Task Planning and Decomposition Process",
    "examples.planning.intro":
      "This example demonstrates how to use MCP Prawn Task Manager to plan and break down complex tasks. The entire process includes four main steps:",
    "examples.planning.step1":
      "Initialize and plan tasks in detail, establishing clear goals and success criteria",
    "examples.planning.step2":
      "Deeply understand the task, analyze technical feasibility and potential challenges",
    "examples.planning.step3":
      "Critically review analysis results and optimize proposals",
    "examples.planning.step4": "Break complex tasks into manageable subtasks",
    "examples.planning.conclusion":
      "With this approach, you can transform complex, large tasks into structured, executable work units while maintaining an overall perspective.",
    "examples.execution.title": "Task Execution and Completion Process",
    "examples.execution.intro":
      "This example demonstrates how to execute and complete planned tasks. The entire process includes four main steps:",
    "examples.execution.step1.title": "Task List",
    "examples.execution.step1":
      "Query pending task list to understand current status",
    "examples.execution.step2":
      "Execute selected tasks according to the predetermined plan",
    "examples.execution.step3":
      "Verify task completion to ensure quality standards are met",
    "examples.execution.step4":
      "Officially mark tasks as completed and generate reports",
    "examples.execution.conclusion":
      "With this approach, you can systematically execute tasks and ensure each step meets expected quality standards, ultimately completing the entire workflow.",
    "examples.tip.title": "💡 Tip",
    "examples.tip.description":
      "The workflow above is not fixed. The Agent will iterate through different steps based on analysis until the expected effect is achieved.",

    // 快速入門和常見問題區塊
    "quickstart.title": "Quick Start",
    "quickstart.description":
      "After installation, check our quick start guide to learn how to use MCP Prawn Task Manager.",
    "quickstart.view-code-link": "View Code →",
    "faq.title": "Frequently Asked Questions",
    "faq.description":
      "Having issues? Check our frequently asked questions or submit an issue on GitHub.",
    "faq.view-faq-link": "View FAQ →",
    "installation.cursor.mcp-servers": "to/your/project/.cursor/mcp.jsonn",
    "task.planner.prompt": `You are a professional task planning expert. You must interact with users, analyze their needs, and collect project-related information. Finally, you must use "plan_task" to create tasks. When the task is created, you must summarize it and inform the user to use the "TaskExecutor" mode to execute the task.
You must focus on task planning. Do not use "execute_task" to execute tasks.
Serious warning: you are a task planning expert, you cannot modify the program code directly, you can only plan tasks, and you cannot modify the program code directly, you can only plan tasks.`,
    "task.executor.prompt": `You are a professional task execution expert. When a user specifies a task to execute, use "execute_task" to execute the task.
If no task is specified, use "list_tasks" to find unexecuted tasks and execute them.
When the execution is completed, a summary must be given to inform the user of the conclusion.
You can only perform one task at a time, and when a task is completed, you are prohibited from performing the next task unless the user explicitly tells you to.
If the user requests "continuous mode", all tasks will be executed in sequence.`,
    // Prompt 自定義功能區塊
    "prompt-custom.title": "Prompt Customization",
    "prompt-custom.subtitle":
      "Customize AI assistant behavior through environment variables, without modifying code",

    "prompt-custom.overview.title": "Feature Overview",
    "prompt-custom.overview.description":
      "Prompt customization allows users to adjust AI assistant behavior through environment variables, providing two customization methods: completely override original prompts or append content to existing ones.",

    "prompt-custom.benefits.title": "Key Benefits",
    "prompt-custom.benefits.item1":
      "Personalized customization: Adjust system behavior for specific projects or domains",
    "prompt-custom.benefits.item2":
      "Efficiency improvement: Optimize for repetitive task types, reducing redundant instructions",
    "prompt-custom.benefits.item3":
      "Brand consistency: Ensure output content adheres to organization style guides and standards",
    "prompt-custom.benefits.item4":
      "Professional adaptability: Adjust terminology and standards for specific technical fields or industries",
    "prompt-custom.benefits.item5":
      "Team collaboration: Unify prompts used by team members, ensuring consistent workflow",

    "prompt-custom.usage.title": "Usage Guide",
    "prompt-custom.usage.env.title": "Environment Variables Configuration",
    "prompt-custom.usage.env.description":
      "Set environment variables to customize prompts for each function, using specific naming conventions:",
    "prompt-custom.usage.more":
      "View detailed documentation for more configuration methods and parameter usage.",
    "prompt-custom.view-docs": "View Complete Documentation",
  },
};

// 翻譯應用函數
function applyTranslations(lang) {
  // 確保選擇的語言有效
  if (!i18n[lang]) {
    console.error("不支援的語言:", lang);
    return;
  }

  // 應用翻譯到所有帶有 data-i18n 屬性的元素
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    if (i18n[lang][key]) {
      element.textContent = i18n[lang][key];
    } else {
      console.warn(`未找到翻譯鍵: ${key}`);
    }
  });

  // 處理語言特定的連結
  document.querySelectorAll(".lang-specific").forEach((element) => {
    if (element.hasAttribute(`data-lang-${lang}`)) {
      const langSpecificHref = element.getAttribute(`data-lang-${lang}`);
      if (langSpecificHref) {
        element.setAttribute("href", langSpecificHref);
      }
    }
  });
}

// 設置語言並儲存用戶偏好
function setLanguage(lang) {
  // 儲存用戶偏好
  localStorage.setItem("preferred-language", lang);

  // 應用翻譯
  applyTranslations(lang);

  // 更新按鈕狀態
  document.querySelectorAll(".lang-btn").forEach(function (btn) {
    if (btn.getAttribute("data-lang") === lang) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  // 更新 html 標籤的 lang 屬性
  document.documentElement.setAttribute("lang", lang);
}

// 獲取用戶偏好語言或瀏覽器語言
function getPreferredLanguage() {
  // 檢查本地儲存
  const savedLang = localStorage.getItem("preferred-language");
  if (savedLang && i18n[savedLang]) {
    return savedLang;
  }

  // 檢查瀏覽器語言
  const browserLang = navigator.language || navigator.userLanguage;
  if (browserLang) {
    // 嘗試使用完整語言代碼匹配
    if (i18n[browserLang]) {
      return browserLang;
    }

    // 嘗試使用語言代碼前兩個字符匹配（如 "zh-TW" -> "zh"）
    const langPrefix = browserLang.split("-")[0];
    for (const key in i18n) {
      if (key.startsWith(langPrefix)) {
        return key;
      }
    }
  }

  // 默認返回英文
  return "en";
}

// 初始化網站語言
function initializeLanguage() {
  const preferredLang = getPreferredLanguage();
  setLanguage(preferredLang);
}

// 頁面載入完成後初始化語言和事件監聽器
document.addEventListener("DOMContentLoaded", function () {
  // 初始化語言
  initializeLanguage();

  // 為語言按鈕添加事件監聽器
  document.querySelectorAll(".lang-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setLanguage(this.getAttribute("data-lang"));
    });
  });
});

// ==================================================
// 動態內容翻譯和性能優化函數
// ==================================================

/**
 * 創建帶有翻譯屬性的動態元素
 * @param {string} i18nKey - 翻譯鍵
 * @param {string} defaultText - 默認文本
 * @param {string} elementType - 元素類型，默認為div
 * @returns {HTMLElement} - 創建的元素
 */
function createDynamicElement(i18nKey, defaultText, elementType = "div") {
  const element = document.createElement(elementType);
  element.setAttribute("data-i18n", i18nKey);

  // 獲取當前語言
  const currentLang = localStorage.getItem("preferred-language") || "en";

  // 設置文本內容
  element.textContent =
    i18n[currentLang] && i18n[currentLang][i18nKey]
      ? i18n[currentLang][i18nKey]
      : defaultText;

  return element;
}

/**
 * 翻譯工具函數 - 獲取翻譯文本
 * @param {string} key - 翻譯鍵
 * @param {string} defaultText - 默認文本
 * @returns {string} - 翻譯後的文本
 */
function translateText(key, defaultText) {
  const currentLang = localStorage.getItem("preferred-language") || "en";
  return i18n[currentLang] && i18n[currentLang][key]
    ? i18n[currentLang][key]
    : defaultText;
}

/**
 * 批量處理翻譯，提高性能
 * 當頁面包含大量需要翻譯的元素時使用
 */
function batchApplyTranslations() {
  // 延遲加載翻譯，確保不阻塞頁面渲染
  window.addEventListener("load", function () {
    // 如果有大量翻譯內容，分批處理
    setTimeout(function () {
      const elements = document.querySelectorAll("[data-i18n]");
      const batchSize = 50; // 每批處理50個元素
      const currentLang = localStorage.getItem("preferred-language") || "en";

      for (let i = 0; i < elements.length; i += batchSize) {
        setTimeout(function () {
          const batch = Array.prototype.slice.call(elements, i, i + batchSize);
          batch.forEach(function (el) {
            // 應用未處理的翻譯
            const key = el.getAttribute("data-i18n");
            if (i18n[currentLang] && i18n[currentLang][key]) {
              el.textContent = i18n[currentLang][key];
            }
          });
        }, 0);
      }
    }, 0);
  });
}

/**
 * 帶動畫效果的語言切換
 * @param {string} lang - 目標語言
 */
function setLanguageWithAnimation(lang) {
  // 添加淡出效果
  document.body.classList.add("lang-transition");

  setTimeout(function () {
    // 應用翻譯
    setLanguage(lang);

    // 添加淡入效果
    document.body.classList.remove("lang-transition");
  }, 300);
}

// 在頁面載入時執行性能優化的批量翻譯
batchApplyTranslations();

// 添加語言切換動畫的CSS樣式
const styleElement = document.createElement("style");
styleElement.textContent = `
.lang-btn {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.lang-btn.active {
  background-color: #3b82f6;
  color: white;
}

.language-switcher {
  display: flex;
  gap: 0.5rem;
  margin-left: 1rem;
}

/* 語言切換過渡動畫 */
.lang-transition {
  opacity: 0.8;
  transition: opacity 0.3s ease;
}
`;
document.head.appendChild(styleElement);

// ==================================================
// 防禦性編程函數，確保翻譯系統的健壯性
// ==================================================

/**
 * 安全翻譯函數 - 確保在i18n對象缺失或格式錯誤時不會崩潰
 * @param {string} key - 翻譯鍵
 * @param {string} defaultText - 默認文本
 * @returns {string} - 翻譯後的文本
 */
function safeTranslate(key, defaultText) {
  try {
    const currentLang = localStorage.getItem("preferred-language") || "en";
    if (
      typeof i18n === "undefined" ||
      !i18n[currentLang] ||
      !i18n[currentLang][key]
    ) {
      console.warn(`翻譯鍵 "${key}" 不存在，使用默認文本`);
      return defaultText;
    }
    return i18n[currentLang][key];
  } catch (e) {
    console.error("翻譯錯誤:", e);
    return defaultText;
  }
}

/**
 * 檢測 LocalStorage 是否可用
 * @param {string} type - 存儲類型，通常是 'localStorage'
 * @returns {boolean} - 是否可用
 */
function storageAvailable(type) {
  try {
    const storage = window[type];
    const x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      // 針對 Firefox
      (e.code === 22 ||
        // 針對 Chrome
        e.code === 1014 ||
        // 測試名稱字段
        e.name === "QuotaExceededError" ||
        e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
      // 確認存儲不為空
      storage &&
      storage.length !== 0
    );
  }
}

/**
 * 增強版初始化函數 - 添加防禦性功能
 */
function enhancedInitializeLanguage() {
  try {
    // 檢查瀏覽器是否支持 LocalStorage
    if (storageAvailable("localStorage")) {
      let preferredLang = localStorage.getItem("preferred-language");

      if (!preferredLang) {
        const browserLang = navigator.language || navigator.userLanguage;
        preferredLang = "en";
      }

      // 驗證語言代碼是否有效
      if (!i18n[preferredLang]) {
        console.warn(`不支援的語言代碼 ${preferredLang}，使用默認語言`);
        preferredLang = "en";
      }

      setLanguage(preferredLang);
    } else {
      // 如果不支持 LocalStorage，默認使用中文
      console.warn("LocalStorage 不可用，語言偏好將不會被保存");
      setLanguage("en");
    }
  } catch (error) {
    console.error("初始化語言時發生錯誤:", error);
    // 在錯誤情況下使用默認語言
    try {
      setLanguage("en");
    } catch (e) {
      console.error("無法設置默認語言:", e);
    }
  }
}

// 替換原始函數的增強版語言切換函數
function enhancedSetLanguage(lang) {
  try {
    // 確保語言代碼有效
    if (!i18n[lang]) {
      console.warn(`不支援的語言代碼: ${lang}，使用默認語言`);
      lang = "en";
    }

    // 嘗試保存用戶偏好
    try {
      if (storageAvailable("localStorage")) {
        localStorage.setItem("preferred-language", lang);
      }
    } catch (e) {
      console.warn("無法保存語言偏好:", e);
    }

    // 應用翻譯
    applyTranslations(lang);

    // 更新按鈕狀態
    try {
      document.querySelectorAll(".lang-btn").forEach(function (btn) {
        if (btn.getAttribute("data-lang") === lang) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      });
    } catch (e) {
      console.warn("無法更新語言按鈕狀態:", e);
    }

    // 更新 HTML 標籤的 lang 屬性
    try {
      document.documentElement.setAttribute("lang", lang);
    } catch (e) {
      console.warn("無法更新 HTML lang 屬性:", e);
    }

    // 觸發自定義事件通知語言變更
    try {
      const event = new CustomEvent("languageChanged", {
        detail: { language: lang },
      });
      document.dispatchEvent(event);
    } catch (e) {
      console.warn("無法觸發語言變更事件:", e);
    }
  } catch (error) {
    console.error("設置語言時發生錯誤:", error);
  }
}

/**
 * 兼容性測試函數 - 檢查多語系系統是否正常工作
 * 測試以下功能:
 * 1. LocalStorage 是否可用
 * 2. 語言切換功能是否正常
 * 3. 翻譯應用是否正常
 * 4. 動態內容翻譯是否正常
 *
 * @returns {Object} 測試結果對象
 */
function i18nCompatibilityTest() {
  const results = {
    localStorage: false,
    languageSwitch: false,
    translations: false,
    dynamicContent: false,
    details: {
      errors: [],
      warnings: [],
      info: [],
    },
  };

  // 測試 LocalStorage 是否可用
  try {
    results.localStorage = storageAvailable("localStorage");
    results.details.info.push(
      "LocalStorage " + (results.localStorage ? "可用" : "不可用")
    );
  } catch (e) {
    results.details.errors.push("測試 LocalStorage 時發生錯誤: " + e.message);
  }

  // 測試語言切換功能
  try {
    // 保存當前語言
    const originalLang ="en";

    // 嘗試切換語言
    const testLang ="en";

    // 使用安全的語言切換方式
    if (typeof enhancedSetLanguage === "function") {
      enhancedSetLanguage(testLang);
    } else if (typeof setLanguage === "function") {
      setLanguage(testLang);
    } else {
      throw new Error("找不到語言切換函數");
    }

    // 檢查語言是否成功切換
    const newLang =
      document.documentElement.lang ||
      localStorage.getItem("preferred-language");

    results.languageSwitch = newLang === testLang;
    results.details.info.push(
      "語言切換 " + (results.languageSwitch ? "正常" : "異常")
    );

    // 恢復原來的語言
    if (typeof enhancedSetLanguage === "function") {
      enhancedSetLanguage(originalLang);
    } else if (typeof setLanguage === "function") {
      setLanguage(originalLang);
    }
  } catch (e) {
    results.details.errors.push("測試語言切換時發生錯誤: " + e.message);
  }

  // 測試翻譯應用是否正常
  try {
    // 查找頁面上有 data-i18n 屬性的元素
    const translatedElements = document.querySelectorAll("[data-i18n]");
    if (translatedElements.length > 0) {
      // 檢查是否有內容
      let hasContent = false;
      translatedElements.forEach((el) => {
        if (el.textContent && el.textContent.trim() !== "") {
          hasContent = true;
        }
      });

      results.translations = hasContent;
      results.details.info.push(
        "找到 " +
          translatedElements.length +
          " 個翻譯元素，內容" +
          (hasContent ? "正常" : "異常")
      );
    } else {
      results.details.warnings.push("頁面上找不到帶有 data-i18n 屬性的元素");
    }
  } catch (e) {
    results.details.errors.push("測試翻譯應用時發生錯誤: " + e.message);
  }

  // 測試動態內容翻譯
  try {
    if (
      typeof createDynamicElement === "function" &&
      typeof translateText === "function"
    ) {
      // 創建測試元素
      const testKey = "test.dynamic";
      const testDefault = "測試動態內容";
      const testElement = createDynamicElement(testKey, testDefault);

      // 檢查元素是否正確創建
      if (
        testElement &&
        testElement.getAttribute("data-i18n") === testKey &&
        testElement.textContent === testDefault
      ) {
        results.dynamicContent = true;
      }

      results.details.info.push(
        "動態內容翻譯 " + (results.dynamicContent ? "正常" : "異常")
      );
    } else {
      results.details.warnings.push("動態內容翻譯功能不可用");
    }
  } catch (e) {
    results.details.errors.push("測試動態內容翻譯時發生錯誤: " + e.message);
  }

  // 輸出測試結果摘要
  console.log(
    "多語系兼容性測試結果:",
    results.localStorage && results.languageSwitch && results.translations
      ? "通過 ✅"
      : "部分功能異常 ⚠️"
  );
  console.table({
    LocalStorage可用: results.localStorage ? "✅" : "❌",
    語言切換功能: results.languageSwitch ? "✅" : "❌",
    翻譯應用: results.translations ? "✅" : "❌",
    動態內容翻譯: results.dynamicContent ? "✅" : "❌",
  });

  if (results.details.errors.length > 0) {
    console.error("錯誤:", results.details.errors);
  }

  if (results.details.warnings.length > 0) {
    console.warn("警告:", results.details.warnings);
  }

  return results;
}

// 自動運行兼容性測試並將結果保存到全局變量
window.addEventListener("load", function () {
  // 延遲執行測試，確保頁面完全載入
  setTimeout(function () {
    try {
      window.i18nTestResults = i18nCompatibilityTest();
    } catch (e) {
      console.error("執行多語系兼容性測試時發生錯誤:", e);
    }
  }, 1000);
});
