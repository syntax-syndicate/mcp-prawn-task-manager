// Global variables
let tasks = [];
let selectedTaskId = null;
let searchTerm = "";
let sortOption = "date-asc";
let globalAnalysisResult = null; // Added: Store global analysis result
let svg, g, simulation; // << Modified: Define D3-related variables

// Added: i18n global variables
let currentLang = "en"; // Default language
let translations = {}; // Store loaded translations

// DOM elements
const taskListElement = document.getElementById("task-list");
const taskDetailsContent = document.getElementById("task-details-content");
const statusFilter = document.getElementById("status-filter");
const currentTimeElement = document.getElementById("current-time");
const progressIndicator = document.getElementById("progress-indicator");
const progressCompleted = document.getElementById("progress-completed");
const progressInProgress = document.getElementById("progress-in-progress");
const progressPending = document.getElementById("progress-pending");
const progressLabels = document.getElementById("progress-labels");
const dependencyGraphElement = document.getElementById("dependency-graph");
const globalAnalysisResultElement = document.getElementById(
  "global-analysis-result"
); // Assuming this element exists in the HTML
const langSwitcher = document.getElementById("lang-switcher"); // << Added: Get the switcher element

// 初始化
document.addEventListener("DOMContentLoaded", () => {
  // fetchTasks(); // Will be triggered by initI18n()
  initI18n(); // << Added: Initialize i18n
  updateCurrentTime();
  setInterval(updateCurrentTime, 1000);

  // Event listeners
  // statusFilter.addEventListener("change", renderTasks); // Will be triggered by changeLanguage or after applyTranslations
  if (statusFilter) {
    statusFilter.addEventListener("change", renderTasks);
  }

  // Added: Search and sort event listeners
  const searchInput = document.getElementById("search-input");
  const sortOptions = document.getElementById("sort-options");

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchTerm = e.target.value.toLowerCase();
      renderTasks();
    });
  }

  if (sortOptions) {
    sortOptions.addEventListener("change", (e) => {
      sortOption = e.target.value;
      renderTasks();
    });
  }

  // Added: Set up SSE connection
  setupSSE();

  // Added: Language switcher event listener
  if (langSwitcher) {
    langSwitcher.addEventListener("change", (e) =>
      changeLanguage(e.target.value)
    );
  }
});

// Added: i18n core functions
// 1. Language detection (localStorage > navigator.language > 'en')
function detectLanguage() {
  const savedLang = localStorage.getItem("lang");
  if (savedLang && ["en",].includes(savedLang)) {
    // Ensure saved language is valid
    return savedLang;
  }
  // Check browser language
  const browserLang = navigator.language || navigator.userLanguage;
  if (browserLang) {
   return "en";
  }
  return "en"; // Default
}

// 2. Asynchronously load translation files
async function loadTranslations(lang) {
  try {
    const response = await fetch(`/locales/${lang}.json`);
    if (!response.ok) {
      throw new Error(
        `Failed to load ${lang}.json, status: ${response.status}`
      );
    }
    translations = await response.json();
    console.log(`Translations loaded for ${lang}`);
  } catch (error) {
    console.error("Error loading translations:", error);
    if (lang !== "en") {
      console.warn(`Falling back to English translations.`);
      await loadTranslations("en"); // Fallback to English
    } else {
      translations = {}; // Clear translations if even English fails
      // Maybe display a more persistent error message?
      alert("Critical error: Could not load language files.");
    }
  }
}

// 3. Translation function
function translate(key, replacements = {}) {
  let translated = translations[key] || key; // Fallback to key itself
  // Simple placeholder replacement (e.g., {message})
  for (const placeholder in replacements) {
    translated = translated.replace(
      `{${placeholder}}`,
      replacements[placeholder]
    );
  }
  return translated;
}

// 4. Apply translations to DOM (handle textContent, placeholder, title)
function applyTranslations() {
  console.log("Applying translations for:", currentLang);
  document.querySelectorAll("[data-i18n-key]").forEach((el) => {
    const key = el.dataset.i18nKey;
    const translatedText = translate(key);

    // Prioritize specific attributes
    if (el.hasAttribute("placeholder")) {
      el.placeholder = translatedText;
    } else if (el.hasAttribute("title")) {
      el.title = translatedText;
    } else if (el.tagName === "OPTION") {
      el.textContent = translatedText;
      // Can translate value if needed, but usually not necessary
    } else {
      // For most elements, set textContent
      el.textContent = translatedText;
    }
  });
  // Manually update elements without data-key (if any)
  // For example, if footer time format needs localization, handle it here
  // updateCurrentTime(); // Ensure time format might also update (if needed)
}

// 5. Initialize i18n
async function initI18n() {
  currentLang = detectLanguage();
  console.log(`Initializing i18n with language: ${currentLang}`);
  localStorage.setItem("lang", currentLang); // Ensure lang is saved
  // << Added: Set switcher's initial value >>
  if (langSwitcher) {
    langSwitcher.value = currentLang;
  }
  await loadTranslations(currentLang);
  applyTranslations();
  await fetchTasks();
}

// Added: Language switching function
function changeLanguage(lang) {
  if (!lang ) {
    console.warn(`Invalid language selected: ${lang}. Defaulting to English.`);
    lang = "en";
  }
  currentLang = lang;
  localStorage.setItem("lang", lang);
  console.log(`Changing language to: ${currentLang}`);
  loadTranslations(currentLang)
    .then(() => {
      console.log("Translations reloaded, applying...");
      applyTranslations();
      console.log("Re-rendering components...");
      // Re-render components that need translation
      renderTasks();
      if (selectedTaskId) {
        const task = tasks.find((t) => t.id === selectedTaskId);
        if (task) {
          selectTask(selectedTaskId); // Ensure ID is passed, let selectTask find and render
        } else {
          // If selected task no longer exists, clear details
          taskDetailsContent.innerHTML = `<p class="placeholder">${translate(
            "task_details_placeholder"
          )}</p>`;
          selectedTaskId = null;
          highlightNode(null);
        }
      } else {
        // If no task is selected, ensure details panel shows placeholder
        taskDetailsContent.innerHTML = `<p class="placeholder">${translate(
          "task_details_placeholder"
        )}</p>`;
      }
      renderDependencyGraph(); // Re-render graph (may include placeholder)
      updateProgressIndicator(); // Re-render progress bar (including labels)
      renderGlobalAnalysisResult(); // Re-render global analysis (title)
      // Ensure dropdown value matches current language
      if (langSwitcher) langSwitcher.value = currentLang;
      console.log("Language change complete.");
    })
    .catch((error) => {
      console.error("Error changing language:", error);
      // Can add user feedback, e.g., display error message
      showTemporaryError("Failed to change language. Please try again."); // Need translation key
    });
}
// --- i18n core functions end ---

// Fetch task data
async function fetchTasks() {
  try {
    // Display loading during initial load (now using translation)
    if (tasks.length === 0) {
      taskListElement.innerHTML = `<div class="loading">${translate(
        "task_list_loading"
      )}</div>`;
    }

    const response = await fetch("/api/tasks");

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const newTasks = data.tasks || [];

    // Extract global analysis result (find first non-empty)
    let foundAnalysisResult = null;
    for (const task of newTasks) {
      if (task.analysisResult) {
        foundAnalysisResult = task.analysisResult;
        break; // One is enough
      }
    }
    // Update only when found result differs from current stored result
    if (foundAnalysisResult !== globalAnalysisResult) {
      globalAnalysisResult = foundAnalysisResult;
      renderGlobalAnalysisResult(); // Update display
    }

    // --- Smart update logic (preliminary - still needs improvement to avoid flickering) ---
    // Simply compare task count or identifiers to decide whether to re-render
    // Ideally should compare each task's content and perform DOM update
    const tasksChanged = didTasksChange(tasks, newTasks);

    if (tasksChanged) {
      tasks = newTasks; // Update global task list
      console.log("Tasks updated via fetch, re-rendering...");
      renderTasks();
      updateProgressIndicator();
      renderDependencyGraph(); // Update graph
    } else {
      console.log(
        "No significant task changes detected, skipping full re-render."
      );
      // If list re-render not needed, might just update progress bar
      updateProgressIndicator();
      // Consider whether graph needs update (if state might change)
      // renderDependencyGraph(); // Temporarily commented out unless state change is critical
    }

    // *** Remove setTimeout polling ***
    // setTimeout(fetchTasks, 30000);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    // Avoid overwriting existing list, unless initial load fails
    if (tasks.length === 0) {
      taskListElement.innerHTML = `<div class="error">${translate(
        "error_loading_tasks",
        { message: error.message }
      )}</div>`;
      if (progressIndicator) progressIndicator.style.display = "none";
      if (dependencyGraphElement)
        dependencyGraphElement.innerHTML = `<div class="error">${translate(
          "error_loading_graph"
        )}</div>`;
    } else {
      showTemporaryError(
        translate("error_updating_tasks", { message: error.message })
      );
    }
  }
}

// Added: Set up Server-Sent Events connection
function setupSSE() {
  console.log("Setting up SSE connection to /api/tasks/stream");
  const evtSource = new EventSource("/api/tasks/stream");

  evtSource.onmessage = function (event) {
    console.log("SSE message received:", event.data);
    // Can do more complex checks based on event.data content, currently just update on any message
  };

  evtSource.addEventListener("update", function (event) {
    console.log("SSE 'update' event received:", event.data);
    // Received update event, re-fetch task list
    fetchTasks();
  });

  evtSource.onerror = function (err) {
    console.error("EventSource failed:", err);
    // Can implement reconnection logic
    evtSource.close(); // Close the failed connection
    // Attempt to reconnect after a delay
    setTimeout(setupSSE, 5000); // Retry after 5 seconds
  };

  evtSource.onopen = function () {
    console.log("SSE connection opened.");
  };
}

// Added: Comprehensive helper function to compare task lists
function didTasksChange(oldTasks, newTasks) {
  if (!oldTasks || !newTasks) return true; // Handle initial load or error states

  if (oldTasks.length !== newTasks.length) {
    console.log("Task length changed.");
    return true; // Length change definitely needs update
  }

  const oldTaskMap = new Map(oldTasks.map((task) => [task.id, task]));
  const newTaskIds = new Set(newTasks.map((task) => task.id)); // For checking removed tasks

  // Check for removed tasks first
  for (const oldTask of oldTasks) {
    if (!newTaskIds.has(oldTask.id)) {
      console.log(`Task removed: ${oldTask.id}`);
      return true;
    }
  }

  // Check for new or modified tasks
  for (const newTask of newTasks) {
    const oldTask = oldTaskMap.get(newTask.id);
    if (!oldTask) {
      console.log(`New task found: ${newTask.id}`);
      return true; // New task ID found
    }

    // Compare relevant fields
    const fieldsToCompare = [
      "name",
      "description",
      "status",
      "notes",
      "implementationGuide",
      "verificationCriteria",
      "summary",
    ];

    for (const field of fieldsToCompare) {
      if (oldTask[field] !== newTask[field]) {
        // Handle null/undefined comparisons carefully if needed
        // e.g., !(oldTask[field] == null && newTask[field] == null) checks if one is null/undefined and the other isn't
        if (
          !(oldTask[field] === null && newTask[field] === null) &&
          !(oldTask[field] === undefined && newTask[field] === undefined)
        ) {
          console.log(`Task ${newTask.id} changed field: ${field}`);
          return true;
        }
      }
    }

    // Compare dependencies (array of strings or objects)
    if (!compareDependencies(oldTask.dependencies, newTask.dependencies)) {
      console.log(`Task ${newTask.id} changed field: dependencies`);
      return true;
    }

    // Compare relatedFiles (array of objects) - simple length check first
    if (!compareRelatedFiles(oldTask.relatedFiles, newTask.relatedFiles)) {
      console.log(`Task ${newTask.id} changed field: relatedFiles`);
      return true;
    }

    // Optional: Compare updatedAt as a final check if other fields seem identical
    if (oldTask.updatedAt?.toString() !== newTask.updatedAt?.toString()) {
      console.log(`Task ${newTask.id} changed field: updatedAt (fallback)`);
      return true;
    }
  }

  return false; // No significant changes detected
}

// Helper function to compare dependency arrays
function compareDependencies(deps1, deps2) {
  const arr1 = deps1 || [];
  const arr2 = deps2 || [];

  if (arr1.length !== arr2.length) return false;

  // Extract IDs whether they are strings or objects {taskId: string}
  const ids1 = new Set(
    arr1.map((dep) =>
      typeof dep === "object" && dep !== null ? dep.taskId : dep
    )
  );
  const ids2 = new Set(
    arr2.map((dep) =>
      typeof dep === "object" && dep !== null ? dep.taskId : dep
    )
  );

  if (ids1.size !== ids2.size) return false; // Different number of unique dependencies
  for (const id of ids1) {
    if (!ids2.has(id)) return false;
  }
  return true;
}

// Helper function to compare relatedFiles arrays (can be simple or complex)
function compareRelatedFiles(files1, files2) {
  const arr1 = files1 || [];
  const arr2 = files2 || [];

  if (arr1.length !== arr2.length) return false;

  // Simple comparison: check if paths and types are the same in the same order
  // For a more robust check, convert to Sets of strings like `path|type` or do deep object comparison
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i].path !== arr2[i].path || arr1[i].type !== arr2[i].type) {
      return false;
    }
    // Add more field comparisons if needed (description, lines, etc.)
    // if (arr1[i].description !== arr2[i].description) return false;
  }
  return true;
}

// Added: Function to display temporary error message
function showTemporaryError(message) {
  const errorElement = document.createElement("div");
  errorElement.className = "temporary-error";
  errorElement.textContent = message; // Keep the message as is
  document.body.appendChild(errorElement);
  setTimeout(() => {
    errorElement.remove();
  }, 3000); // Display for 3 seconds
}

// 渲染任務列表 - *** 需要進一步優化以實現智慧更新 ***
function renderTasks() {
  console.log("Rendering tasks..."); // 添加日誌
  const filterValue = statusFilter.value;

  let filteredTasks = tasks;
  if (filterValue !== "all") {
    filteredTasks = filteredTasks.filter((task) => task.status === filterValue);
  }

  if (searchTerm) {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    filteredTasks = filteredTasks.filter(
      (task) =>
        (task.name && task.name.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (task.description &&
          task.description.toLowerCase().includes(lowerCaseSearchTerm))
    );
  }

  filteredTasks.sort((a, b) => {
    switch (sortOption) {
      case "name-asc":
        return (a.name || "").localeCompare(b.name || "");
      case "name-desc":
        return (b.name || "").localeCompare(a.name || "");
      case "status":
        const statusOrder = { pending: 1, in_progress: 2, completed: 3 };
        return (statusOrder[a.status] || 0) - (statusOrder[b.status] || 0);
      case "date-asc":
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      case "date-desc":
      default:
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    }
  });

  // --- 簡單粗暴的替換 (會導致閃爍) ---
  // TODO: 實現 DOM Diffing 或更智慧的更新策略
  if (filteredTasks.length === 0) {
    taskListElement.innerHTML = `<div class="placeholder">${translate(
      "task_list_empty"
    )}</div>`;
  } else {
    taskListElement.innerHTML = filteredTasks
      .map(
        (task) => `
            <div class="task-item status-${task.status.replace(
              "_",
              "-"
            )}" data-id="${task.id}" onclick="selectTask('${task.id}')">
            <h3>${task.name}</h3>
            <div class="task-meta">
                <span class="task-status status-${task.status.replace(
                  "_",
                  "-"
                )}">${getStatusText(task.status)}</span>
            </div>
            </div>
        `
      )
      .join("");
  }
  // --- 結束簡單粗暴的替換 ---

  // 重新應用選中狀態
  if (selectedTaskId) {
    const taskExists = tasks.some((t) => t.id === selectedTaskId);
    if (taskExists) {
      const selectedElement = document.querySelector(
        `.task-item[data-id="${selectedTaskId}"]`
      );
      if (selectedElement) {
        selectedElement.classList.add("selected");
      }
    } else {
      // 如果選中的任務在新的列表中不存在了，清除選擇
      console.log(
        `Selected task ${selectedTaskId} no longer exists, clearing selection.`
      );
      selectedTaskId = null;
      taskDetailsContent.innerHTML = `<p class="placeholder">${translate(
        "task_details_placeholder"
      )}</p>`;
      highlightNode(null); // 清除圖表高亮
    }
  }
}

// 選擇任務
function selectTask(taskId) {
  // 清除舊的選中狀態和高亮
  if (selectedTaskId) {
    const previousElement = document.querySelector(
      `.task-item[data-id="${selectedTaskId}"]`
    );
    if (previousElement) {
      previousElement.classList.remove("selected");
    }
  }

  // 如果再次點擊同一個任務，則取消選中
  if (selectedTaskId === taskId) {
    selectedTaskId = null;
    taskDetailsContent.innerHTML = `<p class="placeholder">${translate(
      "task_details_placeholder"
    )}</p>`;
    highlightNode(null); // 取消高亮
    return;
  }

  selectedTaskId = taskId;

  // 添加新的選中狀態
  const selectedElement = document.querySelector(
    `.task-item[data-id="${taskId}"]`
  );
  if (selectedElement) {
    selectedElement.classList.add("selected");
  }

  // 獲取並顯示任務詳情
  const task = tasks.find((t) => t.id === taskId);

  if (!task) {
    taskDetailsContent.innerHTML = `<div class="placeholder">${translate(
      "error_task_not_found"
    )}</div>`;
    return;
  }

  // --- 安全地填充任務詳情 ---
  // 1. 創建基本骨架 (使用 innerHTML，但將動態內容替換為帶 ID 的空元素)
  taskDetailsContent.innerHTML = `
    <div class="task-details-header">
      <h3 id="detail-name"></h3>
      <div class="task-meta">
        <span>狀態: <span id="detail-status" class="task-status"></span></span>
      </div>
    </div>
    
    <!-- 新增：條件顯示 Summary -->
    <div class="task-details-section" id="detail-summary-section" style="display: none;">
      <h4>完成摘要</h4>
      <p id="detail-summary"></p>
    </div>
    
    <div class="task-details-section">
      <h4>任務描述</h4>
      <p id="detail-description"></p>
    </div>
    
    <div class="task-details-section">
      <h4>實現指南</h4>
      <pre id="detail-implementation-guide"></pre>
    </div>
    
    <div class="task-details-section">
      <h4>驗證標準</h4>
      <p id="detail-verification-criteria"></p>
    </div>
    
    <div class="task-details-section">
      <h4>依賴項 (前置任務)</h4>
      <div class="dependencies" id="detail-dependencies">
        <!-- Dependencies will be populated by JS -->
      </div>
    </div>
    
    <div class="task-details-section">
      <h4>相關文件</h4>
      <div class="related-files" id="detail-related-files">
        <!-- Related files will be populated by JS -->
      </div>
    </div>

    <div class="task-details-section">
      <h4>備註</h4>
      <p id="detail-notes"></p>
    </div>
  `;

  // 2. 獲取對應元素並使用 textContent 安全地填充內容
  const detailName = document.getElementById("detail-name");
  const detailStatus = document.getElementById("detail-status");
  const detailDescription = document.getElementById("detail-description");
  const detailImplementationGuide = document.getElementById(
    "detail-implementation-guide"
  );
  const detailVerificationCriteria = document.getElementById(
    "detail-verification-criteria"
  );
  // 新增：獲取 Summary 相關元素
  const detailSummarySection = document.getElementById(
    "detail-summary-section"
  );
  const detailSummary = document.getElementById("detail-summary");
  const detailNotes = document.getElementById("detail-notes");
  const detailDependencies = document.getElementById("detail-dependencies");
  const detailRelatedFiles = document.getElementById("detail-related-files");

  if (detailName) detailName.textContent = task.name;
  if (detailStatus) {
    detailStatus.textContent = getStatusText(task.status);
    detailStatus.className = `task-status status-${task.status.replace(
      "_",
      "-"
    )}`;
  }
  if (detailDescription)
    detailDescription.textContent =
      task.description || translate("task_detail_no_description");
  if (detailImplementationGuide)
    detailImplementationGuide.textContent =
      task.implementationGuide ||
      translate("task_detail_no_implementation_guide");
  if (detailVerificationCriteria)
    detailVerificationCriteria.textContent =
      task.verificationCriteria ||
      translate("task_detail_no_verification_criteria");

  // 新增：填充 Summary (如果存在且已完成)
  if (task.summary && detailSummarySection && detailSummary) {
    detailSummary.textContent = task.summary;
    detailSummarySection.style.display = "block"; // 顯示區塊
  } else if (detailSummarySection) {
    detailSummarySection.style.display = "none"; // 隱藏區塊
  }

  if (detailNotes)
    detailNotes.textContent = task.notes || translate("task_detail_no_notes");

  // 3. 動態生成依賴項和相關文件 (這些可以包含安全的 HTML 結構如 span)
  if (detailDependencies) {
    const dependenciesHtml =
      task.dependencies && task.dependencies.length
        ? task.dependencies
            .map((dep) => {
              const depId =
                typeof dep === "object" && dep !== null && dep.taskId
                  ? dep.taskId
                  : dep;
              const depTask = tasks.find((t) => t.id === depId);
              // Translate the fallback text for unknown dependency
              const depName = depTask
                ? depTask.name
                : `${translate("task_detail_unknown_dependency")}(${depId})`;
              const span = document.createElement("span");
              span.className = "dependency-tag";
              span.dataset.id = depId;
              span.textContent = depName;
              span.onclick = () => highlightNode(depId);
              return span.outerHTML;
            })
            .join("")
        : `<span class="placeholder">${translate(
            "task_detail_no_dependencies"
          )}</span>`; // Translate placeholder
    detailDependencies.innerHTML = dependenciesHtml;
  }

  if (detailRelatedFiles) {
    const relatedFilesHtml =
      task.relatedFiles && task.relatedFiles.length
        ? task.relatedFiles
            .map((file) => {
              const span = document.createElement("span");
              span.className = "file-tag";
              span.title = file.description || "";
              const pathText = document.createTextNode(`${file.path} `);
              const small = document.createElement("small");
              small.textContent = `(${file.type})`; // Type is likely technical, maybe no translation needed?
              span.appendChild(pathText);
              span.appendChild(small);
              return span.outerHTML;
            })
            .join("")
        : `<span class="placeholder">${translate(
            "task_detail_no_related_files"
          )}</span>`; // Translate placeholder
    detailRelatedFiles.innerHTML = relatedFilesHtml;
  }

  // --- 原來的 innerHTML 賦值已移除 ---

  // 只調用高亮函數
  highlightNode(taskId); // 只調用 highlightNode
}

// 渲染依賴關係圖 - 修改為全局視圖和 enter/update/exit 模式
function renderDependencyGraph() {
  if (!dependencyGraphElement || !window.d3) {
    console.warn("D3 or dependency graph element not found.");
    if (dependencyGraphElement) {
      // 首次或D3丟失時顯示提示，不清空已有的圖
      if (!dependencyGraphElement.querySelector("svg")) {
        dependencyGraphElement.innerHTML = `<p class="placeholder">${translate(
          "error_loading_graph_d3" // Use a specific key
        )}</p>`;
      }
    }
    return;
  }

  // 如果沒有任務，清空圖表並顯示提示
  if (tasks.length === 0) {
    dependencyGraphElement.innerHTML = `<p class="placeholder">${translate(
      "dependency_graph_placeholder_empty"
    )}</p>`;
    // 重置 SVG 和 simulation 變數，以便下次正確初始化
    svg = null;
    g = null;
    simulation = null;
    return;
  }

  // 1. 準備節點 (Nodes) 和連結 (Links)
  const nodes = tasks.map((task) => ({
    id: task.id,
    name: task.name,
    status: task.status,
    // 保留現有位置以便平滑過渡
    x: simulation?.nodes().find((n) => n.id === task.id)?.x,
    y: simulation?.nodes().find((n) => n.id === task.id)?.y,
    fx: simulation?.nodes().find((n) => n.id === task.id)?.fx, // 保留固定位置
    fy: simulation?.nodes().find((n) => n.id === task.id)?.fy,
  }));

  const links = [];
  tasks.forEach((task) => {
    if (task.dependencies && task.dependencies.length > 0) {
      task.dependencies.forEach((dep) => {
        const sourceId = typeof dep === "object" ? dep.taskId : dep;
        const targetId = task.id;
        if (
          nodes.some((n) => n.id === sourceId) &&
          nodes.some((n) => n.id === targetId)
        ) {
          // 確保 link 的 source/target 是 ID，以便力導向識別
          links.push({ source: sourceId, target: targetId });
        } else {
          console.warn(
            `Dependency link ignored: Task ${sourceId} or ${targetId} not found in task list.`
          );
        }
      });
    }
  });

  // 2. D3 繪圖設置與更新
  const width = dependencyGraphElement.clientWidth;
  const height = dependencyGraphElement.clientHeight || 400;

  if (!svg) {
    // --- 首次渲染 ---
    console.log("First render of dependency graph");
    dependencyGraphElement.innerHTML = ""; // 清空 placeholder

    svg = d3
      .select(dependencyGraphElement)
      .append("svg")
      .attr("viewBox", [0, 0, width, height])
      .attr("preserveAspectRatio", "xMidYMid meet");

    g = svg.append("g"); // 主要組，用於縮放和平移

    // 添加縮放和平移
    svg.call(
      d3.zoom().on("zoom", (event) => {
        g.attr("transform", event.transform);
      })
    );

    // 添加箭頭定義
    g.append("defs")
      .append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "-0 -5 10 10")
      .attr("refX", 25)
      .attr("refY", 0)
      .attr("orient", "auto")
      .attr("markerWidth", 8)
      .attr("markerHeight", 8)
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#999");

    // 初始化力導向模擬
    simulation = d3
      .forceSimulation() // 初始化時不傳入 nodes
      .force(
        "link",
        d3
          .forceLink()
          .id((d) => d.id)
          .distance(100) // 指定 id 訪問器
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(30))
      .on("tick", ticked); // 綁定 tick 事件處理函數

    // 添加用於存放連結和節點的組
    g.append("g").attr("class", "links");
    g.append("g").attr("class", "nodes");
  } else {
    // --- 更新渲染 ---
    console.log("Updating dependency graph");
    // 更新 SVG 尺寸和中心力 (如果窗口大小改變)
    svg.attr("viewBox", [0, 0, width, height]);
    simulation.force("center", d3.forceCenter(width / 2, height / 2));
  }

  // 3. 更新連結
  const linkSelection = g
    .select(".links") // 選擇放置連結的 g 元素
    .selectAll("line.link")
    .data(
      links,
      (d) => `${d.source.id || d.source}-${d.target.id || d.target}`
    ); // Key function 基於 source/target ID

  // Exit - 移除舊連結
  linkSelection
    .exit()
    .transition("exit")
    .duration(300)
    .attr("stroke-opacity", 0)
    .remove();

  // Enter - 添加新連結
  const linkEnter = linkSelection
    .enter()
    .append("line")
    .attr("class", "link")
    .attr("stroke", "#999")
    .attr("marker-end", "url(#arrowhead)")
    .attr("stroke-opacity", 0); // 初始透明

  // Update + Enter - 更新所有連結的屬性 (合併 enter 和 update 選擇集)
  const linkUpdate = linkSelection.merge(linkEnter);

  linkUpdate
    .transition("update")
    .duration(500)
    .attr("stroke-opacity", 0.6)
    .attr("stroke-width", 1.5);

  // 4. 更新節點
  const nodeSelection = g
    .select(".nodes") // 選擇放置節點的 g 元素
    .selectAll("g.node-item")
    .data(nodes, (d) => d.id); // 使用 ID 作為 key

  // Exit - 移除舊節點
  nodeSelection
    .exit()
    .transition("exit")
    .duration(300)
    .attr("transform", (d) => `translate(${d.x || 0}, ${d.y || 0}) scale(0)`) // 從當前位置縮放消失
    .attr("opacity", 0)
    .remove();

  // Enter - 添加新節點組
  const nodeEnter = nodeSelection
    .enter()
    .append("g")
    .attr("class", (d) => `node-item status-${getStatusClass(d.status)}`) // 使用輔助函數設置 class
    .attr("data-id", (d) => d.id)
    // 初始位置：從模擬計算的位置（如果存在）或隨機位置出現，初始縮放為0
    .attr(
      "transform",
      (d) =>
        `translate(${d.x || Math.random() * width}, ${
          d.y || Math.random() * height
        }) scale(0)`
    )
    .attr("opacity", 0)
    .call(drag(simulation)); // 添加拖拽

  // 添加圓形到 Enter 選擇集
  nodeEnter
    .append("circle")
    .attr("r", 10)
    .attr("stroke", "#fff")
    .attr("stroke-width", 1.5);
  // 顏色將在 merge 後通過 update 過渡設置

  // 添加文字到 Enter 選擇集
  nodeEnter
    .append("text")
    .attr("x", 15)
    .attr("y", 3)
    .text((d) => d.name)
    .attr("font-size", "10px")
    .attr("fill", "#ccc");

  // 添加標題 (tooltip) 到 Enter 選擇集
  nodeEnter
    .append("title")
    .text((d) => `${d.name} (${getStatusText(d.status)})`);

  // 添加點擊事件到 Enter 選擇集
  nodeEnter.on("click", (event, d) => {
    selectTask(d.id);
    event.stopPropagation();
  });

  // Update + Enter - 合併並更新所有節點
  const nodeUpdate = nodeSelection.merge(nodeEnter);

  // 過渡到最終位置和狀態
  nodeUpdate
    .transition("update")
    .duration(500)
    .attr("transform", (d) => `translate(${d.x || 0}, ${d.y || 0}) scale(1)`) // 移動到模擬位置並恢復大小
    .attr("opacity", 1);

  // 更新節點顏色 (單獨過渡)
  nodeUpdate
    .select("circle")
    .transition("color")
    .duration(500)
    .attr("fill", getNodeColor); // 使用已有的 getNodeColor 函數

  // 更新節點狀態 Class (即時更新，無需過渡)
  nodeUpdate.attr(
    "class",
    (d) => `node-item status-${getStatusClass(d.status)}`
  );

  // << 新增：重新定義 drag 函數 >>
  function drag(simulation) {
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      // 取消固定位置，讓節點可以繼續被力導引影響 (如果需要)
      // d.fx = null;
      // d.fy = null;
      // 或者保留固定位置直到再次拖動
    }

    return d3
      .drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  }
  // << drag 函數定義結束 >>

  // 5. 更新力導向模擬
  simulation.nodes(nodes); // 在處理完 enter/exit 後更新模擬節點
  simulation.force("link").links(links); // 更新模擬連結
  simulation.alpha(0.3).restart(); // 重新激活模擬
}

// Tick 函數: 更新節點和連結位置
function ticked() {
  if (!g) return;

  // 更新連結位置
  g.select(".links")
    .selectAll("line.link")
    .attr("x1", (d) => d.source.x)
    .attr("y1", (d) => d.source.y)
    .attr("x2", (d) => d.target.x)
    .attr("y2", (d) => d.target.y);

  // 更新節點組位置
  g.select(".nodes")
    .selectAll("g.node-item")
    // << 修改：添加座標後備值 >>
    .attr("transform", (d) => `translate(${d.x || 0}, ${d.y || 0})`);
}

// 函數：根據節點數據返回顏色 (示例)
function getNodeColor(nodeData) {
  switch (nodeData.status) {
    case "已完成":
      return "var(--secondary-color)";
    case "進行中":
      return "var(--primary-color)";
    case "待處理":
      return "#f1c40f"; // 與進度條和狀態標籤一致
    default:
      return "#7f8c8d"; // 未知狀態
  }
}

// 輔助函數
function getStatusText(status) {
  switch (status) {
    case "pending":
      return translate("status_pending");
    case "in_progress":
      return translate("status_in_progress");
    case "completed":
      return translate("status_completed");
    default:
      return status;
  }
}

function updateCurrentTime() {
  const now = new Date();
  // 保留原始格式，如果需要本地化時間，可以在此處使用 translate 或其他庫
  const timeString = now.toLocaleString(); // 考慮是否需要基於 currentLang 格式化
  if (currentTimeElement) {
    // 將靜態文本和動態時間分開
    const footerTextElement = currentTimeElement.parentNode.childNodes[0];
    if (footerTextElement && footerTextElement.nodeType === Node.TEXT_NODE) {
      footerTextElement.nodeValue = translate("footer_copyright");
    }
    currentTimeElement.textContent = timeString;
  }
}
// 更新項目進度指示器
function updateProgressIndicator() {
  const totalTasks = tasks.length;
  if (totalTasks === 0) {
    progressIndicator.style.display = "none"; // 沒有任務時隱藏
    return;
  }

  progressIndicator.style.display = "block"; // 確保顯示

  const completedTasks = tasks.filter(
    (task) => task.status === "已完成"
  ).length;
  const inProgressTasks = tasks.filter(
    (task) => task.status === "進行中"
  ).length;
  const pendingTasks = tasks.filter((task) => task.status === "待處理").length;

  const completedPercent =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const inProgressPercent =
    totalTasks > 0 ? (inProgressTasks / totalTasks) * 100 : 0;
  const pendingPercent = totalTasks > 0 ? (pendingTasks / totalTasks) * 100 : 0;

  progressCompleted.style.width = `${completedPercent}%`;
  progressInProgress.style.width = `${inProgressPercent}%`;
  progressPending.style.width = `${pendingPercent}%`;

  // 更新標籤 (使用 translate)
  progressLabels.innerHTML = `
    <span class="label-completed">${translate(
      "progress_completed"
    )}: ${completedTasks} (${completedPercent.toFixed(1)}%)</span>
    <span class="label-in-progress">${translate(
      "progress_in_progress"
    )}: ${inProgressTasks} (${inProgressPercent.toFixed(1)}%)</span>
    <span class="label-pending">${translate(
      "progress_pending"
    )}: ${pendingTasks} (${pendingPercent.toFixed(1)}%)</span>
    <span class="label-total">${translate(
      "progress_total"
    )}: ${totalTasks}</span>
  `;
}

// 新增：渲染全局分析結果
function renderGlobalAnalysisResult() {
  let targetElement = document.getElementById("global-analysis-result");

  // 如果元素不存在，嘗試創建並添加到合適的位置 (例如 header 或 main content 前)
  if (!targetElement) {
    targetElement = document.createElement("div");
    targetElement.id = "global-analysis-result";
    targetElement.className = "global-analysis-section"; // 添加樣式 class
    // 嘗試插入到 header 之後或 main 之前
    const header = document.querySelector("header");
    const mainContent = document.querySelector("main");
    if (header && header.parentNode) {
      header.parentNode.insertBefore(targetElement, header.nextSibling);
    } else if (mainContent && mainContent.parentNode) {
      mainContent.parentNode.insertBefore(targetElement, mainContent);
    } else {
      // 作為最後手段，添加到 body 開頭
      document.body.insertBefore(targetElement, document.body.firstChild);
    }
  }

  if (globalAnalysisResult) {
    targetElement.innerHTML = `
            <h4 data-i18n-key="global_analysis_title">${translate(
              "global_analysis_title"
            )}</h4> 
            <pre>${globalAnalysisResult}</pre> 
        `;
    targetElement.style.display = "block";
  } else {
    targetElement.style.display = "none"; // 如果沒有結果則隱藏
    targetElement.innerHTML = ""; // 清空內容
  }
}

// 新增：高亮依賴圖中的節點
function highlightNode(taskId, status = null) {
  if (!g || !window.d3) return;

  // 清除所有節點的高亮
  g.select(".nodes") // 從 g 開始選擇
    .selectAll("g.node-item")
    .classed("highlighted", false);

  if (!taskId) return;

  // 高亮選中的節點
  const selectedNode = g
    .select(".nodes") // 從 g 開始選擇
    .select(`g.node-item[data-id="${taskId}"]`);
  if (!selectedNode.empty()) {
    selectedNode.classed("highlighted", true);
    // 可以選擇性地將選中節點帶到最前面
    // selectedNode.raise();
  }
}

// 新增：輔助函數獲取狀態 class (應放在 ticked 函數之後，getNodeColor 之前或之後均可)
function getStatusClass(status) {
  return status ? status.replace(/_/g, "-") : "unknown"; // 替換所有下劃線
}

// 函數：啟用節點拖拽 (保持不變)
// ... drag ...
